import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import ProductDialog from "../components/ProductDialog";
import { getColorCode } from "@/lib/colors";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        setProduct(response.data.data.product);
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Mahsulotni yuklashda xatolik yuz berdi",
          variant: "destructive",
        });
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=500&width=500";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:3000${imagePath}`;
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    // Refresh product data
    console.log("Refreshing product after edit");
    const fetchProduct = async () => {
      try {
        const response = await apiService.getProduct(id);
        console.log("Fetched updated product:", response.data.data.product);
        setProduct(response.data.data.product);
        toast({
          title: "Muvaffaqiyat",
          description: "Mahsulot yangilandi",
        });
      } catch (error) {
        console.log("Error fetching updated product:", error);
        toast({
          title: "Xatolik",
          description: "Mahsulotni qayta yuklashda xatolik yuz berdi",
          variant: "destructive",
        });
      }
    };
    fetchProduct();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Mahsulot topilmadi</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/products")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
            <Button
              onClick={() => setShowEditDialog(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Tahrirlash
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <div className="aspect-square">
                  <img
                    src={getImageUrl(product.images?.[selectedImageIndex])}
                    alt={product.translations?.uz.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.translations?.uz.title}
                  </h1>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {product.category?.name_uz || "Kategoriya"}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-blue-600 mt-4">
                  ${product.price}
                </p>
              </div>

              <hr />

              {/* Russian Title */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Ruscha nomi:</p>
                <p className="text-lg font-medium text-gray-800">
                  {product.translations?.ru.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  O'zbekcha tavsif:
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.translations?.uz.description}
                </p>
              </div>

              {/* Russian Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Ruscha tavsif:
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.translations?.ru.description}
                </p>
              </div>

              <hr />

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Mavjud ranglar:
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
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

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rasmlar soni:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {product.images?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Yaratilgan:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => setShowEditDialog(true)}
                className="w-full"
                size="lg"
              >
                <Edit className="mr-2 h-4 w-4" />
                Mahsulotni tahrirlash
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <ProductDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        product={product}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default ProductDetail;
