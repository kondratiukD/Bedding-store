import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <h1 hidden>Portal</h1>
      <Header user={user} />

      <main className="App__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
