import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const ProductCard = ({
  product,
  setShowProductDialog,
  setEditingProduct,
  setDeleteProduct,
}) => {
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const categories = [
    { value: "bathrobe", label: "Xalat" },
    { value: "towel", label: "Sochiq" },
    { value: "set", label: "To'plam" },
    { value: "accessories", label: "Aksessuarlar" },
  ];

  const getCategoryLabel = (category) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=200&width=200";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:3000${imagePath}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={getImageUrl(product.images?.[0]) || "/placeholder.svg"}
          alt={product.title_uz}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteProduct(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {product.tranlations.uz.title || "smth"}
          </CardTitle>
          <Badge variant="secondary">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.tranlations.uz.description || "smth"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-bold">{product.price} So'm</p>
        {product.colors?.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Ranglar: {product.colors.join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
