import type { CategoryEntity } from "@/entities/category/model/types";

export type Lang = "uz" | "ru";

export interface ProductTranslation {
  title: string;
  description: string;
}

export interface colorEntity {
  label: {
    uz: string;
    ru: string;
  };
  hexCode: string;
}

export interface ProductEntity {
  _id: string;
  translations: Record<Lang, ProductTranslation>;
  price: number;
  category: CategoryEntity;
  images: string[];
  colors: colorEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  translations: Record<Lang, ProductTranslation>;
  category: string;
  price: string;
  colors: colorEntity[];
}
