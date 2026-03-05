import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../../services/api";
import {
  Loader2,
  Phone,
  MapPin,
  Package,
  User,
  ShoppingBag,
  UserCheck,
} from "lucide-react";

export const OrderDialog = ({ open, onOpenChange, order, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const statusOptions = [
    {
      value: "in_process",
      label: "Jarayonda",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "delivered",
      label: "Yetkazilgan",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Bekor qilingan",
      color: "bg-red-100 text-red-800",
    },
  ];

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast({
        title: "Xatolik",
        description: "Iltimos, yangi holatni tanlang",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.updateOrderStatus(order._id, newStatus, internalNotes);
      toast({
        title: "Muvaffaqiyat",
        description: "Buyurtma holati muvaffaqiyatli yangilandi",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Buyurtma holatini yangilashda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  const currentStatus = statusOptions.find((s) => s.value === order.status);

  function formatPrice(price) {
    return price.toLocaleString();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Buyurtma #{order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            Buyurtma tafsilotlari va holatini boshqarish
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Joriy holat</p>
              <Badge className={currentStatus?.color}>
                {currentStatus?.label}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Yaratilgan sana</p>
              <p className="text-sm font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Mijoz ma'lumotlari
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
                <div className="mt-3 pt-3 border-t">
                  <p className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{order.customer.address}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items with Products */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Buyurtma mahsulotlari ({order.products?.length || 0})
            </h3>
            <div className="space-y-3">
              {order?.products?.map((product, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-700">
                      Mahsulot #{index + 1}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {product ? (
                      <div className="flex gap-4">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title_uz}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate">
                            {product.title_uz}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description_uz}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline">
                              Kategoriya: {product.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-600">
                            Narx: {formatPrice(product.price)} сум
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Miqdor: ×{product.quantity}
                          </p>
                          <p className="text-lg font-bold mt-1">
                            {formatPrice(product.price * product.quantity)} сум
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Mahsulot ma'lumoti topilmadi
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="border-t-2 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Jami summa:</span>
                  <span className="text-2xl font-bold">
                    {order.totalPrice} сум
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Holatni yangilash</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="status">Yangi holat</Label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Holatni tanlang</option>
                    {statusOptions
                      .filter((s) => s.value !== order.status)
                      .map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="notes">Ichki eslatmalar (ixtiyoriy)</Label>
                  <Textarea
                    id="notes"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Buyurtma haqida qo'shimcha ma'lumotlar..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleStatusUpdate} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Holatni yangilash
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
