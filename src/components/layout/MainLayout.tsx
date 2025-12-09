import type { ReactNode } from 'react';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.appWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>
            Recipe App
        </h1>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};