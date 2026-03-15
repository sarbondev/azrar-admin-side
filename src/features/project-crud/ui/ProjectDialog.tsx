import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/lib/useToast";
import { projectApi } from "@/entities/project/api/projectApi";
import { Loader2, X, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ProjectEntity, ProjectFormData } from "@/entities/project/model/types";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; project?: ProjectEntity | null; onSuccess: () => void; }

const empty: ProjectFormData = { title: "", address: "", solution: "", result: "" };

export const ProjectDialog = ({ open, onOpenChange, project, onSuccess }: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormData>(empty);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (project) { setForm({ title: project.title, address: project.address, solution: project.solution, result: project.result }); setExisting(project.images ?? []); }
    else { setForm(empty); setExisting([]); }
    setNewImages([]);
  }, [open, project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { title, address, solution, result } = form;
    if (!title.trim() || !address.trim() || !solution.trim() || !result.trim()) {
      toast({ title: t("common.error"), description: t("common.requiredFields"), variant: "destructive" }); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim()); fd.append("address", address.trim());
      fd.append("solution", solution.trim()); fd.append("result", result.trim());
      if (project) fd.append("existingImages", JSON.stringify(existing));
      newImages.forEach((f) => fd.append("images", f));
      if (project) { await projectApi.update(project._id, fd); toast({ title: t("common.success"), description: t("projects.dialog.updated") }); }
      else { await projectApi.create(fd); toast({ title: t("common.success"), description: t("projects.dialog.created") }); }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({ title: t("common.error"), description: error.response?.data?.message ?? t("projects.dialog.saveError"), variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? t("projects.dialog.editTitle") : t("projects.dialog.addTitle")}</DialogTitle>
          <DialogDescription>{t("projects.dialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {(["title","address"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label>{t(`projects.fields.${field}`)} *</Label>
              <Input name={field} value={form[field]} onChange={handleChange} />
            </div>
          ))}
          {(["solution","result"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label>{t(`projects.fields.${field}`)} *</Label>
              <Textarea name={field} value={form[field]} onChange={handleChange} rows={3} />
            </div>
          ))}
          <div className="space-y-2">
            <Label>{t("projects.fields.images")}</Label>
            {existing.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {existing.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setExisting((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {newImages.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setNewImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full justify-center">
              <Upload className="w-4 h-4" />{t("common.selectImages")}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { setNewImages((p) => [...p, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>{t("common.cancel")}</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{project ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
