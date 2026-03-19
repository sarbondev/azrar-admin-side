import { Label } from "./label";
import { X } from "lucide-react";
import { COLORS } from "@/shared/lib/colors";
import { useTranslation } from "react-i18next";
import { colorEntity } from "@/entities/product/model/types";
import { Lang } from "@/entities/project/model/types";
import i18n from "@/shared/i18n/index";

interface Props {
  value: colorEntity[];
  onChange: (colors: colorEntity[]) => void;
}

export const ColorPicker = ({ value = [], onChange }: Props) => {
  const { t } = useTranslation();
  const lang = (i18n.language || "uz") as Lang;

  const selected = Array.isArray(value) ? value : [];

  const isSelected = (color: colorEntity) =>
    selected.some((c) => c.hexCode === color.hexCode);

  const add = (color: colorEntity) => {
    if (!isSelected(color)) onChange([...selected, color]);
  };

  const remove = (i: number) =>
    onChange(selected.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        {t("products.dialog.colors")}
      </Label>
      {/* Selected colors */}
      {selected.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            {t("products.dialog.selectedColors")}:
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((color, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm"
              >
                <div
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexCode }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {color.label[lang]}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-1 text-gray-400 hover:text-red-500 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Preset colors */}
      <div>
        <p className="text-sm text-gray-600 mb-2">
          {t("products.dialog.presetColors")}:
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.hexCode}
              type="button"
              onClick={() => add(color)}
              disabled={isSelected(color)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                isSelected(color)
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "bg-white border border-gray-200 hover:border-gray-300"
              } disabled:opacity-50`}
              title={`${color.label.uz} / ${color.label.ru}`}
            >
              <div
                className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: color.hexCode }}
              />
              <span className="text-xs text-gray-600 text-center truncate max-w-full">
                {color.label[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
