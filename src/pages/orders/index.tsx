import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Filter } from "@/shared/ui/Filter";
import { useToast } from "@/shared/lib/useToast";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { orderApi } from "@/entities/order/api/orderApi";
import { OrderCard } from "@/entities/order/ui/OrderCard";
import { OrderDialog } from "@/features/order-manage/ui/OrderDialog";
import { Package, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderEntity } from "@/entities/order/model/types";

const OrdersSkeleton = () => (
  <div className="space-y-4">
    {[1,2,3,4,5].map((i) => (
      <Card key={i} className="animate-pulse"><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/4" /><div className="h-3 bg-gray-200 rounded w-1/3" /></div></Card>
    ))}
  </div>
);

export const OrdersPage = () => {
  const { queryParams, updateQueryParams, resetQueryParams } = useQueryParams({ status: "in_process" });
  const { t } = useTranslation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<OrderEntity | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = { ...queryParams };
    orderApi.getAll(params)
      .then((r) => setOrders(r.data.data?.orders ?? []))
      .catch((err) => { toast({ title: t("common.error"), description: err.response?.data?.message ?? t("orders.loadError"), variant: "destructive" }); setOrders([]); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [queryParams]); // eslint-disable-line

  const statusOptions = [
    { value: "in_process", label: t("orders.statusOptions.in_process") },
    { value: "delivered",  label: t("orders.statusOptions.delivered") },
    { value: "cancelled",  label: t("orders.statusOptions.cancelled") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">{t("orders.title")}</h1><p className="text-muted-foreground">{t("orders.manage")}</p></div>
      </div>
      <Filter resetQueryParams={resetQueryParams}>
        <Filter.Item>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder={t("orders.searchPlaceholder")} value={queryParams.search ?? ""} onChange={(e) => updateQueryParams({ search: e.target.value })} className="pl-10" />
          </div>
        </Filter.Item>
        <Filter.Item>
          <select value={queryParams.status ?? "in_process"} onChange={(e) => updateQueryParams({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Filter.Item>
      </Filter>
      {loading ? <OrdersSkeleton /> : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((o) => <OrderCard key={o._id} order={o} onView={(order) => { setSelected(order); setShowDialog(true); }} />)}
        </div>
      ) : (
        <Card><CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("orders.notFound")}</h3>
          <p className="text-gray-500 text-center">{t("orders.noOrdersYet")}</p>
        </CardContent></Card>
      )}
      <OrderDialog open={showDialog} onOpenChange={setShowDialog} order={selected} onSuccess={fetchOrders} />
    </div>
  );
};
