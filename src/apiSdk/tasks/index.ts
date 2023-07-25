import axios from 'axios';
import queryString from 'query-string';
import { TaskInterface, TaskGetQueryInterface } from 'interfaces/task';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getTasks = async (query?: TaskGetQueryInterface): Promise<PaginatedInterface<TaskInterface>> => {
  const response = await axios.get('/api/tasks', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createTask = async (task: TaskInterface) => {
  const response = await axios.post('/api/tasks', task);
  return response.data;
};

export const updateTaskById = async (id: string, task: TaskInterface) => {
  const response = await axios.put(`/api/tasks/${id}`, task);
  return response.data;
};

export const getTaskById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tasks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTaskById = async (id: string) => {
  const response = await axios.delete(`/api/tasks/${id}`);
  return response.data;
};
