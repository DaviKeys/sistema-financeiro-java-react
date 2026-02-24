import { Card, Text, Group, Grid, TextInput, Select, Button } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';

function FormularioTransacao({
                                 descricao, setDescricao,
                                 tipo, setTipo,
                                 valor, setValor,
                                 data, setData,
                                 categoria, setCategoria,
                                 idEditando,
                                 chaveReset,
                                 listaCategorias,
                                 renderizarOpcaoCategoria,
                                 salvarTransacao,
                                 limparFormulario
                             }) {
    return (
        <Card padding="lg" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
                <Text fw={600}>{idEditando ? 'Editar Transação' : 'Nova Transação'}</Text>
            </Group>

            <Grid>
                <Grid.Col span={{ base: 12, sm: 8 }}>
                    <TextInput label="Descrição" placeholder="Ex: Aluguel" value={descricao} onChange={(e) => setDescricao(e.currentTarget.value)} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                        key={`tipo-${chaveReset}`}
                        label="Tipo"
                        placeholder="Selecione..."
                        data={['RECEITA', 'DESPESA']}
                        value={tipo}
                        onChange={setTipo}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput label="Valor" placeholder="0,00" value={valor} onChange={(e) => setValor(e.currentTarget.value)} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput label="Data" type="date" value={data} onChange={(e) => setData(e.currentTarget.value)} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                        key={`cat-${chaveReset}`}
                        label="Categoria"
                        placeholder="Selecione..."
                        data={listaCategorias}
                        value={categoria}
                        onChange={setCategoria}
                        searchable
                        nothingFoundMessage="Nada encontrado..."
                        renderOption={renderizarOpcaoCategoria}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group justify="flex-end" mt="xs">
                        {idEditando && <Button variant="subtle" color="gray" onClick={limparFormulario} fullWidth={{ base: true, sm: false }}>Cancelar</Button>}
                        <Button onClick={salvarTransacao} color={idEditando ? 'orange' : 'blue'} leftSection={idEditando ? <IconPencil size={16}/> : <IconPlus size={16} />} fullWidth={{ base: true, sm: false }}>
                            {idEditando ? 'Atualizar' : 'Adicionar'}
                        </Button>
                    </Group>
                </Grid.Col>
            </Grid>
        </Card>
    );
}

export default FormularioTransacao;