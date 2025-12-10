import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { WizardProvider } from './context/WizardContext';
import App from './App';

describe('App Smoke Test', () => {
  it('renders without crashing', () => {
    render(
      <WizardProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WizardProvider>
    );
    expect(screen.getByText(/Recipe App/i)).toBeInTheDocument();
  });
});