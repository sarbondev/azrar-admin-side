export type ConsultationStatus = "new" | "in_progress" | "completed";
export type ConsultationSource = "contact" | "consultation";

export interface ConsultationEntity {
  _id: string;
  name: string;
  phone: string;
  subject: string;
  company: string;
  message: string;
  source: ConsultationSource;
  status: ConsultationStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}
