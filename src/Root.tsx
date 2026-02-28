import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { App } from "./App";
import { MainPage } from "./modules/MainPage";
import { OrderPage } from "./modules/OrderPage";
import { StorePage } from "./modules/StorePage";

export const Root: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="store" element={<StorePage />} />
      </Route>
    </Routes>
  </Router>
);
