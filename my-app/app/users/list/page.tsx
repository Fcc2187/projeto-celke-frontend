"use client";

import instance from "@/app/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './list.module.css';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await instance.get("/users");
            setUsers(response.data);

        } catch (error) {
            console.error("Erro ao buscar usuarios:", error);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div className={styles.centeredMessage}>Carregando...</div>; 
    }

    if (error) {
        return <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>Erro: {error}</div>; 
    }

    function handleDeleteUser(userId: number) {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuario?"); 
        if (!confirmDelete) {
            return;
        }
        instance.delete(`/users/${userId}`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            }
            )
            .catch((error) => {
                console.error("Erro ao excluir usuario:", error);
                alert("Falha ao excluir usuario.");
            });
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Lista de Usuarios</h1> 
                <Link href="/users/create" className={styles.createLink}>
                    Cadastrar
                </Link>
            </div>

            <ul className={styles.list}>
                {users.length === 0 ? (
                    <div className={styles.centeredMessage}>Nenhum usuario encontrado.</div> 
                ) : (
                    users.map(user => (
                        <li key={user.id} className={styles.listItem}>
    
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user.name}</div>
                                <div className={styles.userEmail}>{user.email}</div>
                            </div>
    
                            <div className={styles.actionLinks}>
                                <Link href={`/users/${user.id}`} className={styles.detailsLink}>
                                    Ver Detalhes
                                </Link>
                                <Link href={`/users/${user.id}/edit`} className={styles.editLink}>
                                    Editar
                                </Link>
                                <button onClick={() => handleDeleteUser(user.id)} className={styles.deleteLink}>
                                    Excluir
                                </button>
                            </div>
    
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}