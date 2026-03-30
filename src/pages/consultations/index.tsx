import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Filter } from "@/shared/ui/Filter";
import { useToast } from "@/shared/lib/useToast";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { consultationApi } from "@/entities/consultation/api/consultationApi";
import { ConsultationCard } from "@/entities/consultation/ui/ConsultationCard";
import { ConsultationDialog } from "@/features/consultation-manage/ui/ConsultationDialog";
import { DeleteConfirmDialog } from "@/shared/ui/DeleteConfirmDialog";
import { MessageSquare, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ConsultationEntity } from "@/entities/consultation/model/types";

const Skeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="animate-pulse">
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </Card>
    ))}
  </div>
);

export const ConsultationsPage = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams({
    status: "new",
  });
  const { t } = useTranslation();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<ConsultationEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<ConsultationEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ConsultationEntity | null>(
    null,
  );

  const fetchConsultations = () => {
    setLoading(true);
    consultationApi
      .getAll({ ...queryParams })
      .then((r) => setConsultations(r.data.data?.consultations ?? []))
      .catch((err) => {
        toast({
          title: t("common.error"),
          description:
            err.response?.data?.message ?? t("consultations.loadError"),
          variant: "destructive",
        });
        setConsultations([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchConsultations, [queryParams]); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await consultationApi.delete(deleteTarget._id);
      toast({
        title: t("common.success"),
        description: t("consultations.deleted"),
      });
      fetchConsultations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message ?? t("consultations.deleteError"),
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const statusOptions = [
    { value: "new", label: t("consultations.statusOptions.new") },
    {
      value: "in_progress",
      label: t("consultations.statusOptions.in_progress"),
    },
    { value: "completed", label: t("consultations.statusOptions.completed") },
  ];

  const sourceOptions = [
    { value: "", label: t("consultations.allSources") },
    { value: "contact", label: t("consultations.sourceOptions.contact") },
    {
      value: "consultation",
      label: t("consultations.sourceOptions.consultation"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("consultations.title")}
        </h1>
        <p className="text-muted-foreground">{t("consultations.manage")}</p>
      </div>

      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("consultations.searchPlaceholder")}
              value={queryParams.search ?? ""}
              onChange={(e) => updateQueryParams({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </Filter.Item>
        <Filter.Item>
          <select
            value={queryParams.status ?? "new"}
            onChange={(e) => updateQueryParams({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Filter.Item>
        <Filter.Item>
          <select
            value={queryParams.source ?? ""}
            onChange={(e) => updateQueryParams({ source: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sourceOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Filter.Item>
      </Filter>

      {loading ? (
        <Skeleton />
      ) : consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((c) => (
            <ConsultationCard
              key={c._id}
              consultation={c}
              onView={(item) => {
                setSelected(item);
                setShowDialog(true);
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("consultations.notFound")}
            </h3>
            <p className="text-gray-500 text-center">
              {t("consultations.noConsultationsYet")}
            </p>
          </CardContent>
        </Card>
      )}

      <ConsultationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        consultation={selected}
        onSuccess={fetchConsultations}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t("consultations.deleteTitle")}
        description={t("consultations.deleteDescription", {
          name: deleteTarget?.name,
        })}
      />
    </div>
  );
};
