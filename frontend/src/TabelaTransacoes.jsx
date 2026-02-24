import { Card, Title, Center, Stack, Text, Box, Table, Group, ThemeIcon, ActionIcon } from '@mantine/core';
import { IconMoodEmpty, IconPencil, IconTrash, IconDots } from '@tabler/icons-react';

function TabelaTransacoes({
                              transacoesFiltradas,
                              mesFiltro,
                              anoFiltro,
                              iconePorCategoria,
                              corBadgeCategoria,
                              formatarBRL,
                              editarTransacao,
                              removerTransacao
                          }) {
    return (
        <Card padding="lg" radius="md" shadow="sm" withBorder>
            <Title order={4} mb="md">Histórico de Transações</Title>

            {transacoesFiltradas.length === 0 ? (
                <Center py="xl">
                    <Stack align="center" gap="xs">
                        <IconMoodEmpty size={48} color="gray" opacity={0.5} />
                        <Text c="dimmed" ta="center">
                            {(!mesFiltro || !anoFiltro)
                                ? "Selecione um mês e ano nos filtros acima para visualizar suas finanças."
                                : "Nenhuma transação encontrada para este filtro."}
                        </Text>
                    </Stack>
                </Center>
            ) : (
                <Box style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover verticalSpacing="sm" style={{ minWidth: 600 }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Descrição</Table.Th>
                                <Table.Th>Categoria</Table.Th>
                                <Table.Th>Data</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Valor</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Ações</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {transacoesFiltradas.map((t) => {
                                const Icone = iconePorCategoria[t.categoria] || IconDots;
                                const cor = corBadgeCategoria[t.categoria] || 'gray';

                                return (
                                    <Table.Tr key={t.id}>
                                        <Table.Td fw={500}>{t.descricao}</Table.Td>

                                        <Table.Td>
                                            <Group gap="sm" wrap="nowrap">
                                                <ThemeIcon color={cor} variant="filled" radius="xl" size="md" style={{ flexShrink: 0 }}>
                                                    <Icone size={16} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>{t.categoria}</Text>
                                            </Group>
                                        </Table.Td>

                                        <Table.Td>{new Date(t.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Td>
                                        <Table.Td style={{ color: t.tipo === 'DESPESA' ? '#fa5252' : '#40c057', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            {t.tipo === 'DESPESA' ? '- ' : '+ '}{formatarBRL(t.valor)}
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap={4} justify="center" wrap="nowrap">
                                                <ActionIcon variant="subtle" color="blue" onClick={() => editarTransacao(t)}>
                                                    <IconPencil size={16} />
                                                </ActionIcon>
                                                <ActionIcon variant="subtle" color="red" onClick={() => removerTransacao(t.id)}>
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                </Box>
            )}
        </Card>
    );
}

export default TabelaTransacoes;