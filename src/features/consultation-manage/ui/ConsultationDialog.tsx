import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/lib/useToast";
import { consultationApi } from "@/entities/consultation/api/consultationApi";
import {
  Loader2,
  Phone,
  User,
  Building2,
  MessageSquare,
  ScrollText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  ConsultationEntity,
  ConsultationStatus,
} from "@/entities/consultation/model/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  consultation: ConsultationEntity | null;
  onSuccess: () => void;
}

const STATUS_COLOR: Record<ConsultationStatus, string> = {
  new: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export const ConsultationDialog = ({
  open,
  onOpenChange,
  consultation,
  onSuccess,
}: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<ConsultationStatus | "">("");
  const [notes, setNotes] = useState("");

  if (!consultation) return null;

  const statusOptions: { value: ConsultationStatus; label: string }[] = [
    { value: "new", label: t("consultations.statusOptions.new") },
    {
      value: "in_progress",
      label: t("consultations.statusOptions.in_progress"),
    },
    { value: "completed", label: t("consultations.statusOptions.completed") },
  ];

  const handleUpdate = async () => {
    if (!newStatus) {
      toast({
        title: t("common.error"),
        description: t("consultations.selectStatus"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await consultationApi.update(consultation._id, newStatus, notes);
      toast({
        title: t("common.success"),
        description: t("consultations.statusUpdated"),
      });
      onSuccess();
      onOpenChange(false);
      setNewStatus("");
      setNotes("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message ?? t("consultations.updateError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("consultations.dialogTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Status + Date */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("consultations.currentStatus")}
              </p>
              <Badge className={STATUS_COLOR[consultation.status]}>
                {t(`consultations.statusOptions.${consultation.status}`)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {t("consultations.createdAt")}
              </p>
              <p className="text-sm font-medium">
                {new Date(consultation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t("consultations.source")}:
            </span>
            <Badge variant="outline">
              {t(`consultations.sourceOptions.${consultation.source}`)}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("consultations.contactInfo")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                {consultation.name}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${consultation.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:underline text-blue-600"
                >
                  {consultation.phone}
                </a>
              </p>
              {consultation.company && (
                <p className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  {consultation.company}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          {consultation.subject && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500">
                {t("consultations.subject")}
              </h3>
              <p className="text-gray-900">{consultation.subject}</p>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              {t("consultations.message")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.message}
              </p>
            </div>
          </div>

          {/* Internal Notes */}
          {consultation.internalNotes && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500">
                {t("consultations.internalNotes")}
              </h3>
              <p className="text-gray-900">{consultation.internalNotes}</p>
            </div>
          )}

          {/* Update Status */}
          {consultation.status !== "completed" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">
                {t("consultations.updateStatus")}
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>{t("consultations.newStatus")}</Label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as ConsultationStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="">{t("consultations.selectStatus")}</option>
                    {statusOptions
                      .filter((s) => s.value !== consultation.status)
                      .map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label>{t("consultations.internalNotes")}</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("consultations.updateStatus")}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
