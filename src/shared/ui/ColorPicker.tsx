import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { X, Plus } from "lucide-react";
import { COLORS_WITH_LANGS, getColorCode } from "@/shared/lib/colors";
import { useTranslation } from "react-i18next";

interface Props { value: string[]; onChange: (colors: string[]) => void; }

export const ColorPicker = ({ value = [], onChange }: Props) => {
  const { t } = useTranslation();
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const selected = Array.isArray(value) ? value : [];

  const add = (name: string) => { if (!selected.includes(name)) onChange([...selected, name]); };
  const remove = (i: number) => onChange(selected.filter((_, idx) => idx !== i));
  const addCustom = () => {
    if (customName.trim()) { add(customName.trim()); setCustomName(""); setShowCustom(false); }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{t("products.dialog.colors")}</Label>
      {selected.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">{t("products.dialog.selectedColors")}:</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((color, i) => (
              <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm">
                <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: getColorCode(color) }} />
                <span className="text-sm font-medium text-gray-700">{color}</span>
                <button type="button" onClick={() => remove(i)} className="ml-1 text-gray-400 hover:text-red-500 transition"><X size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t("products.dialog.presetColors")}:</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {COLORS_WITH_LANGS.map((color) => (
            <button
              key={color.uz} type="button" onClick={() => add(color.uz)} disabled={selected.includes(color.uz)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${selected.includes(color.uz) ? "bg-blue-50 border-2 border-blue-500" : "bg-white border border-gray-200 hover:border-gray-300"} disabled:opacity-50`}
              title={`${color.uz} / ${color.ru}`}
            >
              <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.code }} />
              <span className="text-xs text-gray-600 text-center truncate max-w-full">{color.uz}</span>
            </button>
          ))}
        </div>
      </div>
      {!showCustom ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowCustom(true)} className="w-full">
          <Plus size={16} className="mr-2" />{t("products.dialog.addCustomColor")}
        </Button>
      ) : (
        <div className="p-3 bg-blue-50 rounded-lg space-y-2 border border-blue-200">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="custom-color" className="text-xs">{t("products.dialog.colorName")}</Label>
              <Input id="custom-color" placeholder="Masalan: Svetlo ko'k" value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
                className="mt-1" />
            </div>
            <Button type="button" size="sm" onClick={addCustom} disabled={!customName.trim()}>{t("common.add")}</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowCustom(false); setCustomName(""); }}>{t("common.cancel")}</Button>
          </div>
        </div>
      )}
    </div>
  );
};
