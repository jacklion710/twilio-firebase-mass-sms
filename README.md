# Bulk SMS Message Builder with Twilio & Firebase

## Project Overview

This Next.js application leverages Twilio for sending mass SMS messages and Firebase for user authentication and data storage, incorporating Chakra UI for a responsive and accessible user interface. It's designed for businesses or organizations aiming to engage their customers or members through effective mass text messaging campaigns, while managing user opt-ins with precision.

### Key Features

- **User Authentication**: Secure login functionality powered by Firebase Authentication.
- **Data Storage**: User data management through Firestore for real-time sync and offline support.
- **SMS Messaging**: Utilizes the Twilio API for sending SMS messages to a curated list of opted-in users.
- **Responsive Design**: Crafted with Chakra UI for a modern and adaptable user experience.
- **Environment Variable Configuration**: Simplified setup process using environment variables for secure API key management.

# Component Overview

### `Login.tsx`

**Functionality**: Manages user sign-in using Firebase Authentication.

**Key Methods**:
- `handleSignIn`: Authenticates users and manages login errors.

### `MassSMS.tsx`

**Functionality**: Enables users with Firebase admin privileges to send SMS messages to users who have opted-in, as determined by their Firestore document fields.

### `twilio.ts` (API Endpoint)

**Functionality**: Handles the server-side logic for sending SMS messages through Twilio.

## Getting Started

These instructions will help you set up a copy of the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (14.x or later recommended)
- A Firebase account for backend services
- A Twilio account for SMS messaging


### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jacklion710/twilio-firebase-mass-sms
   cd user-interactive-email-list
   npm install
   npm run dev
   ```

2. **Install Dependencies**
Run the following command to install the necessary dependencies:

    ```bash
    npm install
    ```
3. **Run the Development Server**
Start the development server with:

    ```bash
    npm run dev
    ```

4. **Set Environment Variable**
Create a .env.local file in the root directory and add your Firebase and SendGrid API keys:

    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    ```

## Firebase Setup

For Firebase authentication and Firestore data storage:

- Follow the [firebase authentication documentation](https://firebase.google.com/docs/auth) to set up the authentication.
- Use the firestore [documentation](https://firebase.google.com/docs/auth)

## Firebase Admin Setup (Work In Progress)

This feature is under development. The goal is to enable advanced server-side operations with Firebase Admin SDK. Stay tuned for updates.

## Twilio Setup

For sending SMS messages, you'll need to:

- Create a Twilio account and obtain your 'Account SID' and 'Auth Token'.
- Acquire a Twilio phone number to send messages from.
- Refer to the [Twilio SMS Documentation](https://www.twilio.com/docs/messaging) for setup instructions and API reference.

## Contributing

Your contributions are welcome! Please feel free to submit issues, forks, and pull requests.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.

### Built With
React - A JavaScript library for building user interfaces
Firebase - Backend-as-a-Service for web and mobile apps
Twilio - Cloud-based SMS service that assists businesses with SMS delivery
Chakra UI - A simple, modular, and accessible component library
