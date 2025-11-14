'use client'

import Link from "next/link"
import React from "react"
import { useState } from "react"
import instance from "@/app/services/api";
import styles from './create.module.css';

export default function CreateUserPage() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await instance.post('/users', {
                name,
                email,
            });

            console.log(response.data);
            alert("Usuário criado com sucesso!");
            setName('');
            setEmail('');

        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            alert("Erro ao criar usuário.");
        }
    }
    
    return (
        <div className={styles.pageContainer}> 
            <Link href={"/users/list"} className={styles.backLink}>
                &larr; Voltar para a lista
            </Link>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Criar Novo Usuário</h1>
                
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Nome:</label>
                    <input 
                        id="name"
                        type="text" 
                        value={name || ''}
                        placeholder="Nome do Usuario"
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input} 
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input 
                        id="email"
                        type="email" 
                        value={email || ''}
                        placeholder="Email do usuario"
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input} 
                    />
                </div>
                
                <button type="submit" className={styles.submitButton}>
                    Criar Usuário
                </button>     
            </form>
        </div>
    );
}