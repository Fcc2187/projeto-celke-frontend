'use client'

// 1. Importar o hook useParams
import { useEffect, useState } from "react"
import { useParams } from "next/navigation" 
import instance from "@/app/services/api";
import Link from "next/link";
import styles from './details.module.css';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Remover 'params' das props da funcao
export default function UserDetails() {
    
    // 3. Chamar o hook para pegar os parametros
    const params = useParams();

    const [user, setUser] = useState<User | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        // 4. Pegar o ID do hook. 
        // Ele pode ser uma string ou um array, entao tratamos isso.
        let userId: string | undefined = undefined;

        if (Array.isArray(params.id)) {
            userId = params.id[0];
        } else {
            userId = params.id;
        }

        const fetchUserDetails = async (id: string) => {
            try {
                const response = await instance.get(`/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do usuario:", error);
                setError("Falha ao buscar detalhes do usuario.");
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchUserDetails(userId);
        } else {
            setError("ID do usuario nao fornecido.");
            setLoading(false);
        }

        // 5. Agora podemos depender de 'params.id' com seguranca
    }, [params.id]); 

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('pt-BR');
    }

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.centeredMessage}>Carregando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <Link href="/users/list" className={styles.backLink}>
                    &lt;- Voltar para a lista
                </Link>
                <div className={styles.errorMessage}>{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.pageContainer}>
                <Link href="/users/list" className={styles.backLink}>
                    &lt;- Voltar para a lista
                </Link>
                <div className={styles.centeredMessage}>Usuario nao encontrado.</div>
            </div>
        )
    }

    return (
        <div className={styles.pageContainer}>
            <Link href="/users/list" className={styles.backLink}>
                &lt;- Voltar para a lista
            </Link>

            <h1 className={styles.title}>Detalhes do Usuario</h1>
            
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