"use client";

import instance from "@/app/services/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; 
import { useEffect, useState, FormEvent } from "react";
import styles from './edit.module.css'; 

export default function EditUser() {
    const router = useRouter(); // Para redirecionar
    const params = useParams(); // Para pegar o ID da URL

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
    
    const [formError, setFormError] =useState<string | null>(null); 
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        if (!id) {
            setError("ID do usuario nao encontrado.");
            setLoading(false);
            return;
        }

        const fetchUserDetails = async (userId: string) => {
            try {
                const response = await instance.get(`/users/${userId}`);
                const user = response.data;
                // Preencher xo formulario com os dados do usuario
                setName(user.name);
                setEmail(user.email);
            } catch (err) {
                console.error("Erro ao buscar usuario:", err);
                setError("Falha ao carregar dados do usuario.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails(id);
    }, [params.id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Impedir o recarregamento da pagina
        setIsSubmitting(true);
        setFormError(null);
        setSuccessMessage(null);

        // Validacao simples
        if (!name || !email) {
            setFormError("Nome e email sao obrigatorios.");
            setIsSubmitting(false);
            return;
        }

        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        try {
            await instance.put(`/users/${id}`, { name, email });
            
            setSuccessMessage("Usuario atualizado com sucesso! Redirecionando...");

            setTimeout(() => {
                router.push('/users/list');
            }, 2000);

        } catch (err) {
            console.error("Erro ao atualizar usuario:", err);
            setFormError("Falha ao atualizar usuario. Tente novamente.");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className={styles.centeredMessage}>Carregando dados...</div>; 
    }

    if (error) {
        return <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>Erro: {error}</div>; 
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Editar Usuario</h1>
                <Link href="/users/list" className={styles.backLink}>
                    Voltar para a lista
                </Link>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Nome</label>
                    <input 
                        type="text" 
                        id="name"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input 
                        type="email" 
                        id="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                {formError && <div className={styles.formErrorMessage}>{formError}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <button 
                    type="submit" 
                    className={styles.button} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
                </button>
            </form>
        </div>
    );
}