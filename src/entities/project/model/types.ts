export interface ProjectEntity {
  _id: string;
  title: string;
  address: string;
  solution: string;
  result: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  address: string;
  solution: string;
  result: string;
}
