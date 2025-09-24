import 'dotenv/config';
// If TS complains about fetch types, either add "lib": ["ES2022","DOM"] in tsconfig,
// or: npm i -D undici  &&  import { fetch } from 'undici';
// NOTE THIS IS NOT WORKING G9/24/2025; as comment above states, TS is complaining about fetch types but adding "lib..."
//  line to tsconfig did no work
//   this is the graphql version; see teams.ts for the linear SDK (and better) version; which works


const endpoint = 'https://api.linear.app/graphql';
const query = /* GraphQL */ `
  query Teams($first: Int, $after: String) {
    teams(first: $first, after: $after) {
      nodes { id name }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error('Missing LINEAR_API_KEY in .env');

  let after: string | null = null;
  const out: Array<{ id: string; name: string }> = [];

  do {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Linear expects the API key directly (no "Bearer")
        'Authorization': apiKey,
      },
      body: JSON.stringify({ query, variables: { first: 50, after } }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);

    const json = await resp.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));

    const { nodes, pageInfo } = json.data.teams;
    out.push(...nodes);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  console.log(JSON.stringify(out, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
