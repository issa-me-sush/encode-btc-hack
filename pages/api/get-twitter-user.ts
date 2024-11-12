import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const cleanUsername = username.replace('@', '');
    // const response = await fetch(
    //   `https://api.x.com/2/users/by/username/${cleanUsername}?user.fields=id,name,username,profile_image_url`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    const response = await fetch(
        `https://tweethunter.io/api/convert?inputString=${cleanUsername}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            'referer': 'https://tweethunter.io/twitter-id-converter',
            'authority': 'tweethunter.io'
          }
        }
      );

    const data = await response.json();
    console.log(data)
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch Twitter user' });
  }
}
