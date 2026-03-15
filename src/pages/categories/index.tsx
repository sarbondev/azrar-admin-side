import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { DeleteConfirmDialog } from "@/shared/ui/DeleteConfirmDialog";
import { useToast } from "@/shared/lib/useToast";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { CategoryDialog } from "@/features/category-crud/ui/CategoryDialog";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CategoryEntity } from "@/entities/category/model/types";

export const CategoriesPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<CategoryEntity | null>(null);
  const [deleting, setDeleting] = useState<CategoryEntity | null>(null);

  const fetch = () => {
    categoryApi
      .getAll()
      .then((r) => setCategories(r.data.data.categories ?? []))
      .catch((err) => {
        toast({
          title: t("common.error"),
          description: err.response?.data?.message ?? t("categories.loadError"),
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await categoryApi.delete(deleting._id);
      toast({
        title: t("common.success"),
        description: t("categories.deleted"),
      });
      fetch();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description: e.response?.data?.message ?? t("categories.deleteError"),
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
            {t("categories.title")}
          </h1>
          <p className="text-muted-foreground">{t("categories.manage")}</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("categories.addCategory")}
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cat.name_uz}</CardTitle>
                    <CardDescription>{cat.name_ru}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(cat);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleting(cat)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("categories.notFound")}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {t("categories.noCategoriesYet")}
            </p>
            <Button
              onClick={() => {
                setEditing(null);
                setShowDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("categories.addFirstCategory")}
            </Button>
          </CardContent>
        </Card>
      )}
      <CategoryDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={editing}
        onSuccess={() => {
          fetch();
          setShowDialog(false);
          setEditing(null);
        }}
      />
      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t("categories.deleteTitle")}
        description={t("categories.deleteDescription", {
          name: deleting?.name_uz,
        })}
      />
    </div>
  );
};
