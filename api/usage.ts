// // pages/api/usage.ts
// // This is a MOCK endpoint for testing - replace with your real backend

// import { getAuth } from '@clerk/nextjs/server';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { userId } = getAuth(req);

//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // MOCK DATA - Replace with actual database lookup
//     // For testing: Free tier with 1 analysis limit
//     const mockData = {
//       user_id: userId,
//       tier: 'free', // Change to 'premium' to test premium features
//       analyses_used: 0, // Change this number to test different states (0 or 1)
//       limit: 1, // Free tier gets 1 analysis
//       remaining: 1, // Remaining analyses
//       history_count: 0
//     };

//     // To test premium tier, use this instead:
//     /*
//     const mockData = {
//       user_id: userId,
//       tier: 'premium',
//       analyses_used: 42,
//       limit: 'unlimited',
//       remaining: 'unlimited',
//       history_count: 42
//     };
//     */

//     return res.status(200).json(mockData);
//   } catch (error) {
//     console.error('Usage API error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }