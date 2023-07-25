import axios from 'axios';
import queryString from 'query-string';
import { MaterialInterface, MaterialGetQueryInterface } from 'interfaces/material';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMaterials = async (
  query?: MaterialGetQueryInterface,
): Promise<PaginatedInterface<MaterialInterface>> => {
  const response = await axios.get('/api/materials', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createMaterial = async (material: MaterialInterface) => {
  const response = await axios.post('/api/materials', material);
  return response.data;
};

export const updateMaterialById = async (id: string, material: MaterialInterface) => {
  const response = await axios.put(`/api/materials/${id}`, material);
  return response.data;
};

export const getMaterialById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/materials/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMaterialById = async (id: string) => {
  const response = await axios.delete(`/api/materials/${id}`);
  return response.data;
};
