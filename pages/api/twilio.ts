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
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const personalizedMessage = prepareMessage(template, user);

        // Log the progress of message being sent
        console.log(`Sending message to ${user.firstName} ${user.lastName} (${user.phoneNumber}) [${i + 1}/${users.length}]`);

        await client.messages.create({
          body: personalizedMessage,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER,
        });

        // Log after successfully sending the message
        console.log(`Message sent to ${user.firstName} ${user.lastName} successfully.`);

        // Wait for a specified delay before sending the next message
        await delay(5000); // Adjust the delay as necessary
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
