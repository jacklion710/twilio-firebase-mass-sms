// /pages/api/twilio.ts
import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// Assuming you have the Twilio client initialized as before
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_SECRET_KEY);

const prepareMessage = (template: string, user: {firstName: string, lastName: string}): string => {
  return template
    .replace(/{firstName}/g, user.firstName)
    .replace(/{lastName}/g, user.lastName);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { template, users } = req.body;

    try {
      for (const user of users) {
        const personalizedMessage = prepareMessage(template, user);
        
        // Sending the personalized message to each user
        await client.messages.create({
          body: personalizedMessage,
          to: user.phoneNumber, // Assuming each user object has a phoneNumber
          from: process.env.TWILIO_PHONE_NUMBER,
        });
      }

      res.status(200).json({ success: true, message: 'Messages sent successfully!' });
    } catch (error) {
      console.error('Failed to send messages:', error);
      res.status(500).json({ error: 'Failed to send messages' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
