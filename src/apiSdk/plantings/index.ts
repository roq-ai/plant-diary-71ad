import axios from 'axios';
import queryString from 'query-string';
import { PlantingInterface, PlantingGetQueryInterface } from 'interfaces/planting';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPlantings = async (
  query?: PlantingGetQueryInterface,
): Promise<PaginatedInterface<PlantingInterface>> => {
  const response = await axios.get('/api/plantings', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createPlanting = async (planting: PlantingInterface) => {
  const response = await axios.post('/api/plantings', planting);
  return response.data;
};

export const updatePlantingById = async (id: string, planting: PlantingInterface) => {
  const response = await axios.put(`/api/plantings/${id}`, planting);
  return response.data;
};

export const getPlantingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/plantings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlantingById = async (id: string) => {
  const response = await axios.delete(`/api/plantings/${id}`);
  return response.data;
};
