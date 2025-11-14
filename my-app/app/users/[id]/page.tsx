'use client'

import { useEffect, useState } from "react"
import instance from "@/app/services/api";
import Link from "next/link";
import styles from './details.module.css'; // 1. Importar estilos

interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function UserDetails({ params }: { params: { id: string } }) {
    
    const [user, setUser] = useState<User | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(true); // 3. Adicionar estado de loading

    useEffect(() => {
        // 4. Usar 'params.id' diretamente. É mais simples e correto.
        const userId = params.id; 

        const fetchUserDetails = async (id: string) => {
            try {
                // Não precisa setar loading(true) aqui, já começa true
                const response = await instance.get(`/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do usuário:", error);
                setError("Falha ao buscar detalhes do usuário. Verifique se o ID está correto.");
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchUserDetails(userId);
        }
    }, [params.id]); // 5. Depender de params.id

    // Função para formatar datas (opcional, mas melhora o visual)
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('pt-BR');
    }

    // 6. Renderização condicional (Loading)
    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.centeredMessage}>Carregando...</div>
            </div>
        );
    }

    // 7. Renderização condicional (Erro)
    if (error) {
        return (
            <div className={styles.pageContainer}>
                <Link href="/users/list" className={styles.backLink}>
                    &larr; Voltar para a lista
                </Link>
                <div className={styles.errorMessage}>{error}</div>
            </div>
        );
    }

    // 8. Renderização condicional (Não encontrado)
    if (!user) {
        return (
            <div className={styles.pageContainer}>
                <Link href="/users/list" className={styles.backLink}>
                    &larr; Voltar para a lista
                </Link>
                <div className={styles.centeredMessage}>Usuário não encontrado.</div>
            </div>
        )
    }

    // 9. Renderização de Sucesso
    return (
        <div className={styles.pageContainer}>
            <Link href="/users/list" className={styles.backLink}>
                &larr; Voltar para a lista
            </Link>

            <h1 className={styles.title}>Detalhes do Usuário</h1>
            
            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>ID</span>
                    <span className={styles.detailValue}>{user.id}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Nome</span>
                    <span className={styles.detailValue}>{user.name}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{user.email}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Criado em</span>
                    <span className={styles.detailValue}>{formatDate(user.createdAt)}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Atualizado em</span>
                    <span className={styles.detailValue}>{formatDate(user.updatedAt)}</span>
                </div>
            </div>
        </div>
    )
}