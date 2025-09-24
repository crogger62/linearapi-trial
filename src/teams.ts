import 'dotenv/config';
import { LinearClient } from '@linear/sdk';

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error('Missing LINEAR_API_KEY in .env');
  const client = new LinearClient({ apiKey });

  let after: string | undefined = undefined;
  const all: { id: string; name: string }[] = [];

  while (true) {
    const page = await client.teams({ first: 50, after });
    all.push(...page.nodes.map(t => ({ id: t.id, name: t.name })));
    if (page.pageInfo.hasNextPage && page.pageInfo.endCursor) {
      after = page.pageInfo.endCursor;
    } else break;
  }

  console.log(JSON.stringify(all, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
