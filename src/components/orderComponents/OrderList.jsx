import { OrderCard } from "./OrderCard";

export const OrderList = ({ orders, setSelectedOrder, setShowOrderDialog }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          setSelectedOrder={setSelectedOrder}
          setShowOrderDialog={setShowOrderDialog}
        />
      ))}
    </div>
  );
};
