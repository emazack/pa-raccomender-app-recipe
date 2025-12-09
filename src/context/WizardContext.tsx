import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { UserPreferences } from '../types';

interface WizardState {
  preferences: UserPreferences;
}

const initialState: WizardState = {
  preferences: {
    area: '',
    ingredient: '',
  },
};

type WizardAction =
  | { type: 'SET_AREA'; payload: string }
  | { type: 'SET_INGREDIENT'; payload: string }
  | { type: 'RESET' };

const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'SET_AREA':
      return {
        ...state,
        preferences: { ...state.preferences, area: action.payload },
      };
    case 'SET_INGREDIENT':
      return {
        ...state,
        preferences: { ...state.preferences, ingredient: action.payload },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
} | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
};


export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};