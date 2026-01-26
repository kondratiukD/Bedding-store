import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  console.log('BEDDING STORE RUNNING ✅');
  return (
    <div className="App">
      <h1 hidden>Portal</h1>
      <Header />

      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};