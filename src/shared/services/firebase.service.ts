import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

class FirebaseService {
    private isInitialized = false;

    constructor() {
        this.init();
    }

    private init() {
        try {
            // Look for the service account key inside the src/config folder
            const serviceAccountPath = path.join(process.cwd(), 'src', 'config', 'service-account-key.json');

            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = require(serviceAccountPath);

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });

                this.isInitialized = true;
                console.log('Firebase Admin SDK initialized successfully');
            } else {
                console.warn('⚠️ Firebase service-account-key.json not found. Push notifications are disabled. Please place the file in the "src/config" folder.');
            }
        } catch (error) {
            console.error('Failed to initialize Firebase Admin SDK:', error);
        }
    }

    /**
     * Send a push notification to multiple devices securely via FCM
     */
    async sendPushNotification(
        fcmTokens: string[],
        title: string,
        body: string,
        dataPayload?: Record<string, string>
    ) {
        if (!this.isInitialized) {
            console.warn('Push notification skipped: Firebase not initialized.');
            return;
        }

        if (!fcmTokens || fcmTokens.length === 0) {
            return;
        }

        try {
            const message = {
                notification: {
                    title,
                    body
                },
                data: dataPayload || {},
                tokens: fcmTokens // Multicast to array of device tokens
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            // Cleanup stale tokens if any devices uninstalled the app
            if (response.failureCount > 0) {
                const failedTokens: string[] = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        // e.g. 'messaging/invalid-registration-token' or 'messaging/registration-token-not-registered'
                        failedTokens.push(fcmTokens[idx]);
                    }
                });

                if (failedTokens.length > 0) {
                    console.warn('Found stale FCM tokens, but removal cleanup logic is abstract here:', failedTokens);
                    // In an ultra-robust app, you would $pull these failed tokens from the User mongoose model.
                }
            }

        } catch (error) {
            console.error('Error sending push notification via Firebase:', error);
        }
    }
}

export const firebaseService = new FirebaseService();
