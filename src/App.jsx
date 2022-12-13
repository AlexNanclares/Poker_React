import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import GameProvider from './context/GameProvider';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <GameProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App