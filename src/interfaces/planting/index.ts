import { JournalInterface } from 'interfaces/journal';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlantingInterface {
  id?: string;
  name: string;
  date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  journal?: JournalInterface[];
  user?: UserInterface;
  _count?: {
    journal?: number;
  };
}

export interface PlantingGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
