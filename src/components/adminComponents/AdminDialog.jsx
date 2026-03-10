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
import { apiService } from "../../services/api";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminDialog = ({ open, onOpenChange, admin, onSuccess }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        fullName: admin.fullName || "",
        phoneNumber: admin.phoneNumber || "",
        password: "",
      });
    } else {
      setFormData({
        fullName: "",
        phoneNumber: "",
        password: "",
      });
    }
  }, [admin, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin && !formData.password) {
      toast({
        title: t("common.error"),
        description: t("admins.dialog.passwordRequiredError"),
        variant: "destructive",
      });
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast({
        title: t("common.error"),
        description: t("admins.dialog.passwordMinLength"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      if (formData.password) {
        submitData.password = formData.password;
      }

      if (admin) {
        await apiService.updateAdmin(admin._id, submitData);
        toast({
          title: t("common.success"),
          description: t("admins.dialog.updated"),
        });
      } else {
        await apiService.createAdmin(submitData);
        toast({
          title: t("common.success"),
          description: t("admins.dialog.created"),
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("admins.dialog.saveError"),
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
          <DialogTitle>
            {admin ? t("admins.dialog.editTitle") : t("admins.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("admins.dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">{t("admins.dialog.fullName")}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">
                {t("admins.dialog.phoneNumber")}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+998901234567"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                {admin
                  ? `${t("admins.dialog.password")} ${t("admins.dialog.passwordForChange")}`
                  : t("admins.dialog.passwordRequired")}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required={!admin}
                placeholder={
                  admin
                    ? t("admins.dialog.passwordPlaceholderEdit")
                    : t("admins.dialog.passwordPlaceholderNew")
                }
              />
              {admin && (
                <p className="text-xs text-gray-500">
                  {t("admins.dialog.passwordLeaveEmpty")}
                </p>
              )}
            </div>
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
              {admin ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
