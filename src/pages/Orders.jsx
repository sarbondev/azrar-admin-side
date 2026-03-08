import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import { Package } from "lucide-react";
import { useQueryParams } from "../hooks/use-query-params";
import { Filter } from "../components/Filter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { OrderDialog } from "../components/orderComponents/OrderDialog";
import { OrdersSkeleton } from "../components/orderComponents/OrderSkeleton";
import { OrderList } from "../components/orderComponents/OrderList";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams({
    status: "in_process",
  });
  const { t } = useTranslation();

  const statusOptions = [
    { value: "in_process", label: t("orders.statusOptions.in_process") },
    { value: "delivered", label: t("orders.statusOptions.delivered") },
    { value: "cancelled", label: t("orders.statusOptions.cancelled") },
  ];

  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const params = { ...queryParams };
      if (params.orderNumber && !params.search) {
        params.search = params.orderNumber;
        delete params.orderNumber;
      }

      const response = await apiService.getOrders(params);
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        setOrders(responseData.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("orders.loadError"),
        variant: "destructive",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [queryParams, showOrderDialog]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("orders.title")}
          </h1>
          <p className="text-muted-foreground">{t("orders.manage")}</p>
        </div>
      </div>

      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("orders.searchPlaceholder")}
              value={queryParams.orderNumber || ""}
              onChange={(e) =>
                updateQueryParams({ orderNumber: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </Filter.Item>
        <Filter.Item>
          <select
            value={queryParams.status || ""}
            onChange={(e) => updateQueryParams({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions?.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Filter.Item>
      </Filter>

      {loading ? (
        <OrdersSkeleton />
      ) : orders.length > 0 ? (
        <OrderList
          orders={orders}
          setSelectedOrder={setSelectedOrder}
          setShowOrderDialog={setShowOrderDialog}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("orders.notFound")}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {t("orders.noOrdersYet")}
            </p>
          </CardContent>
        </Card>
      )}

      <OrderDialog
        open={showOrderDialog}
        onOpenChange={setShowOrderDialog}
        order={selectedOrder}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default Orders;
