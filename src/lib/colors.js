export const COLORS_WITH_LANGS = [
  { uz: "Oq", ru: "Белый", code: "#FFFFFF" },
  { uz: "Qora", ru: "Черный", code: "#000000" },
  { uz: "Qizil", ru: "Красный", code: "#EF4444" },
  { uz: "Ko'k", ru: "Синий", code: "#3B82F6" },
  { uz: "Yashil", ru: "Зелёный", code: "#22C55E" },
  { uz: "Sariq", ru: "Жёлтый", code: "#EAB308" },
  { uz: "Bog'ador", ru: "Фиолетовый", code: "#A855F7" },
  { uz: "Pushti", ru: "Розовый", code: "#EC4899" },
  { uz: "Oltin", ru: "Золотистый", code: "#F59E0B" },
  { uz: "Cambric", ru: "Голубой", code: "#06B6D4" },
  { uz: "Kulrang", ru: "Серый", code: "#6B7280" },
  { uz: "Jigarrang", ru: "Коричневый", code: "#8B4513" },
];

export const getColorCode = (colorName) => {
  const color = COLORS_WITH_LANGS.find(
    (c) => c.uz === colorName || c.ru === colorName,
  );
  return color ? color.code : "#CCCCCC";
};

export const getColorRussian = (colorNameUz) => {
  const color = COLORS_WITH_LANGS.find((c) => c.uz === colorNameUz);
  return color ? color.ru : colorNameUz;
};
