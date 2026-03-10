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
import { Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";

const TestimonialDialog = ({ open, onOpenChange, testimonial, onSuccess }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "+998",
    description: "",
  });

  const isEdit = !!testimonial;

  useEffect(() => {
    if (open) {
      if (testimonial) {
        setForm({
          clientName: testimonial.client?.fullName || "",
          clientPhone: testimonial.client?.phoneNumber || "+998",
          description: testimonial.description || "",
        });
        setImagePreview(testimonial.client?.image || null);
      } else {
        setForm({ clientName: "", clientPhone: "+998", description: "" });
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [open, testimonial]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    const { clientName, clientPhone, description } = form;
    if (!clientName.trim() || !clientPhone.trim() || !description.trim()) {
      toast({ title: t("common.error"), description: t("common.requiredFields"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("client[fullName]", clientName.trim());
      formData.append("client[phoneNumber]", clientPhone.trim());
      formData.append("description", description.trim());
      if (imageFile) formData.append("image", imageFile);

      if (isEdit) {
        await apiService.updateTestimonial(testimonial._id, formData);
        toast({ title: t("common.success"), description: t("testimonials.dialog.updated") });
      } else {
        await apiService.createTestimonial(formData);
        toast({ title: t("common.success"), description: t("testimonials.dialog.created") });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("testimonials.dialog.saveError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("testimonials.dialog.editTitle") : t("testimonials.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>{t("testimonials.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Client image */}
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientImage")}</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border group">
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {t("common.images")} tanlash
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          {/* Client name */}
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientName")} *</Label>
            <Input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder={t("testimonials.dialog.clientNamePlaceholder")}
            />
          </div>

          {/* Client phone */}
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientPhone")} *</Label>
            <IMaskInput
              mask="+998 (00) 000-00-00"
              value={form.clientPhone}
              unmask={false}
              onAccept={(value) => setForm((prev) => ({ ...prev, clientPhone: value }))}
              lazy={false}
              autofix={true}
              placeholder="+998 (90) 123-45-67"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>{t("testimonials.fields.description")} *</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("testimonials.dialog.descriptionPlaceholder")}
              rows={4}
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

export default TestimonialDialog;
