import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../../services/api";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const CategoryDialog = ({ open, onOpenChange, category, onSuccess }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name_uz: "", name_ru: "" });

  useEffect(() => {
    if (category) {
      setFormData({
        name_uz: category.name_uz || "",
        name_ru: category.name_ru || "",
      });
    } else {
      setFormData({ name_uz: "", name_ru: "" });
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await apiService.updateCategory(category._id, formData);
        toast({
          title: t("common.success"),
          description: t("categories.dialog.updated"),
        });
      } else {
        await apiService.createCategory(formData);
        toast({
          title: t("common.success"),
          description: t("categories.dialog.created"),
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("categories.dialog.saveError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category
              ? t("categories.dialog.editTitle")
              : t("categories.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("categories.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name_uz">{t("categories.dialog.nameUz")}</Label>
            <Input
              id="name_uz"
              value={formData.name_uz}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name_uz: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name_ru">{t("categories.dialog.nameRu")}</Label>
            <Input
              id="name_ru"
              value={formData.name_ru}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name_ru: e.target.value }))
              }
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
