'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation" 
import instance from "@/app/services/api";
import Link from "next/link";
import styles from './details.module.css';
import jsPDF from "jspdf"; // Certifique-se de que instalou: npm install jspdf

interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function UserDetails() {
    
    const params = useParams();

    const [user, setUser] = useState<User | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(true);

    // Função auxiliar para formatar data (reutilizada no PDF)
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('pt-BR');
    }

    const generatePDF = () => {
        if (!user) return;

        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Detalhes do Usuário", 105, 20, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        let yPos = 40; // Posição vertical inicial
        const lineHeight = 10; // Espaço entre linhas

        const addLine = (label: string, value: string) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, 20, yPos);
            
            doc.setFont("helvetica", "normal");
            doc.text(value, 60, yPos); 
            
            yPos += lineHeight;
        };

        addLine("ID", user.id.toString());
        addLine("Nome", user.name);
        addLine("Email", user.email);
        addLine("Criado em", formatDate(user.createdAt));
        addLine("Atualizado em", formatDate(user.updatedAt));

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Gerado pelo Sistema de Gestão de Usuários", 105, 280, { align: "center" });

        doc.save(`usuario_${user.name.replace(/\s+/g, '_')}.pdf`);
    }

    useEffect(() => {
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

    }, [params.id]); 

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
            <div className={styles.headerActions}>
                <Link href="/users/list" className={styles.backLink}>
                    &lt;- Voltar para a lista
                </Link>
                
                <button onClick={generatePDF} className={styles.pdfButton}>
                    Baixar PDF
                </button>
            </div>

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