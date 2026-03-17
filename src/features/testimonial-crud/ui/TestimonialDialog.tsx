import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/lib/useToast";
import { testimonialApi } from "@/entities/testimonial/api/testimonialApi";
import { Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import type { TestimonialEntity } from "@/entities/testimonial/model/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  testimonial?: TestimonialEntity | null;
  onSuccess: () => void;
}

interface FormState {
  client: { fullName: string; phoneNumber: string };
  description: string;
}
const empty: FormState = {
  client: { fullName: "", phoneNumber: "+998" },
  description: "",
};

export const TestimonialDialog = ({
  open,
  onOpenChange,
  testimonial,
  onSuccess,
}: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (!open) return;
    if (testimonial) {
      setForm({
        client: {
          fullName: testimonial.client?.fullName ?? "",
          phoneNumber: testimonial.client?.phoneNumber ?? "+998",
        },
        description: testimonial.description ?? "",
      });
      setImagePreview(testimonial.client?.image ?? null);
    } else {
      setForm(empty);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [open, testimonial]);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({
      ...p,
      client: { ...p.client, [e.target.name]: e.target.value },
    }));

  const handleSubmit = async () => {
    const { client, description } = form;
    if (
      !client.fullName.trim() ||
      !client.phoneNumber.trim() ||
      !description.trim()
    ) {
      toast({
        title: t("common.error"),
        description: t("common.requiredFields"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append(
        "client",
        JSON.stringify({
          fullName: client.fullName.trim(),
          phoneNumber: client.phoneNumber.trim(),
        }),
      );
      fd.append("description", description.trim());
      if (imageFile) fd.append("image", imageFile);
      if (testimonial) {
        await testimonialApi.update(testimonial._id, fd);
        toast({
          title: t("common.success"),
          description: t("testimonials.dialog.updated"),
        });
      } else {
        await testimonialApi.create(fd);
        toast({
          title: t("common.success"),
          description: t("testimonials.dialog.created"),
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: { message?: string; errors?: { message: string }[] };
        };
      };

      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;

      toast({
        title: t("common.error"),
        description: errors?.length
          ? errors.map((e) => `• ${e.message}`).join("\n")
          : (message ?? t("testimonials.dialog.saveError")),
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
            {testimonial
              ? t("testimonials.dialog.editTitle")
              : t("testimonials.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("testimonials.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientImage")}</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border group">
                  <img
                    src={imagePreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                {t("testimonials.fields.selectImage")}
              </Button>
              <input
                ref={fileRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImageFile(f);
                    setImagePreview(URL.createObjectURL(f));
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientName")} *</Label>
            <Input
              name="fullName"
              value={form.client.fullName}
              onChange={handleClientChange}
              placeholder={t("testimonials.dialog.clientNamePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("testimonials.fields.clientPhone")} *</Label>
            <IMaskInput
              mask="+998 (00) 000-00-00"
              value={form.client.phoneNumber}
              unmask={false}
              onAccept={(v: string) =>
                setForm((p) => ({
                  ...p,
                  client: { ...p.client, phoneNumber: v },
                }))
              }
              lazy={false}
              autofix={true}
              placeholder="+998 (90) 123-45-67"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("testimonials.fields.description")} *</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder={t("testimonials.dialog.descriptionPlaceholder")}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {testimonial ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
