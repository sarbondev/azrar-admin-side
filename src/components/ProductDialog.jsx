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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Loader2, Upload, X } from "lucide-react";
import ColorPicker from "./ColorPicker";
import { useTranslation } from "react-i18next";

const ProductDialog = ({ open, onOpenChange, product, onSuccess }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    translations: {
      uz: { title: "", description: "" },
      ru: { title: "", description: "" },
    },
    category: "",
    price: "",
    colors: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await apiService.getCategories();
        setCategories(response.data.data.categories || []);
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('products.categoryLoadError'),
          variant: "destructive",
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open, toast]);

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPreviews]);

  useEffect(() => {
    if (product) {
      setFormData({
        translations: {
          uz: {
            title: product.translations?.uz?.title || "",
            description: product.translations?.uz?.description || "",
          },
          ru: {
            title: product.translations?.ru?.title || "",
            description: product.translations?.ru?.description || "",
          },
        },
        category: product.category?._id || product.category || "",
        price: product.price?.toString() || "",
        colors: product.colors || [],
      });
      setExistingImages(product.images || []);
    } else {
      setFormData({
        translations: {
          uz: { title: "", description: "" },
          ru: { title: "", description: "" },
        },
        category: "",
        price: "",
        colors: [],
      });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setSelectedPreviews([]);
  }, [product, open]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedPreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("translations", JSON.stringify(formData.translations));
      submitData.append("category", formData.category);
      submitData.append("price", formData.price);

      if (formData.colors.length > 0) {
        submitData.append("colors", JSON.stringify(formData.colors));
      }

      selectedFiles.forEach((file) => {
        submitData.append("images", file);
      });

      if (existingImages && existingImages.length > 0) {
        submitData.append("existingImages", JSON.stringify(existingImages));
      }

      if (product) {
        await apiService.updateProduct(product._id, submitData);
        toast({
          title: t('common.success'),
          description: t('products.dialog.updated'),
        });
      } else {
        await apiService.createProduct(submitData);
        toast({
          title: t('common.success'),
          description: t('products.dialog.created'),
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: t('common.error'),
        description:
          error.response?.data?.message || t('products.dialog.saveError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? t('products.dialog.editTitle') : t('products.dialog.addTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('products.dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="translations.uz.title">
                {t('products.dialog.nameUz')}
              </Label>
              <Input
                id="translations.uz.title"
                value={formData.translations.uz.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      uz: { ...prev.translations.uz, title: e.target.value },
                    },
                  }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_ru">{t('products.dialog.nameRu')}</Label>
              <Input
                id="title_ru"
                value={formData.translations.ru.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      ru: { ...prev.translations.ru, title: e.target.value },
                    },
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description_uz">{t('products.dialog.descriptionUz')}</Label>
              <Textarea
                id="description_uz"
                value={formData.translations.uz.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      uz: { ...prev.translations.uz, description: e.target.value },
                    },
                  }))
                }
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description_ru">{t('products.dialog.descriptionRu')}</Label>
              <Textarea
                id="description_ru"
                value={formData.translations.ru.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      ru: { ...prev.translations.ru, description: e.target.value },
                    },
                  }))
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('products.dialog.category')}</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={categoriesLoading}
                  required
                >
                  <option value="">
                    {categoriesLoading ? t('products.dialog.categoryLoading') : t('products.dialog.selectCategory')}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name_uz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">{t('products.dialog.price')}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <ColorPicker
              value={formData.colors}
              onChange={(colors) =>
                setFormData((prev) => ({ ...prev, colors }))
              }
            />

            <div className="grid gap-2">
              <Label htmlFor="images">{t('products.dialog.images')}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {t('products.dialog.selectImages')}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {t('products.dialog.imageFormats')}
                  </span>
                </label>
              </div>

              {existingImages && existingImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`existing-${idx}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>{t('products.dialog.selectedImages')}</Label>

                  {selectedPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {selectedPreviews.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
