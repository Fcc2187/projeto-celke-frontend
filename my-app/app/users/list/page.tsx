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
            console.error("Erro ao buscar usuários:", error);
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
        return <div className={styles.errorMessage}>Erro: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Lista de Usuários</h1>
                <Link href="/users/create" className={styles.createLink}>
                    Cadastrar
                </Link>
            </div>

            <ul className={styles.list}>
                {users.map(user => (
                    <li key={user.id} className={styles.listItem}>
                        <div>
                            <div className={styles.userName}>{user.name}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                            <Link href={`/users/${user.id}`}className={styles.detailsLink}>Ver Detalhes</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}