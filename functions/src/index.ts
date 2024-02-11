import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// // Function to add admin role
// export const addAdminRole = functions.https.onCall(async (data, context) => {
//     // Check if request is made by an authenticated user
//     if (!context.auth) {
//         throw new functions.https.HttpsError("unauthenticated", "Request must be made by an authenticated user.");
//     }

//     // Check if the requester has the admin attribute in their custom claims
//     const requesterUid = context.auth.uid;
//     const requester = await admin.auth().getUser(requesterUid);

//     if (requester.customClaims && requester.customClaims.admin === true) {
//         // Set custom user claim on the target user
//         return admin.auth().getUserByEmail(data.email)
//             .then(user => {
//                 return admin.auth().setCustomUserClaims(user.uid, {
//                     admin: true
//                 });
//             })
//             .then(() => {
//                 return {
//                     message: `Success: ${data.email} has been made an admin.`
//                 };
//             })
//             .catch(error => {
//                 throw new functions.https.HttpsError("internal", error.message);
//             });
//     } else {
//         throw new functions.https.HttpsError("permission-denied", "Request must be made by an admin user.");
//     }
// });

export const addAdminRole = functions.https.onCall(async (data, context) => {
    // Check if request is made by an authenticated user
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Request must be made by an authenticated user.");
    }

    // Temporarily allow any authenticated user to grant admin role
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
});

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
