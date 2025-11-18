'use client';

import { useState, useEffect } from 'react';
import instance from '@/app/services/api';
import Link from 'next/link';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart, 
    Area 
} from 'recharts';
import styles from './reports.module.css';

interface MonthlyData {
    name: string;
    users: number;
}

export default function UserReports() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<MonthlyData[]>([]
    );

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await instance.get<MonthlyData[]>('/users-report');
                setReportData(response.data);
            } catch (err) {
                console.error("Erro ao buscar dados do relatorio:", err);
                setError("Falha ao carregar dados do relatório de usuários.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    if (loading) {
        return <div className={styles.centeredMessage}>Carregando relatório...</div>;
    }

    if (error) {
        return <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>Erro: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <Link href="/" className={styles.backLink}>
                &lt;- Voltar para Home
            </Link>

            <h1 className={styles.title}>Relatório de Cadastros (Últimos 12 Meses)</h1>
            
            {reportData.length === 0 ? (
                <div className={styles.centeredMessage}>Nenhum dado de cadastro encontrado no último ano para exibir gráficos.</div>
            ) : (
                <div className={styles.graphsContainer}> 
                    
                    <div className={styles.chartCard}> 
                        <h2 className={styles.chartSubtitle}>Novos Usuários por Mês</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={reportData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end"
                                    height={60}
                                    tickFormatter={(tick: string) => tick.substring(0, 3)} 
                                    stroke="#555"
                                />
                                <YAxis 
                                    allowDecimals={false} 
                                    stroke="#555"
                                />
                                <Tooltip 
                                    formatter={(value: number) => [`${value} Usuários`, 'Cadastros']} 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                                <Bar dataKey="users" name="Novos Usuários">
                                    {reportData.map((entry, index) => (
                                        <Cell 
                                            key={`bar-cell-${index}`} 
                                            fill={entry.users > 0 ? '#007bff' : '#cccccc'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.chartCard}> 
                        <h2 className={styles.chartSubtitle}>Tendência de Cadastros</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={reportData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end"
                                    height={60}
                                    tickFormatter={(tick: string) => tick.substring(0, 3)} // Ex: Jan, Fev
                                    stroke="#555"
                                />
                                <YAxis 
                                    allowDecimals={false} 
                                    stroke="#555"
                                />
                                <Tooltip 
                                    formatter={(value: number) => [`${value} Usuários`, 'Cadastros']} 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#8884d8" 
                                    fillOpacity={0.8} 
                                    fill="url(#colorUv)" 
                                    name="Cadastros"
                                />
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            )}
            
            <p className={styles.footerNote}>
                Os gráficos mostram o total de novos usuários cadastrados em cada um dos últimos 12 meses,
                apresentando a contagem exata por barra e a tendência geral por área.
            </p>
        </div>
    );
}