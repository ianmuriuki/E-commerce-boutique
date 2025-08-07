import api from './api';

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteImage(publicId: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/upload/${publicId}`);
    return response.data;
  }
};
