import { ProductCard } from "./ProductCard";

export const ProductList = ({
  products,
  setShowProductDialog,
  setEditingProduct,
  setDeleteProduct,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          setShowProductDialog={setShowProductDialog}
          setEditingProduct={setEditingProduct}
          setDeleteProduct={setDeleteProduct}
        />
      ))}
    </div>
  );
};
