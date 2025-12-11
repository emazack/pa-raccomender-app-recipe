import React from 'react';
import styles from './Autocomplete.module.scss';

export interface AutocompleteOption {
  id: string;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value: string;
  onChange: (newValue: string) => void;
  onSelect?: (option: AutocompleteOption) => void; 
  placeholder?: string;
  isLoading?: boolean;
}

export const Autocomplete = ({ 
  options, 
  value, 
  onChange,
  placeholder = "Search...",
  isLoading = false
}: AutocompleteProps) => {
  
  const listId = "autocomplete-options";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isLoading}
        list={listId}
      />

      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.id} value={option.label} />
        ))}
      </datalist>
    </div>
  );
};