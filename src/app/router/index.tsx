import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/app/providers/ProtectedRoute";
import { Layout } from "@/widgets/sidebar/ui/Layout";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { ProductsPage } from "@/pages/products";
import { ProductDetailPage } from "@/pages/product-detail";
import { CategoriesPage } from "@/pages/categories";
import { OrdersPage } from "@/pages/orders";
import { ProjectsPage } from "@/pages/projects";
import { TestimonialsPage } from "@/pages/testimonials";
import { AdminsPage } from "@/pages/admins";
import { ConsultationsPage } from "@/pages/consultations";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "testimonials", element: <TestimonialsPage /> },
      { path: "consultations", element: <ConsultationsPage /> },
      { path: "admins", element: <AdminsPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <ProductDetailPage />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
