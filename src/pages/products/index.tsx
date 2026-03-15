import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";
import { Filter } from "@/shared/ui/Filter";
import { DeleteConfirmDialog } from "@/shared/ui/DeleteConfirmDialog";
import { useToast } from "@/shared/lib/useToast";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { productApi } from "@/entities/product/api/productApi";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { ProductDialog } from "@/features/product-crud/ui/ProductDialog";
import { Plus, Package, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslation as useI18n } from "react-i18next";
import type { ProductEntity } from "@/entities/product/model/types";
import type { CategoryEntity } from "@/entities/category/model/types";

const ProductSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1,2,3,4,5,6].map((i) => (
      <Card key={i} className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg" />
        <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
      </Card>
    ))}
  </div>
);

export const ProductsPage = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams();
  const { t } = useTranslation();
  const { i18n } = useI18n();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<ProductEntity | null>(null);
  const [deleting, setDeleting] = useState<ProductEntity | null>(null);

  useEffect(() => {
    categoryApi.getAll().then((r) => setCategories(r.data.data.categories ?? [])).catch(() => {});
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    productApi.getAll(queryParams)
      .then((r) => setProducts(r.data.data?.products ?? []))
      .catch((err) => { toast({ title: t("common.error"), description: err.response?.data?.message ?? t("products.loadError"), variant: "destructive" }); setProducts([]); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, [queryParams]); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleting) return;
    try { await productApi.delete(deleting._id); toast({ title: t("common.success"), description: t("products.deleted") }); fetchProducts(); }
    catch { toast({ title: t("common.error"), description: t("products.deleteError"), variant: "destructive" }); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">{t("products.title")}</h1><p className="text-muted-foreground">{t("products.manage")}</p></div>
        <Button onClick={() => { setEditing(null); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />{t("products.addProduct")}</Button>
      </div>
      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder={t("common.searchProducts")} value={queryParams.search ?? ""} onChange={(e) => updateQueryParams({ search: e.target.value })} className="pl-10" />
          </div>
        </Filter.Item>
        <Filter.Item>
          <select value={queryParams.category ?? ""} onChange={(e) => updateQueryParams({ category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{t("common.allProducts")}</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{i18n.language === "ru" ? c.name_ru : c.name_uz}</option>)}
          </select>
        </Filter.Item>
      </Filter>
      {loading ? <ProductSkeleton /> : products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p._id} product={p} onEdit={(p) => { setEditing(p); setShowDialog(true); }} onDelete={setDeleting} />)}
        </div>
      ) : (
        <Card><CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("products.notFound")}</h3>
          <p className="text-gray-500 text-center mb-4">{t("products.noProductsYet")}</p>
          <Button onClick={() => { setEditing(null); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />{t("products.addFirstProduct")}</Button>
        </CardContent></Card>
      )}
      <ProductDialog open={showDialog} onOpenChange={setShowDialog} product={editing} onSuccess={() => { fetchProducts(); setShowDialog(false); setEditing(null); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={() => setDeleting(null)} onConfirm={handleDelete}
        title={t("products.deleteTitle")} description={t("products.deleteDescription", { name: deleting?.translations?.uz?.title })} />
    </div>
  );
};
