import { useTranslation } from "react-i18next";
import { LANG_KEY } from "@/shared/config/constants";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANG_KEY, lng);
  };
  return (
    <div className="flex space-x-1 rounded-md border overflow-hidden">
      {(["uz", "ru"] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => change(lng)}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            i18n.language === lng ? "bg-[#173F5F] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
