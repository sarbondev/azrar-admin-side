import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { productApi } from "@/entities/product/api/productApi";
import { orderApi } from "@/entities/order/api/orderApi";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderEntity } from "@/entities/order/model/types";
import api from "@/shared/api/axiosInstance";

interface Stats { totalProducts: number; totalOrders: number; totalAdmins: number; recentOrders: OrderEntity[]; }
const empty: Stats = { totalProducts: 0, totalOrders: 0, totalAdmins: 0, recentOrders: [] };

const STATUS_COLOR: Record<string, string> = {
  in_process: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.getAll({ limit: "1" }),
      orderApi.getAll(),
      api.get<{ success: boolean; data: { admins: unknown[]; total: number } }>("/admin"),
    ])
      .then(([prodRes, ordRes, admRes]) => {
        setStats({
          totalProducts: prodRes.data.data?.total ?? 0,
          totalOrders: ordRes.data.data?.total ?? (ordRes.data.data?.orders?.length ?? 0),
          totalAdmins: admRes.data.data?.total ?? (admRes.data.data?.admins?.length ?? 0),
          recentOrders: ordRes.data.data?.orders?.slice(0, 5) ?? [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: t("dashboard.totalProducts"), value: stats.totalProducts, icon: Package, desc: t("dashboard.totalProductsDesc") },
    { title: t("dashboard.totalOrders"), value: stats.totalOrders, icon: ShoppingCart, desc: t("dashboard.totalOrdersDesc") },
    { title: t("dashboard.adminsCount"), value: stats.totalAdmins, icon: Users, desc: t("dashboard.adminsCountDesc") },
    { title: t("dashboard.activeOrders"), value: stats.recentOrders.filter((o) => o.status === "in_process").length, icon: TrendingUp, desc: t("dashboard.activeOrdersDesc") },
  ];

  if (loading) return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <Card key={i}><CardHeader className="animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-8 bg-gray-200 rounded w-1/2 mt-2" /></CardHeader></Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
            <CardDescription>{t("dashboard.recentOrdersDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                    {t(`dashboard.status.${order.status}`, order.status)}
                  </span>
                </div>
              )) : <p className="text-center text-muted-foreground py-8">{t("dashboard.noOrders")}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            <CardDescription>{t("dashboard.quickActionsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: t("dashboard.addNewProduct"), desc: t("dashboard.addNewProductDesc") },
              { label: t("dashboard.viewOrders"), desc: t("dashboard.viewOrdersDesc") },
              { label: t("dashboard.getReport"), desc: t("dashboard.getReportDesc") },
            ].map((item, i) => (
              <button key={i} className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
