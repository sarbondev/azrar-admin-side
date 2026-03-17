export type Lang = "uz" | "ru";

export interface ProjectTranslation {
  title: string;
  address: string;
  solution: string;
  result: string;
}

export interface ProjectEntity {
  _id: string;
  translations: Record<Lang, ProjectTranslation>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  translations: Record<Lang, ProjectTranslation>;
}
