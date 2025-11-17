"use client";

import instance from "@/app/services/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import styles from './edit.module.css';
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export default function EditUser() {
    const router = useRouter();
    const params = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        e.preventDefault();
        setIsSubmitting(true);

        if (!name || !email) {
            Swal.fire({
                title: 'Atencao',
                text: 'Nome e email sao obrigatorios.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            setIsSubmitting(false);
            return;
        }

        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        try {
            await instance.put(`/users/${id}`, { name, email });

            await Swal.fire({
                title: 'Sucesso!',
                text: 'Usuario atualizado com sucesso.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            router.push('/users/list');

        } catch (error) {
            console.error("Erro ao atualizar usuario:", error);

            let errorMessage = "Falha ao atualizar usuario. Tente novamente.";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });

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
            <Link href="/users/list" className={styles.backLink}>
                Voltar para a lista
            </Link>

            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Editar Usuario</h1>

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

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
                </button>
            </form>
        </div>
    );
}