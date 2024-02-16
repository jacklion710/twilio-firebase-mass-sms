import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Function to allow any admin to grant an admin role
export const addAdminRole = functions.https.onCall(async (data, context) => {
    // Check if request is made by an authenticated user
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Request must be made by an authenticated user.");
    }

    // Check if the requester has the admin attribute in their custom claims
    const requesterUid = context.auth.uid;
    const requester = await admin.auth().getUser(requesterUid);

    if (requester.customClaims && requester.customClaims.admin === true) {
        // Set custom user claim on the target user
        return admin.auth().getUserByEmail(data.email)
            .then(user => {
                return admin.auth().setCustomUserClaims(user.uid, {
                    admin: true
                });
            })
            .then(() => {
                return {
                    message: `Success: ${data.email} has been made an admin.`
                };
            })
            .catch(error => {
                throw new functions.https.HttpsError("internal", error.message);
            });
    } else {
        throw new functions.https.HttpsError("permission-denied", "Request must be made by an admin user.");
    }
});

// // Allow any authenticated user to grant admin privileges
// export const addAdminRole = functions.https.onCall(async (data, context) => {
//     // Check if request is made by an authenticated user
//     if (!context.auth) {
//         throw new functions.https.HttpsError("unauthenticated", "Request must be made by an authenticated user.");
//     }

//     // Temporarily allow any authenticated user to grant admin role
//     return admin.auth().getUserByEmail(data.email)
//         .then(user => {
//             return admin.auth().setCustomUserClaims(user.uid, {
//                 admin: true
//             });
//         })
//         .then(() => {
//             return {
//                 message: `Success: ${data.email} has been made an admin.`
//             };
//         })
//         .catch(error => {
//             throw new functions.https.HttpsError("internal", error.message);
//         });
// });

// Function to remove admin role
export const removeAdminRole = functions.https.onCall(async (data, context) => {
    // Check if request is made by an authenticated user
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Request must be made by an authenticated user.");
    }

    // Check if the requester has the admin attribute in their custom claims
    const requesterUid = context.auth.uid;
    const requester = await admin.auth().getUser(requesterUid);

    if (requester.customClaims && requester.customClaims.admin === true) {
        return admin.auth().getUserByEmail(data.email)
            .then(user => {
                console.log(`Before removing admin:`, user.customClaims); // Correctly placed log for current claims

                // Attempt to remove the admin claim
                return admin.auth().setCustomUserClaims(user.uid, { admin: null })
                  .then(() => {
                      // Optionally, after setting claims, fetch the user again to confirm the removal
                      return admin.auth().getUserByEmail(data.email);
                  })
                  .then((updatedUser) => {
                      console.log(`After attempting to remove admin:`, updatedUser.customClaims); // Confirmation log
                      return {
                          message: `Success: ${data.email} has been removed from admin.`
                      };
                  });
            })
            .catch(error => {
                console.error(`Error removing admin claim:`, error);
                throw new functions.https.HttpsError("internal", error.message);
            });
    } else {
        throw new functions.https.HttpsError("permission-denied", "Request must be made by an admin user.");
    }
});

// Function to search user by username or email
exports.findUserByEmailOrUsername = functions.https.onCall(async (data) => {
    const { loginIdentifier } = data; // This could be an email or username
    let email = loginIdentifier;

    // Check if the identifier is a username by searching in Firestore
    if (!loginIdentifier.includes('@')) {
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.where('username', '==', loginIdentifier).limit(1).get();
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'No matching user found.');
        }
        const userDoc = snapshot.docs[0];
        email = userDoc.data().email; // Get the email associated with the username
    }

    // Return the email address associated with the username
    return { email };
});

// Function to check if a username already exists
exports.checkUsernameExists = functions.https.onCall(async (data, context) => {
    const { username } = data;

    if (!username) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a username argument.');
    }

    try {
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.where('username', '==', username).limit(1).get();
        if (!snapshot.empty) {
            return { exists: true };
        }
        return { exists: false };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Something went wrong when checking the username.');
    }
});

// Function to check if a phone number already exists
exports.checkPhoneNumberExists = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    if (!phoneNumber) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a phone number argument.');
    }

    try {
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.where('phoneNumber', '==', phoneNumber).limit(1).get();
        if (!snapshot.empty) {
            return { exists: true };
        }
        return { exists: false };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Something went wrong when checking the phone number.');
    }
});