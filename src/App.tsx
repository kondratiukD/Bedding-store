import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  return (
    <div className="App">
      <h1 hidden>Portal</h1>
      <Header user={null} />

      <main className="App__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};