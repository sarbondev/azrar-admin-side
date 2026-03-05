import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, MapPin, Package, Phone, User } from "lucide-react";

export const OrderCard = ({ setSelectedOrder, order, setShowOrderDialog }) => {
  const getStatusText = (status) => {
    const statusMap = {
      in_process: "Jarayonda",
      delivered: "Yetkazilgan",
      cancelled: "Bekor qilingan",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      in_process: "bg-blue-100 text-blue-800 border-blue-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {order.products?.length || 0} ta mahsulot
              </span>
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewOrder(order)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ko'rish
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">
              Mijoz ma'lumotlari:
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {order.customer?.fullName}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {order.customer?.phoneNumber}
              </p>
              {order.customer?.address && (
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {order.customer.address}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">
              Buyurtma ma'lumotlari:
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Jami summa:{" "}
                <span className="font-medium">{order.totalPrice} UZS</span>
              </p>
              <p>
                Mahsulotlar soni:{" "}
                <span className="font-medium">
                  {order.products?.length || 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
