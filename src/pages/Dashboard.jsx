import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiService } from "../services/api";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalAdmins: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, adminsRes] = await Promise.all([
        apiService.getProducts({ limit: 1 }),
        apiService.getOrders(),
        apiService.getAdmins(),
      ]);

      const productsData = productsRes.data;
      const ordersData = ordersRes.data;
      const adminsData = adminsRes.data;

      setStats({
        totalProducts:
          productsData?.success && productsData?.data?.total
            ? productsData.data.total
            : productsData?.success && productsData?.data?.products
              ? productsData.data.products.length
              : 0,
        totalOrders:
          ordersData?.success && ordersData?.data?.orders
            ? ordersData.data.orders.length
            : 0,
        totalAdmins:
          adminsData?.success && adminsData?.data?.admins
            ? adminsData.data.admins.length
            : 0,
        recentOrders:
          ordersData?.success && ordersData?.data?.orders
            ? ordersData.data.orders.slice(0, 5)
            : [],
      });
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalAdmins: 0,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.totalProducts'),
      value: stats.totalProducts,
      icon: Package,
      description: t('dashboard.totalProductsDesc'),
    },
    {
      title: t('dashboard.totalOrders'),
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: t('dashboard.totalOrdersDesc'),
    },
    {
      title: t('dashboard.adminsCount'),
      value: stats.totalAdmins,
      icon: Users,
      description: t('dashboard.adminsCountDesc'),
    },
    {
      title: t('dashboard.activeOrders'),
      value: stats.recentOrders.filter(
        (order) =>
          order.status === "not_contacted" || order.status === "in_process",
      ).length,
      icon: TrendingUp,
      description: t('dashboard.activeOrdersDesc'),
    },
  ];

  const getStatusText = (status) => {
    return t(`dashboard.status.${status}`, status);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      not_contacted: "bg-yellow-100 text-yellow-800",
      in_process: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('dashboard.recentOrders')}</CardTitle>
            <CardDescription>{t('dashboard.recentOrdersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('dashboard.noOrders')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>
              {t('dashboard.quickActionsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">{t('dashboard.addNewProduct')}</div>
              <div className="text-sm text-muted-foreground">
                {t('dashboard.addNewProductDesc')}
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">{t('dashboard.viewOrders')}</div>
              <div className="text-sm text-muted-foreground">
                {t('dashboard.viewOrdersDesc')}
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">{t('dashboard.getReport')}</div>
              <div className="text-sm text-muted-foreground">
                {t('dashboard.getReportDesc')}
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
