import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { twitterId, name, username } = req.body;

  if (!twitterId || !name || !username) {
    return res.status(400).json({ error: 'Twitter user data required' });
  }

  try {
    const raw = JSON.stringify({
      create_ethereum_wallet: true,
      linked_accounts: [
        {
          type: "twitter_oauth",
          subject: twitterId,
          name: name,
          username: username
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'privy-app-id': "clxzbnquw04cr12ygmw3xjmli",
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`
      },
      body: raw
    };

    const response = await fetch('https://auth.privy.io/api/v1/users', requestOptions);
    const data = await response.json();
console.log("response" , data)
    // Find the wallet address from the response
    // @ts-ignore 
    const walletAccount = data.linked_accounts?.find((account: any) => account.type === 'wallet');
    const walletAddress = walletAccount?.address;

    return res.status(200).json({ walletAddress });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get/create wallet' , error_message: error});
  }
}