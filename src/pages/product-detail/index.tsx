import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productApi } from "@/entities/product/api/productApi";
import { ProductDialog } from "@/features/product-crud/ui/ProductDialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useToast } from "@/shared/lib/useToast";
import { getColorCode } from "@/shared/lib/colors";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Lang, ProductEntity } from "@/entities/product/model/types";
import type { CategoryEntity } from "@/entities/category/model/types";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "uz";
  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  const fetchProduct = () => {
    if (!id) return;
    setLoading(true);
    productApi
      .getById(id)
      .then((r) => setProduct(r.data.data.product))
      .catch(() => {
        toast({
          title: t("common.error"),
          description: t("products.loadError"),
          variant: "destructive",
        });
        navigate("/products");
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchProduct, [id]); // eslint-disable-line

  const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder.svg?height=500&width=500";
    return path.startsWith("http") ? path : `http://localhost:3000${path}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">{t("products.notFound")}</p>
      </div>
    );

  const cat = product.category as CategoryEntity;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/products")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
          <Button onClick={() => setShowEdit(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            {t("common.edit")}
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 aspect-square">
              <img
                src={getImageUrl(product.images?.[imgIndex])}
                alt={product.translations?.uz.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${imgIndex === i ? "border-blue-500" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.translations?.[currentLang as Lang]?.title}
                </h1>
                <Badge variant="secondary" className="whitespace-nowrap">
                  {cat?.name_uz ?? t("common.category")}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-4">
                {product.price.toLocaleString()}
                {currentLang === "uz" ? "so'm" : "сум"}
              </p>
            </div>
            <hr />
            <p className="text-sm text-gray-500">
              {t("products.detail.title")}:
            </p>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t("products.detail.description")}:
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.translations?.[currentLang as Lang]?.description}
              </p>
            </div>
            <hr />
            {product.colors?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {t("common.colors")}:
                </h2>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: getColorCode(color) }}
                      />
                      <span className="font-medium text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <hr />

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">
                {t("common.createdAt")}:
              </p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(product.createdAt).toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        product={product}
        onSuccess={() => {
          setShowEdit(false);
          fetchProduct();
          toast({
            title: t("common.success"),
            description: t("products.dialog.updated"),
          });
        }}
      />
    </>
  );
};
