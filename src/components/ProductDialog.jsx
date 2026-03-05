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

const ProductDialog = ({ open, onOpenChange, product, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    translations: {
      uz: {
        title: "",
        description: "",
      },
      ru: {
        title: "",
        description: "",
      },
    },
    category: "",
    price: "",
    colors: [],
  });

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await apiService.getCategories();
        setCategories(response.data.data.categories || []);
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Kategoriyalarni yuklashda xatolik yuz berdi",
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
    // cleanup preview URLs on unmount
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
          uz: {
            title: "",
            description: "",
          },
          ru: {
            title: "",
            description: "",
          },
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

    // generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedPreviews((prev) => {
      // revoke URL for removed preview
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

    console.log("Submitting formData:", formData);

    try {
      const submitData = new FormData();

      // Translations maydonlarini alohida append qilish
      submitData.append(
        "translations.uz.title",
        formData.translations.uz.title,
      );
      submitData.append(
        "translations.uz.description",
        formData.translations.uz.description,
      );
      submitData.append(
        "translations.ru.title",
        formData.translations.ru.title,
      );
      submitData.append(
        "translations.ru.description",
        formData.translations.ru.description,
      );

      // Asosiy maydonlar
      submitData.append("category", formData.category);
      submitData.append("price", formData.price);

      // Ranglar massivi JSON sifatida
      if (formData.colors.length > 0) {
        submitData.append("colors", JSON.stringify(formData.colors));
      }

      // Rasmlar
      selectedFiles.forEach((file) => {
        submitData.append("images", file);
      });

      // Agar mavjud rasmlar qoldirilgan bo'lsa, ularni yubor
      if (existingImages && existingImages.length > 0) {
        submitData.append("existingImages", JSON.stringify(existingImages));
      }

      if (product) {
        console.log("Calling updateProduct with id:", product._id);
        const response = await apiService.updateProduct(product._id, submitData);
        console.log("Update response:", response);
        toast({
          title: "Muvaffaqiyat",
          description: "Mahsulot muvaffaqiyatli yangilandi",
        });
      } else {
        const response = await apiService.createProduct(submitData);
        console.log("Create response:", response);
        toast({
          title: "Muvaffaqiyat",
          description: "Mahsulot muvaffaqiyatli yaratildi",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
          error.response?.data?.message || "Mahsulotni saqlashda xatolik",
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
            {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </DialogTitle>
          <DialogDescription>
            Mahsulot ma'lumotlarini kiriting. Barcha majburiy maydonlarni
            to'ldiring.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="translations.uz.title">
                Mahsulot nomi o'zbekcha*
              </Label>
              <Input
                id="translations.uz.title"
                value={formData.translations.uz.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      uz: {
                        ...prev.translations.uz,
                        title: e.target.value,
                      },
                    },
                  }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_ru">Mahsulot nomi ruscha*</Label>
              <Input
                id="title_ru"
                value={formData.translations.ru.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      ru: {
                        ...prev.translations.ru,
                        title: e.target.value,
                      },
                    },
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description_uz">Tavsif o'zbekcha*</Label>
              <Textarea
                id="description_uz"
                value={formData.translations.uz.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      uz: {
                        ...prev.translations.uz,
                        description: e.target.value,
                      },
                    },
                  }))
                }
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description_ru">Tavsif ruscha*</Label>
              <Textarea
                id="description_ru"
                value={formData.translations.ru.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      ru: {
                        ...prev.translations.ru,
                        description: e.target.value,
                      },
                    },
                  }))
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategoriya *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={categoriesLoading}
                  required
                >
                  <option value="">
                    {categoriesLoading ? "Yükləniyor..." : "Kategoriya tanlang"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name_uz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Narx ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <ColorPicker
              value={formData.colors}
              onChange={(colors) =>
                setFormData((prev) => ({
                  ...prev,
                  colors,
                }))
              }
            />

            <div className="grid gap-2">
              <Label htmlFor="images">Rasmlar</Label>
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
                    Rasmlarni tanlash uchun bosing
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF (maksimal 5MB)
                  </span>
                </label>
              </div>

              {/* Mavjud rasmlar */}
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
                  <Label>Tanlangan rasmlar:</Label>

                  {/* previews grid */}
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
              Bekor qilish
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Yangilash" : "Yaratish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
