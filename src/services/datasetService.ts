import api from './api';
import type { Dataset, DatasetItem, DatasetSummary, ItemFormData, PaginationMeta } from '../types/dataset';

export interface ItemsResponse {
  success: boolean;
  dataset: Dataset;
  data: DatasetItem[];
  pagination: PaginationMeta;
}

export const datasetService = {
  async getAll(): Promise<Dataset[]> {
    const response = await api.get<{ success: boolean; data: Dataset[] }>('/datasets');
    return response.data.data;
  },

  async getSummary(slug: string): Promise<DatasetSummary> {
    const response = await api.get<{ success: boolean; data: DatasetSummary }>(`/datasets/${slug}`);
    return response.data.data;
  },

  async getItems(slug: string, params: Record<string, any> = {}): Promise<ItemsResponse> {
    const response = await api.get<ItemsResponse>(`/datasets/${slug}/items`, { params });
    return response.data;
  },

  async createItem(slug: string, data: ItemFormData): Promise<DatasetItem> {
    const response = await api.post<{ success: boolean; data: DatasetItem }>(`/datasets/${slug}/items`, data);
    return response.data.data;
  },

  async updateItem(id: number, data: ItemFormData): Promise<DatasetItem> {
    const response = await api.put<{ success: boolean; data: DatasetItem }>(`/datasets/items/${id}`, data);
    return response.data.data;
  },

  async deleteItem(id: number): Promise<void> {
    await api.delete(`/datasets/items/${id}`);
  },

  async importFile(file: File): Promise<{ success: boolean; message: string; imported_count: number; dataset?: Dataset }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/datasets/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async importDefaults(): Promise<{ success: boolean; message: string; details: any[] }> {
    const response = await api.post('/datasets/import-defaults');
    return response.data;
  },
};
