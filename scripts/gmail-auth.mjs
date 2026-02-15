import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { google } from 'googleapis';
import 'dotenv/config';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
const TOKEN_PATH = process.env.GMAIL_TOKEN_PATH || './.gmail-token.json';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing env vars: GMAIL_CLIENT_ID and/or GMAIL_CLIENT_SECRET');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('\n1) Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2) Approve access.');
console.log('3) Copy the full "code" query param from the redirect URL and paste it below.\n');

const rl = readline.createInterface({ input, output });
const code = (await rl.question('Paste authorization code: ')).trim();
rl.close();

if (!code) {
  console.error('No code provided.');
  process.exit(1);
}

const { tokens } = await oauth2Client.getToken(code);
await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
console.log(`\nSaved Gmail token to ${TOKEN_PATH}`);
console.log('Done.');
