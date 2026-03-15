import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/lib/useToast";
import { Loader2, Upload, X } from "lucide-react";
import { ColorPicker } from "@/shared/ui/ColorPicker";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { productApi } from "@/entities/product/api/productApi";
import { useTranslation } from "react-i18next";
import type { ProductEntity, ProductFormData } from "@/entities/product/model/types";
import type { CategoryEntity } from "@/entities/category/model/types";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; product?: ProductEntity | null; onSuccess: () => void; }

const empty: ProductFormData = {
  translations: { uz: { title: "", description: "" }, ru: { title: "", description: "" } },
  category: "", price: "", colors: [],
};

export const ProductDialog = ({ open, onOpenChange, product, onSuccess }: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existing, setExisting] = useState<string[]>([]);
  const [form, setForm] = useState<ProductFormData>(empty);

  useEffect(() => {
    if (!open) return;
    setCatLoading(true);
    categoryApi.getAll().then((r) => setCategories(r.data.data.categories ?? [])).catch(() => {}).finally(() => setCatLoading(false));
  }, [open]);

  useEffect(() => () => { previews.forEach(URL.revokeObjectURL); }, [previews]);

  useEffect(() => {
    if (product) {
      setForm({
        translations: {
          uz: { title: product.translations?.uz?.title ?? "", description: product.translations?.uz?.description ?? "" },
          ru: { title: product.translations?.ru?.title ?? "", description: product.translations?.ru?.description ?? "" },
        },
        category: (product.category as CategoryEntity)?._id ?? (product.category as unknown as string) ?? "",
        price: String(product.price ?? ""),
        colors: product.colors ?? [],
      });
      setExisting(product.images ?? []);
    } else { setForm(empty); setExisting([]); }
    setFiles([]); setPreviews([]);
  }, [product, open]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    setFiles(picked);
    setPreviews(picked.map(URL.createObjectURL));
  };

  const removeFile = (i: number) => {
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => { URL.revokeObjectURL(p[i]); return p.filter((_, idx) => idx !== i); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("translations", JSON.stringify(form.translations));
      fd.append("category", form.category);
      fd.append("price", form.price);
      if (form.colors.length) fd.append("colors", JSON.stringify(form.colors));
      files.forEach((f) => fd.append("images", f));
      if (existing.length) fd.append("existingImages", JSON.stringify(existing));
      if (product) { await productApi.update(product._id, fd); toast({ title: t("common.success"), description: t("products.dialog.updated") }); }
      else { await productApi.create(fd); toast({ title: t("common.success"), description: t("products.dialog.created") }); }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({ title: t("common.error"), description: error.response?.data?.message ?? t("products.dialog.saveError"), variant: "destructive" });
    } finally { setLoading(false); }
  };

  const setTrans = (lang: "uz" | "ru", field: "title" | "description", value: string) =>
    setForm((p) => ({ ...p, translations: { ...p.translations, [lang]: { ...p.translations[lang], [field]: value } } }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? t("products.dialog.editTitle") : t("products.dialog.addTitle")}</DialogTitle>
          <DialogDescription>{t("products.dialog.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {(["uz", "ru"] as const).map((lang) => (
              <div key={lang} className="grid gap-2">
                <Label>{t(`products.dialog.name${lang === "uz" ? "Uz" : "Ru"}`)}</Label>
                <Input value={form.translations[lang].title} onChange={(e) => setTrans(lang, "title", e.target.value)} required />
                <Label>{t(`products.dialog.description${lang === "uz" ? "Uz" : "Ru"}`)}</Label>
                <Textarea value={form.translations[lang].description} onChange={(e) => setTrans(lang, "description", e.target.value)} rows={3} required />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t("products.dialog.category")}</Label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={catLoading} required>
                  <option value="">{catLoading ? t("products.dialog.categoryLoading") : t("products.dialog.selectCategory")}</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name_uz}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>{t("products.dialog.price")}</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
              </div>
            </div>
            <ColorPicker value={form.colors} onChange={(colors) => setForm((p) => ({ ...p, colors }))} />
            <div className="grid gap-2">
              <Label>{t("products.dialog.images")}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input id="images" type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
                <label htmlFor="images" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">{t("products.dialog.selectImages")}</span>
                </label>
              </div>
              {existing.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {existing.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-full h-24 object-cover rounded" />
                      <button type="button" onClick={() => setExisting((p) => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-full h-24 object-cover rounded" />
                      <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{product ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
