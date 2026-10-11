import { apiClient } from "./apiClient";
import type { GalleryCategory, GalleryPhoto } from "@/lib/types";

export interface GalleryFilterOptions {
  category?: GalleryCategory | "all";
  home?: boolean;
}

export interface CreateGalleryPhotoPayload {
  imageUrl: string;
  caption: string;
  category: GalleryCategory;
  showOnHome?: boolean;
  aspectRatio?: GalleryPhoto["aspectRatio"];
}

export interface UpdateGalleryPhotoPayload {
  caption?: string;
  category?: GalleryCategory;
  aspectRatio?: GalleryPhoto["aspectRatio"];
  displayOrder?: number;
  showOnHome?: boolean;
}

export const galleryService = {
  async getPhotos(filters?: GalleryFilterOptions): Promise<{ photos: GalleryPhoto[] }> {
    return apiClient.get<{ photos: GalleryPhoto[] }>("/api/gallery", {
      params: {
        category: filters?.category,
        home: filters?.home,
      },
    });
  },

  async createPhoto(
    payload: CreateGalleryPhotoPayload
  ): Promise<{ success: boolean; photo: GalleryPhoto }> {
    return apiClient.post<{ success: boolean; photo: GalleryPhoto }>("/api/gallery", payload);
  },

  async updatePhoto(
    id: string,
    updates: UpdateGalleryPhotoPayload
  ): Promise<{ success: boolean; photo: GalleryPhoto }> {
    return apiClient.patch<{ success: boolean; photo: GalleryPhoto }>(`/api/gallery/${id}`, updates);
  },

  async deletePhoto(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/gallery/${id}`);
  },
};
