import { Button } from "@/components/ui/button";

const FilterItem = ({ children }) => {
  return children;
};

function FilterBase({ children, resetQueryParams }) {
  return (
    <div className="flex gap-4 items-center">
      {children}
      <Button
        onClick={() => resetQueryParams()}
        className={`flex items-center gap-1 bg-gray-600 hover:bg-gray-500`}
      >
        filterni tozalash
      </Button>
    </div>
  );
}

export const Filter = Object.assign(FilterBase, {
  Item: FilterItem,
});
