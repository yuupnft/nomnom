import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Render mounts secret files at /etc/secrets/<filename> in production;
// local dev uses a gitignored copy under server/secrets/.
const prodPath = '/etc/secrets/firebaseAdminKey.json';
const devPath = path.join(__dirname, 'secrets', 'firebaseAdminKey.json');
const secretFilePath = fs.existsSync(prodPath) ? prodPath : devPath;

if (!fs.existsSync(secretFilePath)) {
  console.error('Firebase Admin key file is missing at:', secretFilePath);
}

const serviceAccount = JSON.parse(fs.readFileSync(secretFilePath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
