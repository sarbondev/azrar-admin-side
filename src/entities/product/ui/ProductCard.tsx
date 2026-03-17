import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getColorCode } from "@/shared/lib/colors";
import { useTranslation } from "react-i18next";
import type { Lang, ProductEntity } from "../model/types";

interface Props {
  product: ProductEntity;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;

  const productData = {
    title: product.translations?.[lang]?.title ?? t("products.noTitle"),
    description:
      product.translations?.[lang]?.description ?? t("products.noDescription"),
    price: `${product.price.toLocaleString()} ${lang === "uz" ? "so'm" : "сум"}`,
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative group">
        <img
          src={product.images?.[0]}
          alt={productData.title}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">
            {productData.title}
          </CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">
            {product.category?.[lang === "ru" ? "name_ru" : "name_uz"] ??
              t("common.category")}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {productData.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-bold text-lg">{productData.price}</p>
        {product.colors?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              {t("common.colors")}:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200"
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
