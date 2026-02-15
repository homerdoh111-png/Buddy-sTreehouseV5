import 'dotenv/config';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

const {
  GMAIL_IMAP_USER,
  GMAIL_IMAP_APP_PASSWORD,
  GMAIL_IMAP_QUERY,
  GMAIL_IMAP_MAX = '10',
} = process.env;

if (!GMAIL_IMAP_USER || !GMAIL_IMAP_APP_PASSWORD) {
  console.error('Missing env vars: GMAIL_IMAP_USER and/or GMAIL_IMAP_APP_PASSWORD');
  process.exit(1);
}

const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: GMAIL_IMAP_USER,
    pass: GMAIL_IMAP_APP_PASSWORD,
  },
  logger: false,
});

const query = GMAIL_IMAP_QUERY || 'UNSEEN';
const max = Number(GMAIL_IMAP_MAX);

await client.connect();
try {
  const lock = await client.getMailboxLock('INBOX');
  try {
    const uids = await client.search({ raw: query });
    const slice = uids.slice(-max);

    const messages = [];
    for await (const msg of client.fetch(slice, { uid: true, envelope: true, source: true })) {
      const parsed = await simpleParser(msg.source);
      messages.push({
        uid: msg.uid,
        date: parsed.date?.toISOString() || null,
        from: parsed.from?.text || msg.envelope?.from?.[0]?.address || null,
        subject: parsed.subject || msg.envelope?.subject || null,
        text: (parsed.text || '').slice(0, 2000),
        html: parsed.html ? '[html omitted]' : null,
      });
    }

    console.log(JSON.stringify({ query, count: messages.length, messages }, null, 2));
  } finally {
    lock.release();
  }
} finally {
  await client.logout().catch(() => {});
}
