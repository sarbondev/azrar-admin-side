import { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../../services/api";
import { Loader2, X, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProjectDialog = ({ open, onOpenChange, project, onSuccess }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState({ title: "", address: "", solution: "", result: "" });

  const isEdit = !!project;

  useEffect(() => {
    if (open) {
      if (project) {
        setForm({
          title: project.title || "",
          address: project.address || "",
          solution: project.solution || "",
          result: project.result || "",
        });
        setExistingImages(project.images || []);
      } else {
        setForm({ title: "", address: "", solution: "", result: "" });
        setExistingImages([]);
      }
      setNewImages([]);
    }
  }, [open, project]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const { title, address, solution, result } = form;
    if (!title.trim() || !address.trim() || !solution.trim() || !result.trim()) {
      toast({ title: t("common.error"), description: t("common.requiredFields"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("address", address.trim());
      formData.append("solution", solution.trim());
      formData.append("result", result.trim());

      if (isEdit) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      newImages.forEach((file) => formData.append("images", file));

      if (isEdit) {
        await apiService.updateProject(project._id, formData);
        toast({ title: t("common.success"), description: t("projects.dialog.updated") });
      } else {
        await apiService.createProject(formData);
        toast({ title: t("common.success"), description: t("projects.dialog.created") });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("projects.dialog.saveError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("projects.dialog.editTitle") : t("projects.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>{t("projects.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label>{t("projects.fields.title")} *</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t("projects.dialog.titlePlaceholder")}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>{t("projects.fields.address")} *</Label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder={t("projects.dialog.addressPlaceholder")}
            />
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <Label>{t("projects.fields.solution")} *</Label>
            <Textarea
              name="solution"
              value={form.solution}
              onChange={handleChange}
              placeholder={t("projects.dialog.solutionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Result */}
          <div className="space-y-2">
            <Label>{t("projects.fields.result")} *</Label>
            <Textarea
              name="result"
              value={form.result}
              onChange={handleChange}
              placeholder={t("projects.dialog.resultPlaceholder")}
              rows={3}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>{t("projects.fields.images")}</Label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New images preview */}
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {newImages.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full justify-center"
            >
              <Upload className="w-4 h-4" />
              {t("common.images")} tanlash
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
