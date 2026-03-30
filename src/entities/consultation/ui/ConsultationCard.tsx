import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Calendar,
  Eye,
  Phone,
  User,
  Building2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  ConsultationEntity,
  ConsultationStatus,
  ConsultationSource,
} from "../model/types";

interface Props {
  consultation: ConsultationEntity;
  onView: (c: ConsultationEntity) => void;
  onDelete: (c: ConsultationEntity) => void;
}

const STATUS_COLOR: Record<ConsultationStatus, string> = {
  new: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

const SOURCE_COLOR: Record<ConsultationSource, string> = {
  contact: "bg-purple-100 text-purple-800 border-purple-200",
  consultation: "bg-orange-100 text-orange-800 border-orange-200",
};

export const ConsultationCard = ({ consultation, onView, onDelete }: Props) => {
  const { t } = useTranslation();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{consultation.name}</CardTitle>
              <Badge className={STATUS_COLOR[consultation.status]}>
                {t(`consultations.statusOptions.${consultation.status}`)}
              </Badge>
              <Badge className={SOURCE_COLOR[consultation.source]}>
                {t(`consultations.sourceOptions.${consultation.source}`)}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(consultation.createdAt).toLocaleDateString("uz-UZ")}
              </span>
              {consultation.subject && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {consultation.subject}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(consultation)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("common.view")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(consultation)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {consultation.name}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {consultation.phone}
              </p>
              {consultation.company && (
                <p className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {consultation.company}
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p className="line-clamp-3">{consultation.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
