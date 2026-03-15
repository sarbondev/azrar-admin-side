import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthContext";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useToast } from "@/shared/lib/useToast";
import { Loader2 } from "lucide-react";
import { IMaskInput } from "react-imask";
import { useTranslation } from "react-i18next";

const PHONE_MASK = "+998 (00) 000-00-00";
const MIN_PASS = 6;

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phoneNumber: "+998", password: "" });
  const [errors, setErrors] = useState({ phoneNumber: "", password: "" });

  const validate = useCallback(() => {
    const e: typeof errors = { phoneNumber: "", password: "" };
    const raw = form.phoneNumber.replace(/\D/g, "");
    if (raw.length !== 12 || !raw.startsWith("998")) e.phoneNumber = t("login.errors.invalidPhone");
    if (!form.password) e.password = t("login.errors.passwordRequired");
    else if (form.password.length < MIN_PASS) e.password = t("login.errors.passwordMinLength", { min: MIN_PASS });
    setErrors(e);
    return !e.phoneNumber && !e.password;
  }, [form, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast({ title: t("common.error"), description: t("common.fillAllFields"), variant: "destructive" }); return; }
    setLoading(true);
    try {
      const rawPhone = "+" + form.phoneNumber.replace(/\D/g, "");
      const result = await login(rawPhone, form.password);
      if (!result.success) toast({ title: t("common.error"), description: result.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl text-center"><img src="/logo_dark.svg" alt="logo" className="mx-auto" /></CardTitle>
          <CardDescription className="text-center">{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("login.phoneNumber")}</Label>
              <IMaskInput mask={PHONE_MASK} value={form.phoneNumber} unmask={false}
                onAccept={(v: string) => { setForm((p) => ({ ...p, phoneNumber: v })); setErrors((p) => ({ ...p, phoneNumber: "" })); }}
                lazy={false} autofix={true} placeholder="+998 (90) 123-45-67"
                className={`flex h-10 w-full rounded-md border ${errors.phoneNumber ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`} />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("login.password")}</Label>
              <Input type="password" value={form.password} onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: "" })); }}
                placeholder="••••••••" className={errors.password ? "border-red-500" : ""} />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#173F5F]" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
