import { Route, Routes } from "react-router-dom";
import AddProduct from "./AddProduct";
import DashboardHome from "./DashboardHome";
import DashboardLayout from "./DashboardLayout";
import Orders from "./Orders";
import ManageProducts from "./ManageProducts";

const Dashboard = () => {
  return (
    <Routes>
      {/* DashboardLayout parent route hai, baki sab iske andar aayenge */}
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<ManageProducts />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;