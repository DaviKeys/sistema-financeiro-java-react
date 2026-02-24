import { Grid, Card, Text, Group } from '@mantine/core';
import { IconWallet, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

function ResumoCards({ saldo, totalReceitas, totalDespesas, formatarBRL }) {
    return (
        <Grid mb="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Card padding="lg" radius="md" shadow="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">Saldo Atual</Text>
                        <IconWallet size={20} color="gray" />
                    </Group>
                    <Text fw={700} size="xl" c="blue">{formatarBRL(saldo)}</Text>
                </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Card padding="lg" radius="md" shadow="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">Receitas</Text>
                        <IconArrowUpRight size={20} color="green" />
                    </Group>
                    <Text fw={700} size="xl" c="green">{formatarBRL(totalReceitas)}</Text>
                </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Card padding="lg" radius="md" shadow="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">Despesas</Text>
                        <IconArrowDownRight size={20} color="red" />
                    </Group>
                    <Text fw={700} size="xl" c="red">{formatarBRL(totalDespesas)}</Text>
                </Card>
            </Grid.Col>
        </Grid>
    );
}

export default ResumoCards;