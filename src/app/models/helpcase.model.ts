import { Association } from './association.model';

export interface PostHelpCase {
  id?: number;
  title: string;
  description: string;
  location: string;
  postedAt?: string; 
  status: 'ongoing' | 'urgent' | 'resolved';
  association?: Association;
}