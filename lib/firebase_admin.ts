import * as admin from 'firebase-admin'

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.GCP_CREDENTIAL.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
    }),
  });
}