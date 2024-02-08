// /pages/api/twilio.ts
import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      // Retrieve users who have opted in for text messaging
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('isOptedInText', '==', true));
      const querySnapshot = await getDocs(q);

      const messagePromises = querySnapshot.docs.map(doc => {
        const user = doc.data();
        return client.messages.create({
          body: message,
          to: user.phoneNumber, // Text this number
          from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
        });
      });

      await Promise.all(messagePromises);
      res.status(200).json({ success: true, message: 'Messages sent successfully!' });
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          // Handle cases where the error might not be an instance of Error
          res.status(500).json({ error: 'An unknown error occurred' });
        }
      }      
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
