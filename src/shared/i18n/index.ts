import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import { LANG_KEY } from "@/shared/config/constants";

const savedLang = localStorage.getItem(LANG_KEY) ?? "uz";

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
  },
  lng: savedLang,
  fallbackLng: "uz",
  interpolation: { escapeValue: false },
});

export default i18n;
