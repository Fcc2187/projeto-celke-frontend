"use client";

import instance from "@/app/services/api"; 
import { useEffect, useState } from "react";

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
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div>
            <h1>User List Page</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}