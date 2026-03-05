import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { COLORS_WITH_LANGS, getColorCode } from "@/lib/colors";

const ColorPicker = ({ value = [], onChange }) => {
  const [customColor, setCustomColor] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const selectedColors = Array.isArray(value) ? value : [];

  const addColor = (colorName) => {
    if (!selectedColors.includes(colorName)) {
      onChange([...selectedColors, colorName]);
    }
  };

  const removeColor = (index) => {
    onChange(selectedColors.filter((_, i) => i !== index));
  };

  const addCustomColor = () => {
    if (customColorName.trim()) {
      addColor(customColorName.trim());
      setCustomColorName("");
      setCustomColor("");
      setShowCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-3 block">Ranglar</Label>

        {/* Tanlangan ranglar */}
        {selectedColors.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tanlangan ranglar:</p>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorCode(color) }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {color}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="ml-1 text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oldindan tayyor ranglar */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Oldindan tayyor ranglar:</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {COLORS_WITH_LANGS.map((color) => (
              <button
                key={color.uz}
                type="button"
                onClick={() => addColor(color.uz)}
                disabled={selectedColors.includes(color.uz)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                  selectedColors.includes(color.uz)
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-white border border-gray-200 hover:border-gray-300"
                } disabled:opacity-50`}
                title={`${color.uz} / ${color.ru}`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-xs text-gray-600 text-center truncate max-w-full">
                  {color.uz}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom rang */}
        {!showCustom && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustom(true)}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Boshqa rang qo'shish
          </Button>
        )}

        {showCustom && (
          <div className="p-3 bg-blue-50 rounded-lg space-y-2 border border-blue-200">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="custom-color-name" className="text-xs">
                  Rang nomi
                </Label>
                <Input
                  id="custom-color-name"
                  placeholder="Masalan: Svetlo ko'k"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomColor();
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={addCustomColor}
                disabled={!customColorName.trim()}
              >
                Qo'shish
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustom(false);
                  setCustomColorName("");
                }}
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
