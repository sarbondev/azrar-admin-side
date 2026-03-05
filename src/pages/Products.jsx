import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Plus, Package, Search } from "lucide-react";
import ProductDialog from "../components/ProductDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useQueryParams } from "../hooks/use-query-params";
import { Filter } from "../components/Filter";
import { ProductSkeleton } from "../components/productComponents/ProductSkeleton";
import { ProductList } from "../components/productComponents/ProductList";

const Products = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams();

  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data.data.categories || []);
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Kategoriyalarni yuklashda xatolik yuz berdi",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts(queryParams);
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        setProducts(responseData.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
          error.response?.data?.message ||
          "Mahsulotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteProduct(deleteProduct._id);
      toast({
        title: "Muvaffaqiyat",
        description: "Mahsulot muvaffaqiyatli o'chirildi",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
    setDeleteProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, [queryParams]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mahsulotlar</h1>
          <p className="text-muted-foreground">
            Mahsulotlarni boshqaring va yangilarini qo'shing
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowProductDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi mahsulot
        </Button>
      </div>

      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Mahsulotlarni qidirish..."
              value={queryParams.search || ""}
              onChange={(e) => updateQueryParams({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </Filter.Item>
        <Filter.Item>
          <select
            value={queryParams.category || ""}
            onChange={(e) => updateQueryParams({ category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Barcha mahsulotlar</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name_uz}
              </option>
            ))}
          </select>
        </Filter.Item>
      </Filter>

      {loading ? (
        <ProductSkeleton />
      ) : products.length > 0 ? (
        <ProductList
          products={products}
          setShowProductDialog={setShowProductDialog}
          setEditingProduct={setEditingProduct}
          setDeleteProduct={setDeleteProduct}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Mahsulotlar topilmadi
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Hozircha mahsulotlar yo'q yoki qidiruv natijasida hech narsa
              topilmadi.
            </p>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowProductDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Birinchi mahsulotni qo'shing
            </Button>
          </CardContent>
        </Card>
      )}

      <ProductDialog
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
        product={editingProduct}
        onSuccess={() => {
          fetchProducts();
          setShowProductDialog(false);
          setEditingProduct(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
        title="Mahsulotni o'chirish"
        description={`"${deleteProduct?.translations?.uz?.title}" mahsulotini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
      />
    </div>
  );
};

export default Products;
