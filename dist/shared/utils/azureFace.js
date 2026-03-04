"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFaceService = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Utility for Azure Face API verification.
 * Currently implemented as a placeholder or basic wrapper.
 */
class AzureFaceService {
    /**
     * Verifies if a detected face matches a registered person.
     * @param faceId Temporary face ID from detection
     * @param personId Registered Azure Person ID
     * @param personGroupId Azure Person Group ID (usually Organization ID or slug)
     * @returns Promise<boolean>
     */
    static async verifyFace(faceId, personId, personGroupId) {
        if (!this.ENDPOINT || !this.KEY) {
            console.warn('Azure Face API credentials not configured. Skipping verification (returning true).');
            return true;
        }
        try {
            // Azure expects a sanitized personGroupId (lowercase, alphanumeric, dash, underscore)
            const safeGroupId = personGroupId.toString().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
            const response = await axios_1.default.post(`${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons/${personId}/verify`, {
                faceId
            }, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.KEY,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.isIdentical && response.data.confidence > 0.5;
        }
        catch (error) {
            console.error('Azure Face API verification failed:', error.response?.data || error.message);
            throw new Error('Face verification failed');
        }
    }
    /**
     * Detects a face in an image and returns a temporary faceId.
     * @param imageBuffer Buffered image (selfie)
     * @returns Promise<string>
     */
    static async detectFace(imageBuffer) {
        if (!this.ENDPOINT || !this.KEY) {
            return 'dummy-face-id';
        }
        try {
            // Handle string path if provided
            let data;
            if (typeof imageBuffer === 'string') {
                const fs = await Promise.resolve().then(() => __importStar(require('fs')));
                data = fs.readFileSync(imageBuffer);
            }
            else {
                data = imageBuffer;
            }
            const response = await axios_1.default.post(`${this.ENDPOINT}/face/v1.0/detect?returnFaceId=true&recognitionModel=recognition_04&detectionModel=detection_01`, data, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.KEY,
                    'Content-Type': 'application/octet-stream'
                }
            });
            if (response.data && response.data.length > 0) {
                return response.data[0].faceId;
            }
            throw new Error('No face detected in the image');
        }
        catch (error) {
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
    static async enrollPerson(personGroupId, name, imageBuffer) {
        if (!this.ENDPOINT || !this.KEY) {
            return 'dummy-person-id';
        }
        try {
            const safeGroupId = personGroupId.toString().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
            // 1. Ensure Person Group exists (or create it)
            try {
                await axios_1.default.put(`${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}`, { name: `Group for ${personGroupId}`, recognitionModel: 'recognition_04' }, { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } });
            }
            catch (e) {
                // Ignore if already exists
            }
            // 2. Create Person
            const personResponse = await axios_1.default.post(`${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons`, { name }, { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } });
            const personId = personResponse.data.personId;
            // 3. Add Face
            let data;
            if (typeof imageBuffer === 'string') {
                const fs = await Promise.resolve().then(() => __importStar(require('fs')));
                data = fs.readFileSync(imageBuffer);
            }
            else {
                data = imageBuffer;
            }
            await axios_1.default.post(`${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/persons/${personId}/persistedFaces?detectionModel=detection_01`, data, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.KEY,
                    'Content-Type': 'application/octet-stream'
                }
            });
            // 4. Train Group
            await axios_1.default.post(`${this.ENDPOINT}/face/v1.0/persongroups/${safeGroupId}/train`, {}, { headers: { 'Ocp-Apim-Subscription-Key': this.KEY } });
            return personId;
        }
        catch (error) {
            console.error('Azure Face API enrollment failed:', error.response?.data || error.message);
            throw new Error('Face enrollment failed');
        }
    }
}
exports.AzureFaceService = AzureFaceService;
AzureFaceService.ENDPOINT = process.env.AZURE_FACE_ENDPOINT;
AzureFaceService.KEY = process.env.AZURE_FACE_KEY;
//# sourceMappingURL=azureFace.js.map