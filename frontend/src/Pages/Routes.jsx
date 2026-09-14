import { Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import Client from "./Client";
import Dashboard from "./Dashboard";
import ProtectedRoute from "../Config/ProtectedRoutes";
const Index = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Client />} />
        // Routes file mein:
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        <Route path="/auth/*" element={<Auth />} />
      </Routes>
    </>
  );
};

export default Index;
