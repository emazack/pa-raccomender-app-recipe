import React from 'react';
import styles from './Step1.module.scss';

export const Step1 = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>Step 1: Scelta Cucina</h2>
        <p>Qui sceglieremo l'area (es. Italian)</p>
        
        <div className={styles.inputWrapper}>
          <input type="text" placeholder="Esempio di input..." />
        </div>
        
        <div className={styles.actions}>
           <button className="secondary">Indietro</button>
           <button>Avanti</button>
        </div>
      </div>
    </div>
  );
};