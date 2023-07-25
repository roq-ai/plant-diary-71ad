import axios from 'axios';
import queryString from 'query-string';
import { JournalInterface, JournalGetQueryInterface } from 'interfaces/journal';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getJournals = async (query?: JournalGetQueryInterface): Promise<PaginatedInterface<JournalInterface>> => {
  const response = await axios.get('/api/journals', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createJournal = async (journal: JournalInterface) => {
  const response = await axios.post('/api/journals', journal);
  return response.data;
};

export const updateJournalById = async (id: string, journal: JournalInterface) => {
  const response = await axios.put(`/api/journals/${id}`, journal);
  return response.data;
};

export const getJournalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/journals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteJournalById = async (id: string) => {
  const response = await axios.delete(`/api/journals/${id}`);
  return response.data;
};
