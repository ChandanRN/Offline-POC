import { Timestamp } from "firebase/firestore";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  status: string;
  createdAt: Timestamp | null;
  synced: boolean;
  hasPendingWrites?: boolean;
}
