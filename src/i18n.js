import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "./locales/uz.json";
import ru from "./locales/ru.json";

const resources = {
  uz: {
    translation: uz,
  },
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "uz", // default language
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
