import { useState } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/lib/useToast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: Props) => {
  const { changePassword } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: t("common.error"),
        description: t("changePassword.mismatch"),
        variant: "destructive",
      });
      return;
    }
    if (form.newPassword.length < 6) {
      toast({
        title: t("common.error"),
        description: t("changePassword.minLength"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      toast({
        title: t("common.success"),
        description: t("changePassword.success"),
      });
      onOpenChange(false);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description: error.response?.data?.message ?? t("changePassword.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("changePassword.title")}</DialogTitle>
          <DialogDescription>
            {t("changePassword.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {(
              ["currentPassword", "newPassword", "confirmPassword"] as const
            ).map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>{t(`changePassword.${field}`)}</Label>
                <Input
                  id={field}
                  type="password"
                  value={form[field]}
                  onChange={set(field)}
                  required
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("changePassword.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
