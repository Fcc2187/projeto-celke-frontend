import Link from "next/link";
import styles from "./page.module.css"; 

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Seja bem vindo!</h1>
        <p className={styles.subtitle}>
          Gerencie seus usuários de forma simples, rápida e eficiente.
        </p>
        
        <Link href="/users/list" className={styles.ctaButton}>
          Ir para a lista de usuários
        </Link>

        <Link href="/reports" className={`${styles.ctaButton} ${styles.secondaryButton}`}>
          Ver Relatórios e Gráficos
        </Link>
      </div>
    </div>
  );
}