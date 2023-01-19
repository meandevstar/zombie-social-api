import { User } from './User';

export interface UserReport {
  user: User;
  reporter: User;
  note: string;
}
