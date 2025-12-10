import React, { useState, useEffect, useRef } from 'react';
import styles from './Autocomplete.module.scss';

export interface AutocompleteOption {
    id: string;
    label: string;
}

interface AutocompleteProps {
    options: AutocompleteOption[];
    value: string;
    onChange: (newValue: string) => void;
    onSelect: (selectedOption: AutocompleteOption) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export const Autocomplete = ({
    options,
    value,
    onChange,
    onSelect,
    placeholder = "Search...",
    isLoading = false
}: AutocompleteProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(value.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setIsOpen(true);
    };

    const handleSelectOption = (option: AutocompleteOption) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                disabled={isLoading}
            />

            {isOpen && value.length > 0 && !isLoading && (
                <ul className={styles.list}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.id}
                                className={styles.item}
                                onClick={() => handleSelectOption(option)}
                            >

                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className={styles.noResults}>No results found.</li>
                    )}
                </ul>
            )}
        </div>
    );
};