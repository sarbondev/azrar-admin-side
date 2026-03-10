import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Plus, MessageSquare, Search, Edit, Trash2, Phone } from "lucide-react";
import TestimonialDialog from "../components/testimonialComponents/TestimonialDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useQueryParams } from "../hooks/use-query-params";
import { Filter } from "../components/Filter";
import { useTranslation } from "react-i18next";

const DEFAULT_AVATAR = "https://cdn-icons-png.freepik.com/512/3177/3177440.png";

const Testimonials = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteTestimonial, setDeleteTestimonial] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTestimonials(queryParams);
      const data = res.data;
      if (data.success && data.data) {
        setTestimonials(data.data.testimonials || []);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("testimonials.loadError"),
        variant: "destructive",
      });
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteTestimonial(deleteTestimonial._id);
      toast({
        title: t("common.success"),
        description: t("testimonials.deleted"),
      });
      fetchTestimonials();
    } catch (error) {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("testimonials.deleteError"),
        variant: "destructive",
      });
    }
    setDeleteTestimonial(null);
  };

  useEffect(() => {
    fetchTestimonials();
  }, [queryParams]);

  const openEdit = (item) => {
    setEditingTestimonial(item);
    setShowDialog(true);
  };
  const openCreate = () => {
    setEditingTestimonial(null);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("testimonials.title")}
          </h1>
          <p className="text-muted-foreground">{t("testimonials.manage")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("testimonials.addTestimonial")}
        </Button>
      </div>

      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("testimonials.searchPlaceholder")}
              value={queryParams.search || ""}
              onChange={(e) => updateQueryParams({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </Filter.Item>
      </Filter>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.client?.image || DEFAULT_AVATAR}
                      alt={item.client?.fullName}
                      className="w-12 h-12 rounded-full object-cover border flex-shrink-0"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {item.client?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {item.client?.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTestimonial(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 line-clamp-3 italic">
                  &ldquo;{item.description}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString("uz-UZ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("testimonials.notFound")}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {t("testimonials.noTestimonialsYet")}
            </p>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("testimonials.addFirstTestimonial")}
            </Button>
          </CardContent>
        </Card>
      )}

      <TestimonialDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        testimonial={editingTestimonial}
        onSuccess={() => {
          fetchTestimonials();
          setShowDialog(false);
          setEditingTestimonial(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteTestimonial}
        onOpenChange={() => setDeleteTestimonial(null)}
        onConfirm={handleDelete}
        title={t("testimonials.deleteTitle")}
        description={t("testimonials.deleteDescription", {
          name: deleteTestimonial?.client?.fullName,
        })}
      />
    </div>
  );
};

export default Testimonials;
