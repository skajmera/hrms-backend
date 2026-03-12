declare class FirebaseService {
    private isInitialized;
    constructor();
    private init;
    /**
     * Send a push notification to multiple devices securely via FCM
     */
    sendPushNotification(fcmTokens: string[], title: string, body: string, dataPayload?: Record<string, string>): Promise<void>;
}
export declare const firebaseService: FirebaseService;
export {};
//# sourceMappingURL=firebase.service.d.ts.map