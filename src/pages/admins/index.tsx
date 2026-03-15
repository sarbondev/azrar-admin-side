import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DeleteConfirmDialog } from "@/shared/ui/DeleteConfirmDialog";
import { useToast } from "@/shared/lib/useToast";
import { useAuth } from "@/app/providers/AuthContext";
import { AdminDialog } from "@/features/admin-crud/ui/AdminDialog";
import { Plus, Edit, Trash2, Users, Phone, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "@/shared/api/axiosInstance";
import type { AdminEntity } from "@/entities/auth/model/types";

export const AdminsPage = () => {
  const { toast } = useToast();
  const { admin: currentUser } = useAuth();
  const { t } = useTranslation();
  const [admins, setAdmins] = useState<AdminEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<AdminEntity | null>(null);
  const [deleting, setDeleting] = useState<AdminEntity | null>(null);

  const fetchAdmins = () => {
    api.get<{ success: boolean; data: { admins: AdminEntity[] } }>("/admin")
      .then((r) => setAdmins(r.data.data?.admins ?? []))
      .catch((err) => { toast({ title: t("common.error"), description: err.response?.data?.message ?? t("admins.loadError"), variant: "destructive" }); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchAdmins, []); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleting) return;
    try { await api.delete(`/admin/${deleting._id}`); toast({ title: t("common.success"), description: t("admins.deleted") }); fetchAdmins(); }
    catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; toast({ title: t("common.error"), description: e.response?.data?.message ?? t("admins.deleteError"), variant: "destructive" }); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">{t("admins.title")}</h1><p className="text-muted-foreground">{t("admins.manage")}</p></div>
        <Button onClick={() => { setEditing(null); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />{t("admins.addAdmin")}</Button>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => <Card key={i} className="animate-pulse"><CardHeader><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2 mt-2" /></CardHeader></Card>)}
        </div>
      ) : admins.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <Card key={admin._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {admin.fullName}
                      {admin._id === currentUser?._id && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t("admins.you")}</span>
                      )}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{admin.phoneNumber}</p>
                      <p className="flex items-center gap-1"><Calendar className="h-3 w-3" />{t("admins.registeredAt")}: {new Date(admin.createdAt).toLocaleDateString("uz-UZ")}</p>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(admin); setShowDialog(true); }}><Edit className="h-4 w-4" /></Button>
                    {admin._id !== currentUser?._id && (
                      <Button size="sm" variant="destructive" onClick={() => setDeleting(admin)}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("admins.notFound")}</h3>
          <p className="text-gray-500 text-center mb-4">{t("admins.noAdminsYet")}</p>
          <Button onClick={() => { setEditing(null); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />{t("admins.addFirstAdmin")}</Button>
        </CardContent></Card>
      )}
      <AdminDialog open={showDialog} onOpenChange={setShowDialog} admin={editing} onSuccess={() => { fetchAdmins(); setShowDialog(false); setEditing(null); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={() => setDeleting(null)} onConfirm={handleDelete}
        title={t("admins.deleteTitle")} description={t("admins.deleteDescription", { name: deleting?.fullName })} />
    </div>
  );
};
