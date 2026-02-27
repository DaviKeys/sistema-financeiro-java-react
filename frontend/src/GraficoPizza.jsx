import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Text, Stack, useMantineColorScheme, Center } from '@mantine/core';
import { IconMoodEmpty } from '@tabler/icons-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const coresCategorias = {
    'Renda': '#40C057',
    'Pendente de categoria': '#ADB5BD',
    'Comida e bebida': '#FF6B6B',
    'Contas e serviços': '#F06595',
    'Transporte': '#339AF0',
    'Compras': '#CC5DE8',
    'Supermercado': '#51CF66',
    'Empréstimos': '#FF922B',
    'Saúde e cuidados pessoais': '#20C997',
    'Taxas': '#845EF7',
    'Viagens': '#5C7CFA',
    'Serviços profissionais': '#868E96',
    'Educação': '#22B8CF',
    'Roupas': '#FAA2C1',
    'Assinaturas digitais': '#4DABF7',
    'Entretenimento': '#FCC419',
    'Eletrônicos': '#15AABF',
    'Esportes': '#FD7E14',
    'Amizades e família': '#E03131',
    'Animais de estimação': '#94D82D',
    'Casa': '#F59F00',
    'Doações': '#0CA678',
    'Impostos': '#C92A2A',
    'Investimentos': '#2F9E44',
    'Jogos de azar': '#6741D9',
    'Outros': '#495057'
};

function GraficoPizza({ labels, valores }) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    if (!valores || valores.length === 0) {
        return (
            <Center h="100%" w="100%">
                <Stack align="center" gap="xs">
                    <IconMoodEmpty size={40} color="gray" opacity={0.5} />
                    <Text c="dimmed" size="sm">Nenhuma despesa para exibir</Text>
                </Stack>
            </Center>
        );
    }

    const backgroundColors = labels.map(label => coresCategorias[label] || '#868E96');

    const data = {
        labels: labels,
        datasets: [
            {
                data: valores,
                backgroundColor: backgroundColors,
                borderColor: isDark ? '#1A1B1E' : '#FFFFFF',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: isDark ? '#C1C2C5' : '#1A1B1E',
                    font: { family: "'Inter', sans-serif", size: 12 },
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) label += ': ';
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <Stack align="center" justify="center" h="100%" w="100%">
            <Text size="md" fw={700} c={isDark ? 'white' : 'dark'} mb="sm">
                Despesas por Categoria
            </Text>
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                <Doughnut data={data} options={options} />
            </div>
        </Stack>
    );
}

export default GraficoPizza;