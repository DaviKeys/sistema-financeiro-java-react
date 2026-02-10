import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoPizza = ({ receitas, despesas }) => {
    const dados = [
        { name: 'Receitas', value: receitas },
        { name: 'Despesas', value: despesas },
    ];

    const CORES = ['#28a745', '#dc3545'];

    // Função para desenhar a % dentro da fatia
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        // Calcula a posição exata (raio) para colocar o texto no meio da fatia
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Só mostra se for maior que 0% para não poluir
        if (percent === 0) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontWeight: 'bold', fontSize: '14px' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div style={{ width: '100%', height: 300, background: 'white', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Receitas vs Despesas</h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={dados}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={renderCustomizedLabel} // <--- AQUI ESTÁ A MÁGICA
                        labelLine={false} // Tira a linhazinha puxando pra fora
                    >
                        {dados.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES[index]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoPizza;