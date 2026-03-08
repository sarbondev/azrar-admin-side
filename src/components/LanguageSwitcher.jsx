import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => changeLanguage("uz")}
        className={`px-2 py-1 ${i18n.language === "uz" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        UZ
      </button>
      <button
        onClick={() => changeLanguage("ru")}
        className={`px-2 py-1 ${i18n.language === "ru" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
