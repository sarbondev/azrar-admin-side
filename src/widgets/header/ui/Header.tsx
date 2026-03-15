import { useState } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChangePasswordDialog } from "@/features/auth-login/ui/ChangePasswordDialog";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { admin, logout } = useAuth();
  const { t } = useTranslation();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const getInitials = (name?: string) =>
    name?.split(" ").map((w) => w[0]).join("").toUpperCase() ?? "A";

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-lg">{t("header.hello")}, {admin?.fullName.split(" ")[0]}!</h1>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(admin?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{admin?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{admin?.phoneNumber}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                  <Settings className="mr-2 h-4 w-4" /><span>{t("header.changePassword")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /><span>{t("header.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <ChangePasswordDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog} />
    </>
  );
};
