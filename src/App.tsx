import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Step1 } from './pages/Step1/Step1';
import { Step2 } from './pages/Step2/Step2';
import { Results } from './pages/Results/Results';
import { History } from './pages/History/History';

function App() {
  return (
    <BrowserRouter>
      <main>
        <header>
          <h1>Prima Recipe App</h1>
        </header>

        <Routes>
          <Route path="/" element={<Step1 />} />
          <Route path="/step-2" element={<Step2 />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;