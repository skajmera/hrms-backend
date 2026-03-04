import axios from 'axios';
import { config } from '../../config/env';

/**
 * Utility for Azure Face API verification.
 * Currently implemented as a placeholder or basic wrapper.
 */
export class AzureFaceService {
    private static readonly ENDPOINT = process.env.AZURE_FACE_ENDPOINT;
    private static readonly KEY = process.env.AZURE_FACE_KEY;

    /**
     * Verifies if a detected face matches a registered person.
     * @param faceId Temporary face ID from detection
     * @param personId Registered Azure Person ID
     * @param personGroupId Azure Person Group ID (usually Organization ID or slug)
     * @returns Promise<boolean>
     */
    static async verifyFace(faceId: string, personId: string, personGroupId: string): Promise<boolean> {
        if (!this.ENDPOINT || !this.KEY) {
            console.warn('Azure Face API credentials not configured. Skipping verification (returning true).');
            return true;
        }

        try {
            // Azure expects a sanitized personGroupId (lowercase, alphanumeric, dash, underscore)
            const safeGroupId = personGroupId.toString().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

            const response = await axios.post(
                `${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons/${personId}/verify`,
                {
                    faceId
                },
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': this.KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.isIdentical && response.data.confidence > 0.5;
        } catch (error: any) {
            console.error('Azure Face API verification failed:', error.response?.data || error.message);
            throw new Error('Face verification failed');
        }
    }

    /**
     * Detects a face in an image and returns a temporary faceId.
     * @param imageBuffer Buffered image (selfie)
     * @returns Promise<string>
     */
    static async detectFace(imageBuffer: Buffer | string): Promise<string> {
        if (!this.ENDPOINT || !this.KEY) {
            return 'dummy-face-id';
        }

        try {
            // Handle string path if provided
            let data: Buffer;
            if (typeof imageBuffer === 'string') {
                const fs = await import('fs');
                data = fs.readFileSync(imageBuffer);
            } else {
                data = imageBuffer;
            }

            const response = await axios.post(
                `${this.ENDPOINT}/face/v1.0/detect?returnFaceId=true&recognitionModel=recognition_04&detectionModel=detection_01`,
                data,
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': this.KEY,
                        'Content-Type': 'application/octet-stream'
                    }
                }
            );

            if (response.data && response.data.length > 0) {
                return response.data[0].faceId;
            }
            throw new Error('No face detected in the image');
        } catch (error: any) {
            console.error('Azure Face API detection failed:', error.response?.data || error.message);
            throw new Error('Face detection failed');
        }
    }

    /**
     * Enrolls a person in a person group and adds their face.
     * @param personGroupId Azure Person Group ID
     * @param name Person name
     * @param imageBuffer Buffered image (selfie)
     * @returns Promise<string> personId
     */
    static async enrollPerson(personGroupId: string, name: string, imageBuffer: Buffer | string): Promise<string> {
        if (!this.ENDPOINT || !this.KEY) {
            return 'dummy-person-id';
        }

        try {
            const safeGroupId = personGroupId.toString().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

            // 1. Ensure Person Group exists (or create it)
            try {
                await axios.put(
                    `${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}`,
                    { name: `Group for ${personGroupId}`, recognitionModel: 'recognition_04' },
                    { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } }
                );
            } catch (e) {
                // Ignore if already exists
            }

            // 2. Create Person
            const personResponse = await axios.post(
                `${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons`,
                { name },
                { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } }
            );
            const personId = personResponse.data.personId;

            // 3. Add Face
            let data: Buffer;
            if (typeof imageBuffer === 'string') {
                const fs = await import('fs');
                data = fs.readFileSync(imageBuffer);
            } else {
                data = imageBuffer;
            }

            await axios.post(
                `${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons/${personId}/persistedFaces?detectionModel=detection_01`,
                data,
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': this.KEY,
                        'Content-Type': 'application/octet-stream'
                    }
                }
            );

            // 4. Train Group
            await axios.post(
                `${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/train`,
                {},
                { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } }
            );

            return personId;
        } catch (error: any) {
            console.error('Azure Face API enrollment failed:', error.response?.data || error.message);
            throw new Error('Face enrollment failed');
        }
    }
}
