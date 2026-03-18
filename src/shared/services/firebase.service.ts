import * as admin from 'firebase-admin';

class FirebaseService {
    private isInitialized = false;

    constructor() {
        this.init();
    }

    private init() {
        try {
            /**
             * Preferred: initialize from environment variables so that
             * credentials are not stored in the repository.
             *
             * Required env vars:
             *  - FIREBASE_PROJECT_ID
             *  - FIREBASE_CLIENT_EMAIL
             *  - FIREBASE_PRIVATE_KEY (with \\n for newlines)
             */
            const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, GOOGLE_APPLICATION_CREDENTIALS } = process.env;

            if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
                const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: FIREBASE_PROJECT_ID,
                        clientEmail: FIREBASE_CLIENT_EMAIL,
                        privateKey
                    })
                });

                this.isInitialized = true;
                console.log('Firebase Admin SDK initialized using environment variables');
                return;
            }

            /**
             * Secondary option: rely on Google Application Default Credentials.
             * This works when GOOGLE_APPLICATION_CREDENTIALS is set or when
             * running on GCP with a service account attached.
             */
            if (GOOGLE_APPLICATION_CREDENTIALS) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault()
                });

                this.isInitialized = true;
                console.log('Firebase Admin SDK initialized using application default credentials');
                return;
            }

            console.warn('⚠️ Firebase credentials not configured. Set FIREBASE_* env vars or GOOGLE_APPLICATION_CREDENTIALS. Push notifications are disabled.');
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
