import type { ReactNode } from "react";
import { Button } from "./button";
import { useTranslation } from "react-i18next";

const FilterItem = ({ children }: { children: ReactNode }) => <>{children}</>;

const FilterBase = ({ children, resetQueryParams }: { children: ReactNode; resetQueryParams: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 items-center flex-wrap">
      {children}
      <Button onClick={resetQueryParams} className="bg-gray-600 hover:bg-gray-500">
        {t("common.clearFilter")}
      </Button>
    </div>
  );
};

export const Filter = Object.assign(FilterBase, { Item: FilterItem });
