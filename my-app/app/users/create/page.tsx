'use client'

import { AxiosError } from "axios"
import Link from "next/link"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // 1. Importar o router
import instance from "@/app/services/api";
import Swal from "sweetalert2"; // 2. Importar o SweetAlert
import styles from './create.module.css';

export default function CreateUserPage() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const router = useRouter(); 

    const handleSubmit = async (e: React.FormEvent) => {
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

        try {
            await instance.post('/users', {
                name,
                email,
            });

            await Swal.fire({
                title: 'Sucesso!',
                text: 'Usuario criado com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            router.push('/users/list');

        } catch (error) {
            console.error("Erro ao criar usuario:", error);
            
            let errorMessage = "Erro ao criar usuario."; 

            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            
            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
    setIsSubmitting(false);
    }
    
    return (
        <div className={styles.pageContainer}> 
            <Link href={"/users/list"} className={styles.backLink}>
                &larr; Voltar para a lista
            </Link>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Criar Novo Usuario</h1>
                
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Nome:</label>
                    <input 
                        id="name"
                        type="text" 
                        value={name || ''}
                        placeholder="Nome do Usuario"
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input} 
                        disabled={isSubmitting} // Desabilita enquanto envia
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
                        disabled={isSubmitting} 
                        
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={styles.submitButton} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Criando...' : 'Criar Usuario'}
                </button>   
            </form>
        </div>
    );
}