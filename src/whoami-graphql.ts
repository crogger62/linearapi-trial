import 'dotenv/config';

const endpoint = 'https://api.linear.app/graphql';
const query = /* GraphQL */ `
  query Me {
    viewer {
      id
      name
      email
    }
  }
`;

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error('Missing LINEAR_API_KEY in .env');

  // IMPORTANT: Linear expects the API key directly (no "Bearer")
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({ query }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const json = await resp.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL errors');
  }
  console.log(JSON.stringify(json.data.viewer, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });

