import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/lib/useToast";
import { orderApi } from "@/entities/order/api/orderApi";
import {
  Loader2,
  Phone,
  MapPin,
  Package,
  User,
  ShoppingBag,
  ScrollText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderEntity, OrderStatus } from "@/entities/order/model/types";
import { Lang } from "@/entities/project/model/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: OrderEntity | null;
  onSuccess: () => void;
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  in_process: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const OrderDialog = ({
  open,
  onOpenChange,
  order,
  onSuccess,
}: Props) => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [notes, setNotes] = useState("");
  const currentLanguage = i18n.language as Lang;

  if (!order) return null;

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "in_process", label: t("orders.statusOptions.in_process") },
    { value: "delivered", label: t("orders.statusOptions.delivered") },
    { value: "cancelled", label: t("orders.statusOptions.cancelled") },
  ];

  const handleUpdate = async () => {
    if (!newStatus) {
      toast({
        title: t("common.error"),
        description: t("orders.selectStatus"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await orderApi.updateStatus(order._id, newStatus, notes);
      toast({
        title: t("common.success"),
        description: t("orders.statusUpdated"),
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({
        title: t("common.error"),
        description: error.response?.data?.message ?? t("orders.updateError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("orders.orderId")} #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("orders.currentStatus")}
              </p>
              <Badge className={STATUS_COLOR[order.status]}>
                {t(`orders.statusOptions.${order.status}`)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t("orders.createdAt")}</p>
              <p className="text-sm font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("orders.customerInfo")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                {order.customer?.fullName}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                {order.customer?.phoneNumber}
              </p>
              {order.customer?.address && (
                <p className="flex items-start gap-2 text-gray-600 mt-2 pt-2 border-t">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {order.customer.address}
                </p>
              )}
            </div>
          </div>
          {order.internalNotes && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                {t("orders.internalNotes")}
              </h3>
              <div className="border-t-2 pt-3 flex justify-between items-center">
                <p className="text-md font-bold">{order.internalNotes}</p>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t("orders.products")} ({order.products?.length ?? 0})
            </h3>
            {order.products?.map((item, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  {item?.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.translations?.[currentLanguage]?.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {item?.product?.translations?.[currentLanguage]?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item?.product?.translations?.[currentLanguage]?.description}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-600">
                      {t("orders.price")}: {item?.price?.toLocaleString()}{" "}
                      {t("orders.currency")}
                    </p>
                    <p className="font-medium">
                      {t("orders.qty")}: ×{item?.quantity ?? 0}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      {(
                        (item?.price ?? 0) * (item?.quantity ?? 0)
                      ).toLocaleString()}{" "}
                      {t("orders.currency")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t-2 pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold">
                {t("orders.total")}:
              </span>
              <span className="text-2xl font-bold">
                {order.totalPrice?.toLocaleString()} {t("orders.currency")}
              </span>
            </div>
          </div>
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">
                {t("orders.updateStatus")}
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>{t("orders.newStatus")}</Label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as OrderStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="">{t("orders.selectStatus")}</option>
                    {statusOptions
                      .filter((s) => s.value !== order.status)
                      .map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label>{t("orders.internalNotes")}</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("orders.updateStatus")}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
