import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/lib/useToast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AdminEntity } from "@/entities/auth/model/types";
import api from "@/shared/api/axiosInstance";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; admin?: AdminEntity | null; onSuccess: () => void; }

interface AdminFormData { fullName: string; phoneNumber: string; password: string; }

export const AdminDialog = ({ open, onOpenChange, admin, onSuccess }: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AdminFormData>({ fullName: "", phoneNumber: "", password: "" });

  useEffect(() => {
    if (admin) setForm({ fullName: admin.fullName, phoneNumber: admin.phoneNumber, password: "" });
    else setForm({ fullName: "", phoneNumber: "", password: "" });
  }, [admin, open]);

  const set = (k: keyof AdminFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin && !form.password) {
      toast({ title: t("common.error"), description: t("admins.dialog.passwordRequiredError"), variant: "destructive" }); return;
    }
    if (form.password && form.password.length < 6) {
      toast({ title: t("common.error"), description: t("admins.dialog.passwordMinLength"), variant: "destructive" }); return;
    }
    setLoading(true);
    try {
      const data: Partial<AdminFormData> = { fullName: form.fullName, phoneNumber: form.phoneNumber };
      if (form.password) data.password = form.password;
      if (admin) { await api.put(`/admin/${admin._id}`, data); toast({ title: t("common.success"), description: t("admins.dialog.updated") }); }
      else { await api.post("/admin", data); toast({ title: t("common.success"), description: t("admins.dialog.created") }); }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({ title: t("common.error"), description: error.response?.data?.message ?? t("admins.dialog.saveError"), variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{admin ? t("admins.dialog.editTitle") : t("admins.dialog.addTitle")}</DialogTitle>
          <DialogDescription>{t("admins.dialog.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>{t("admins.dialog.fullName")}</Label>
              <Input value={form.fullName} onChange={set("fullName")} required />
            </div>
            <div className="grid gap-2">
              <Label>{t("admins.dialog.phoneNumber")}</Label>
              <Input type="tel" placeholder="+998901234567" value={form.phoneNumber} onChange={set("phoneNumber")} required />
            </div>
            <div className="grid gap-2">
              <Label>{admin ? `${t("admins.dialog.password")} ${t("admins.dialog.passwordForChange")}` : t("admins.dialog.passwordRequired")}</Label>
              <Input type="password" value={form.password} onChange={set("password")} required={!admin}
                placeholder={admin ? t("admins.dialog.passwordPlaceholderEdit") : t("admins.dialog.passwordPlaceholderNew")} />
              {admin && <p className="text-xs text-gray-500">{t("admins.dialog.passwordLeaveEmpty")}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{admin ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
