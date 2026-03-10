import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getColorCode } from "@/lib/colors";
import { useTranslation } from "react-i18next";

export const ProductCard = ({
  product,
  setShowProductDialog,
  setEditingProduct,
  setDeleteProduct,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language;
  const title =
    product.translations?.[currentLang]?.title ||
    product.translations?.uz?.title ||
    t("common.noTitle");
  const description =
    product.translations?.[currentLang]?.description ||
    product.translations?.uz?.description ||
    t("common.noDescription");

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleView = (productId) => {
    navigate(`/products/${productId}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=200&width=200";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:3000${imagePath}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative group">
        <img
          src={getImageUrl(product.images?.[0]) || "/placeholder.svg"}
          alt={product.translations?.uz?.title || "Product Image"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleView(product._id)}
            title={t("common.view")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(product)}
            title={t("common.edit")}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteProduct(product)}
            title={t("common.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">
            {product.category?.[currentLang === "ru" ? "name_ru" : "name_uz"] ||
              t("common.category")}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-bold text-lg">${product.price}</p>

        {product.colors?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              {t("common.colors")}:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200"
                  title={color}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorCode(color) }}
                  />
                  <span className="text-xs text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.images?.length > 1 && (
          <div className="text-xs text-gray-400 pt-2 border-t">
            📷 {product.images.length} {t("common.imagesCount")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
