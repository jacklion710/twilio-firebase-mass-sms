import { db } from '@/utils/firebase'; // Adjust the import path as needed
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

interface UserData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    // Include other properties as needed, excluding 'id'
}

interface User extends UserData {
    id: string; // Extend UserData with an 'id' property for the document ID
}

// Fetch users who have opted in for text messages
export const fetchOptedInUsers = async (): Promise<User[]> => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('isOptedInTexts', '==', true));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => {
        // Assume doc.data() does not contain an 'id', or it's okay to overwrite
        const data = doc.data() as UserData;
        return {
          id: doc.id, // Use doc.id for the 'id' to avoid overwriting issues
          ...data,
        };
      });
      return users;
    } catch (error) {
      console.error("Failed to fetch users", error);
      throw new Error('Failed to fetch users');
    }
};
  
