import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthContext";
import { Toaster } from "@/shared/ui/toaster";
import { router } from "@/app/router";
import "@/shared/i18n";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <Toaster />
  </AuthProvider>,
);
