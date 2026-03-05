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
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Loader2 } from "lucide-react";

const CategoryDialog = ({ open, onOpenChange, category, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name_uz: "", name_ru: "" });

  useEffect(() => {
    if (category) {
      setFormData({
        name_uz: category.name_uz || "",
        name_ru: category.name_ru || "",
      });
    } else {
      setFormData({ name_uz: "", name_ru: "" });
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await apiService.updateCategory(category._id, formData);
        toast({ title: "Muvaffaqiyat", description: "Kategoriya yangilandi" });
      } else {
        await apiService.createCategory(formData);
        toast({ title: "Muvaffaqiyat", description: "Kategoriya yaratildi" });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
          error.response?.data?.message || "Kategoriya saqlashda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Kategoriya tahrirlash" : "Yangi kategoriya"}
          </DialogTitle>
          <DialogDescription>
            Ikkita til (uz/ru)da nomni kiriting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name_uz">Nomi (uzbekcha)*</Label>
            <Input
              id="name_uz"
              value={formData.name_uz}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name_uz: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name_ru">Nomi (ruscha)*</Label>
            <Input
              id="name_ru"
              value={formData.name_ru}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name_ru: e.target.value }))
              }
              required
            />
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
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
