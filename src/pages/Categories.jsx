import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import CategoryDialog from "../components/categoryComponents/CategoryDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories();
      const data = res.data;
      if (data.success && data.data) {
        setCategories(data.data.categories || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description:
          error.response?.data?.message ||
          t('categories.loadError'),
        variant: "destructive",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteCategory(deleteCategory._id);
      toast({ title: t('common.success'), description: t('categories.deleted') });
      fetchCategories();
    } catch (error) {
      toast({
        title: t('common.error'),
        description:
          error.response?.data?.message ||
          t('categories.deleteError'),
        variant: "destructive",
      });
    }
    setDeleteCategory(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('categories.title')}</h1>
          <p className="text-muted-foreground">
            {t('categories.manage')}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('categories.addCategory')}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{cat.name_uz}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {cat.name_ru}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(cat)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteCategory(cat)}
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
              {t('categories.notFound')}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {t('categories.noCategoriesYet')}
            </p>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t('categories.addFirstCategory')}
            </Button>
          </CardContent>
        </Card>
      )}

      <CategoryDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={editingCategory}
        onSuccess={() => {
          fetchCategories();
          setShowDialog(false);
          setEditingCategory(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        title={t('categories.deleteTitle')}
        description={t('categories.deleteDescription', { name: deleteCategory?.name_uz })}
      />
    </div>
  );
};

export default Categories;
