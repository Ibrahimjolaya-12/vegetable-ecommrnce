import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import Header from "../../Components/Header"
import Footer from "../../Components/Footer"
import Cart from "./Cart"
import Wishlist from "./Wishlist"
import Order from "./Order"
import Shop from "./Shop"
import About from "./About"
import CustomerCare from "./FooterLinks/CustomerCare"
import ClientOrders from "./MyOrders"

const Client = () => {
  return (
    <>
    <Header/>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order" element={<Order />} />
        <Route path="shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<ClientOrders />} />
        <Route path="/customer-care" element={<CustomerCare />} />
    </Routes>
    <Footer/>
    </>
  )
}

export default Client