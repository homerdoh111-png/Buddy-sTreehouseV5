import fs from 'node:fs/promises';
import { google } from 'googleapis';
import 'dotenv/config';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
const TOKEN_PATH = process.env.GMAIL_TOKEN_PATH || './.gmail-token.json';
const QUERY = process.env.GMAIL_QUERY || 'is:unread from:(github.com OR vercel.com) newer_than:7d';
const MAX = Number(process.env.GMAIL_MAX_RESULTS || 10);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing env vars: GMAIL_CLIENT_ID and/or GMAIL_CLIENT_SECRET');
  process.exit(1);
}

const tokenRaw = await fs.readFile(TOKEN_PATH, 'utf8').catch(() => null);
if (!tokenRaw) {
  console.error(`Missing token file at ${TOKEN_PATH}. Run: npm run gmail:auth`);
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials(JSON.parse(tokenRaw));

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const listRes = await gmail.users.messages.list({
  userId: 'me',
  q: QUERY,
  maxResults: MAX,
});

const messages = listRes.data.messages || [];
if (messages.length === 0) {
  console.log('No matching messages found.');
  process.exit(0);
}

const rows = [];
for (const m of messages) {
  const full = await gmail.users.messages.get({ userId: 'me', id: m.id, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date'] });
  const headers = full.data.payload?.headers || [];
  const getHeader = (name) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

  rows.push({
    id: m.id,
    threadId: m.threadId,
    from: getHeader('From'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    snippet: full.data.snippet || '',
  });
}

console.log(JSON.stringify({ query: QUERY, count: rows.length, messages: rows }, null, 2));
