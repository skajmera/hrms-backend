/**
 * Utility for Azure Face API verification.
 * Currently implemented as a placeholder or basic wrapper.
 */
export declare class AzureFaceService {
    private static readonly ENDPOINT;
    private static readonly KEY;
    /**
     * Verifies if a detected face matches a registered person.
     * @param faceId Temporary face ID from detection
     * @param personId Registered Azure Person ID
     * @param personGroupId Azure Person Group ID (usually Organization ID or slug)
     * @returns Promise<boolean>
     */
    static verifyFace(faceId: string, personId: string, personGroupId: string): Promise<boolean>;
    /**
     * Detects a face in an image and returns a temporary faceId.
     * @param imageBuffer Buffered image (selfie)
     * @returns Promise<string>
     */
    static detectFace(imageBuffer: Buffer | string): Promise<string>;
    /**
     * Enrolls a person in a person group and adds their face.
     * @param personGroupId Azure Person Group ID
     * @param name Person name
     * @param imageBuffer Buffered image (selfie)
     * @returns Promise<string> personId
     */
    static enrollPerson(personGroupId: string, name: string, imageBuffer: Buffer | string): Promise<string>;
}
//# sourceMappingURL=azureFace.d.ts.map