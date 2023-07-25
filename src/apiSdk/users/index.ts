import axios from 'axios';
import queryString from 'query-string';
import { UserInterface, UserGetQueryInterface } from 'interfaces/user';
import { PaginatedInterface } from 'interfaces';

export const getUsers = async (query?: UserGetQueryInterface): Promise<PaginatedInterface<UserInterface>> => {
  const response = await axios.get('/api/users', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const getUserById = async (id: string, query?: UserGetQueryInterface): Promise<UserInterface> => {
  const response = await axios.get(`/api/users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};
