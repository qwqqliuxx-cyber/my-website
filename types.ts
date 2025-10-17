
export interface User {
  id: number;
  username: string;
  password?: string; // Password should not be stored in client state long-term
  isMember: boolean;
  isAdmin: boolean;
}

export interface PaymentRequest {
  id: number;
  userId: number;
  username: string;
  amount: number;
  status: 'pending' | 'verified';
  date: string;
}
   