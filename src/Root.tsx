import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { App } from "./App";
import { CartProvider } from "./context/CartContext";
import { MainPage } from "./modules/MainPage";
import { OrderPage } from "./modules/OrderPage";
import { StorePage } from "./modules/StorePage";
import { CartPage } from "./modules/CartPage";
import { AboutPage } from "./modules/AboutPage";
import { ProfilePage } from "./modules/ProfilePage";

export const Root: React.FC = () => (
  <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  </CartProvider>
);
