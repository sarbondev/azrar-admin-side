import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Plus, FolderOpen, Search, Edit, Trash2, MapPin } from "lucide-react";
import ProjectDialog from "../components/projectComponents/ProjectDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useQueryParams } from "../hooks/use-query-params";
import { Filter } from "../components/Filter";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProjects(queryParams);
      const data = res.data;
      if (data.success && data.data) {
        setProjects(data.data.projects || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("projects.loadError"),
        variant: "destructive",
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteProject(deleteProject._id);
      toast({ title: t("common.success"), description: t("projects.deleted") });
      fetchProjects();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("projects.deleteError"),
        variant: "destructive",
      });
    }
    setDeleteProject(null);
  };

  useEffect(() => {
    fetchProjects();
  }, [queryParams]);

  const openEdit = (project) => {
    setEditingProject(project);
    setShowDialog(true);
  };
  const openCreate = () => {
    setEditingProject(null);
    setShowDialog(true);
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
        <Button onClick={openCreate}>
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
              value={queryParams.search || ""}
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
                <div className="h-3 bg-gray-200 rounded w-1/2" />
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
              {/* Image */}
              {project.images?.[0] ? (
                <div className="h-44 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
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
                      {project.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{project.address}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteProject(project)}
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
                    {project.solution}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("projects.fields.result")}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {project.result}
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
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("projects.addFirstProject")}
            </Button>
          </CardContent>
        </Card>
      )}

      <ProjectDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        project={editingProject}
        onSuccess={() => {
          fetchProjects();
          setShowDialog(false);
          setEditingProject(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteProject}
        onOpenChange={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        title={t("projects.deleteTitle")}
        description={t("projects.deleteDescription", {
          name: deleteProject?.title,
        })}
      />
    </div>
  );
};

export default Projects;
