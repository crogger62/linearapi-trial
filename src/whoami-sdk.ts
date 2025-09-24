import 'dotenv/config';
import { LinearClient } from '@linear/sdk';

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error('Missing LINEAR_API_KEY in .env');

  const client = new LinearClient({ apiKey });
  const me = await client.viewer; // SDK wraps the same GraphQL query
  console.log(JSON.stringify({ id: me.id, name: me.name, email: me.email }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });

