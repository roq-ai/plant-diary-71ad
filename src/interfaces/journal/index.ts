import { PlantingInterface } from 'interfaces/planting';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface JournalInterface {
  id?: string;
  entry: string;
  tag?: string;
  planting_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  planting?: PlantingInterface;
  user?: UserInterface;
  _count?: {};
}

export interface JournalGetQueryInterface extends GetQueryInterface {
  id?: string;
  entry?: string;
  tag?: string;
  planting_id?: string;
  user_id?: string;
}
