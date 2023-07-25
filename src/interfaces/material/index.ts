import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MaterialInterface {
  id?: string;
  name: string;
  link: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MaterialGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  link?: string;
  user_id?: string;
}
