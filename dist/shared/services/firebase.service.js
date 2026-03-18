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
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseService = void 0;
const admin = __importStar(require("firebase-admin"));
class FirebaseService {
    constructor() {
        this.isInitialized = false;
        this.init();
    }
    init() {
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
        }
        catch (error) {
            console.error('Failed to initialize Firebase Admin SDK:', error);
        }
    }
    /**
     * Send a push notification to multiple devices securely via FCM
     */
    async sendPushNotification(fcmTokens, title, body, dataPayload) {
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
                const failedTokens = [];
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
        }
        catch (error) {
            console.error('Error sending push notification via Firebase:', error);
        }
    }
}
exports.firebaseService = new FirebaseService();
//# sourceMappingURL=firebase.service.js.map