import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_SECRET_KEY);

const prepareMessage = (template: string, user: { firstName: string, lastName: string }): string => {
  return template
    .replace(/{firstName}/g, user.firstName)
    .replace(/{lastName}/g, user.lastName);
};

// Function to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { template, users } = req.body;

    try {
      for (const user of users) {
        const personalizedMessage = prepareMessage(template, user);

        await client.messages.create({
          body: personalizedMessage,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER,
        });

        // Wait for a specified delay before sending the next message
        // Adjust the delay as necessary to comply with Twilio's rate limits and your usage patterns
        await delay(5000); // Delay of 1 second (1000 milliseconds)
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
