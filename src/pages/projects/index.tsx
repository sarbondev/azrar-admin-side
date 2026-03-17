import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Filter } from "@/shared/ui/Filter";
import { DeleteConfirmDialog } from "@/shared/ui/DeleteConfirmDialog";
import { useToast } from "@/shared/lib/useToast";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { projectApi } from "@/entities/project/api/projectApi";
import { ProjectDialog } from "@/features/project-crud/ui/ProjectDialog";
import { Plus, FolderOpen, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Lang, ProjectEntity } from "@/entities/project/model/types";

export const ProjectsPage = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as Lang;
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<ProjectEntity | null>(null);
  const [deleting, setDeleting] = useState<ProjectEntity | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    projectApi
      .getAll(queryParams)
      .then((r) => setProjects(r.data.data?.projects ?? []))
      .catch((err) => {
        toast({
          title: t("common.error"),
          description: err.response?.data?.message ?? t("projects.loadError"),
          variant: "destructive",
        });
        setProjects([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, [queryParams]); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await projectApi.delete(deleting._id);
      toast({ title: t("common.success"), description: t("projects.deleted") });
      fetchProjects();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description: e.response?.data?.message ?? t("projects.deleteError"),
        variant: "destructive",
      });
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("projects.title")}
          </h1>
          <p className="text-muted-foreground">{t("projects.manage")}</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("projects.addProject")}
        </Button>
      </div>
      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("projects.searchPlaceholder")}
              value={queryParams.search ?? ""}
              onChange={(e) => updateQueryParams({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </Filter.Item>
      </Filter>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              {project.images?.[0] ? (
                <div className="h-44 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={
                      project.translations[currentLanguage]?.title ||
                      project.translations.uz.title
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  <FolderOpen className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {project.translations[currentLanguage]?.title ||
                        project.translations.uz.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {project.translations[currentLanguage]?.address ||
                          project.translations.uz.address}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(project);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleting(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("projects.fields.solution")}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {project.translations[currentLanguage]?.solution ||
                      project.translations.uz.solution}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("projects.fields.result")}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {project.translations[currentLanguage]?.result ||
                      project.translations.uz.result}
                  </p>
                </div>
                {project.images?.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {project.images.length} {t("common.imagesCount")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("projects.notFound")}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {t("projects.noProjectsYet")}
            </p>
            <Button
              onClick={() => {
                setEditing(null);
                setShowDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("projects.addFirstProject")}
            </Button>
          </CardContent>
        </Card>
      )}
      <ProjectDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        project={editing}
        onSuccess={() => {
          fetchProjects();
          setShowDialog(false);
          setEditing(null);
        }}
      />
      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t("projects.deleteTitle")}
        description={t("projects.deleteDescription", {
          name:
            deleting?.translations[currentLanguage]?.title ||
            deleting?.translations.uz.title,
        })}
      />
    </div>
  );
};
