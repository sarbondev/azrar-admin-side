import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/lib/useToast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categoryApi } from "@/entities/category/api/categoryApi";
import type { CategoryEntity } from "@/entities/category/model/types";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; category?: CategoryEntity | null; onSuccess: () => void; }

export const CategoryDialog = ({ open, onOpenChange, category, onSuccess }: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name_uz: "", name_ru: "" });

  useEffect(() => {
    if (category) setForm({ name_uz: category.name_uz, name_ru: category.name_ru });
    else setForm({ name_uz: "", name_ru: "" });
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) { await categoryApi.update(category._id, form); toast({ title: t("common.success"), description: t("categories.dialog.updated") }); }
      else { await categoryApi.create(form); toast({ title: t("common.success"), description: t("categories.dialog.created") }); }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({ title: t("common.error"), description: error.response?.data?.message ?? t("categories.dialog.saveError"), variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? t("categories.dialog.editTitle") : t("categories.dialog.addTitle")}</DialogTitle>
          <DialogDescription>{t("categories.dialog.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>{t("categories.dialog.nameUz")}</Label>
            <Input value={form.name_uz} onChange={(e) => setForm((p) => ({ ...p, name_uz: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label>{t("categories.dialog.nameRu")}</Label>
            <Input value={form.name_ru} onChange={(e) => setForm((p) => ({ ...p, name_ru: e.target.value }))} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
