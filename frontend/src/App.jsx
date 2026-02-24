import { useEffect, useState } from 'react';
import { Container, Grid, Card, Text, Group, Button, TextInput, Select, MultiSelect, Table, Title, ActionIcon, Center, Stack, ThemeIcon, Tooltip, Box } from '@mantine/core';
import {
    IconTrash, IconPencil, IconPlus, IconWallet, IconArrowUpRight, IconArrowDownRight, IconMoodEmpty, IconFilter,
    IconTrendingUp, IconList, IconToolsKitchen2, IconReceipt, IconCar, IconShoppingBag, IconBasket,
    IconBuildingBank, IconFirstAidKit, IconReceiptTax, IconPlane, IconBriefcase, IconSchool,
    IconHanger, IconDeviceTv, IconTicket, IconDeviceDesktop, IconBallFootball, IconUsers,
    IconPaw, IconHome, IconHeartHandshake, IconFileDescription, IconChartLine, IconDice5, IconDots,
    IconApps, IconLogout, IconFilterOff, IconFileDownload, IconCheck, IconX, IconAlertCircle
} from '@tabler/icons-react';

import { notifications } from '@mantine/notifications';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import GraficoPizza from './GraficoPizza';
import ThemeToggle from './ThemeToggle';
import Login from './Login';

function App() {
    const authSalva = localStorage.getItem('isAutenticado') === 'true';
    const usuarioSalvo = localStorage.getItem('usuarioLogado') || '';
    const idSalvo = localStorage.getItem('idUsuarioLogado') || null;
    const tokenSalvo = localStorage.getItem('tokenJWT') || '';

    const [isAutenticado, setIsAutenticado] = useState(authSalva);
    const [usuarioLogado, setUsuarioLogado] = useState(usuarioSalvo);
    const [idUsuarioLogado, setIdUsuarioLogado] = useState(idSalvo);
    const [token, setToken] = useState(tokenSalvo);

    const [transacoes, setTransacoes] = useState([]);

    const [mesFiltro, setMesFiltro] = useState(null);
    const [anoFiltro, setAnoFiltro] = useState(null);
    const [categoriasFiltro, setCategoriasFiltro] = useState([]);

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [data, setData] = useState('');
    const [idEditando, setIdEditando] = useState(null);

    // 🔥 CHAVE DE RESET PARA FORÇAR A TELA A LIMPAR AS CAIXINHAS
    const [chaveReset, setChaveReset] = useState(0);

    const hoje = new Date();
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(hoje);

    const listaCategorias = [
        'Renda', 'Pendente de categoria', 'Comida e bebida', 'Contas e serviços', 'Transporte',
        'Compras', 'Supermercado', 'Empréstimos', 'Saúde e cuidados pessoais', 'Taxas',
        'Viagens', 'Serviços profissionais', 'Educação', 'Roupas', 'Assinaturas digitais',
        'Entretenimento', 'Eletrônicos', 'Esportes', 'Amizades e família', 'Animais de estimação',
        'Casa', 'Doações', 'Impostos', 'Investimentos', 'Jogos de azar', 'Outros'
    ];

    const listaCategoriasFiltro = ['Todas as categorias', ...listaCategorias];

    const corBadgeCategoria = {
        'Todas as categorias': 'dark',
        'Renda': 'green', 'Pendente de categoria': 'gray', 'Comida e bebida': 'red', 'Contas e serviços': 'pink',
        'Transporte': 'blue', 'Compras': 'grape', 'Supermercado': 'green', 'Empréstimos': 'orange',
        'Saúde e cuidados pessoais': 'teal', 'Taxas': 'violet', 'Viagens': 'indigo', 'Serviços profissionais': 'gray',
        'Educação': 'cyan', 'Roupas': 'pink', 'Assinaturas digitais': 'blue', 'Entretenimento': 'yellow',
        'Eletrônicos': 'cyan', 'Esportes': 'orange', 'Amizades e família': 'red', 'Animais de estimação': 'lime',
        'Casa': 'yellow', 'Doações': 'teal', 'Impostos': 'red', 'Investimentos': 'green', 'Jogos de azar': 'violet', 'Outros': 'gray'
    };

    const iconePorCategoria = {
        'Todas as categorias': IconApps,
        'Renda': IconTrendingUp, 'Pendente de categoria': IconList, 'Comida e bebida': IconToolsKitchen2,
        'Contas e serviços': IconReceipt, 'Transporte': IconCar, 'Compras': IconShoppingBag,
        'Supermercado': IconBasket, 'Empréstimos': IconBuildingBank, 'Saúde e cuidados pessoais': IconFirstAidKit,
        'Taxas': IconReceiptTax, 'Viagens': IconPlane, 'Serviços profissionais': IconBriefcase,
        'Educação': IconSchool, 'Roupas': IconHanger, 'Assinaturas digitais': IconDeviceTv,
        'Entretenimento': IconTicket, 'Eletrônicos': IconDeviceDesktop, 'Esportes': IconBallFootball,
        'Amizades e família': IconUsers, 'Animais de estimação': IconPaw, 'Casa': IconHome,
        'Doações': IconHeartHandshake, 'Impostos': IconFileDescription, 'Investimentos': IconChartLine,
        'Jogos de azar': IconDice5, 'Outros': IconDots
    };

    const listaAnos = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

    useEffect(() => {
        if (idUsuarioLogado && token) {
            carregarDados();
        }
    }, [idUsuarioLogado, token]);

    const formatarBRL = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    const carregarDados = async () => {
        if (!idUsuarioLogado || idUsuarioLogado === 'undefined') return;

        try {
            const resp = await fetch(`http://localhost:8080/transacoes/usuario/${idUsuarioLogado}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resp.ok) {
                const dados = await resp.json();
                setTransacoes(Array.isArray(dados) ? dados : []);
            } else {
                setTransacoes([]);
            }
        } catch (erro) {
            console.error("Erro:", erro);
            setTransacoes([]);
        }
    };

    const listaSegura = Array.isArray(transacoes) ? transacoes : [];

    const transacoesFiltradas = (!mesFiltro || !anoFiltro) ? [] : listaSegura.filter((t) => {
        if (!t.data) return false;
        const [ano, mes] = t.data.split('-');

        const matchMes = parseInt(mes) === parseInt(mesFiltro);
        const matchAno = parseInt(ano) === parseInt(anoFiltro);

        const matchCategoria =
            categoriasFiltro.length === 0 ||
            categoriasFiltro.includes('Todas as categorias') ||
            categoriasFiltro.includes(t.categoria);

        return matchMes && matchAno && matchCategoria;
    });

    const totalReceitas = transacoesFiltradas.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + t.valor, 0);
    const totalDespesas = transacoesFiltradas.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + t.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    const despesasAgrupadas = transacoesFiltradas
        .filter(t => t.tipo === 'DESPESA')
        .reduce((acumulador, transacao) => {
            acumulador[transacao.categoria] = (acumulador[transacao.categoria] || 0) + transacao.valor;
            return acumulador;
        }, {});

    const labelsGrafico = Object.keys(despesasAgrupadas);
    const valoresGrafico = Object.values(despesasAgrupadas);

    const gerarRelatorioPDF = () => {
        if (transacoesFiltradas.length === 0) {
            return notifications.show({
                title: 'Aviso',
                message: 'Não há transações neste período para gerar o relatório.',
                color: 'blue',
                icon: <IconAlertCircle size={18} />
            });
        }

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Relatório Financeiro", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Usuário: ${usuarioLogado}`, 14, 30);
        doc.text(`Período: Mês ${mesFiltro} de ${anoFiltro}`, 14, 36);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 42);

        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(`Receitas Totais: ${formatarBRL(totalReceitas)}`, 14, 55);
        doc.text(`Despesas Totais: ${formatarBRL(totalDespesas)}`, 14, 62);
        doc.text(`Saldo do Período: ${formatarBRL(saldo)}`, 14, 69);

        const colunasDaTabela = [["Data", "Descrição", "Categoria", "Tipo", "Valor"]];
        const linhasDaTabela = transacoesFiltradas.map((t) => [
            new Date(t.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
            t.descricao,
            t.categoria,
            t.tipo === 'RECEITA' ? 'Receita (+)' : 'Despesa (-)',
            formatarBRL(t.valor)
        ]);

        autoTable(doc, {
            startY: 78,
            head: colunasDaTabela,
            body: linhasDaTabela,
            theme: 'striped',
            headStyles: { fillColor: [76, 110, 245] },
            styles: { fontSize: 10 },
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index === 4) {
                    const tipo = transacoesFiltradas[data.row.index].tipo;
                    if (tipo === 'RECEITA') {
                        data.cell.styles.textColor = [43, 138, 62];
                    } else {
                        data.cell.styles.textColor = [224, 49, 49];
                    }
                }
            }
        });

        doc.save(`Relatorio_Financeiro_${mesFiltro}_${anoFiltro}.pdf`);

        notifications.show({
            title: 'Sucesso',
            message: 'O seu relatório PDF foi baixado.',
            color: 'teal',
            icon: <IconFileDownload size={18} />
        });
    };

    const salvarTransacao = async () => {
        const desc = descricao ? String(descricao).trim() : '';
        const val = valor ? String(valor).trim() : '';

        const camposVazios = [];
        if (!desc) camposVazios.push("Descrição");
        if (!val) camposVazios.push("Valor");
        if (!data) camposVazios.push("Data");
        if (!categoria) camposVazios.push("Categoria");
        if (!tipo) camposVazios.push("Tipo");

        if (camposVazios.length > 0) {
            return notifications.show({
                title: 'Campos obrigatórios',
                message: `Por favor, preencha: ${camposVazios.join(', ')}.`,
                color: 'yellow',
                icon: <IconAlertCircle size={18} />
            });
        }

        const valorFormatado = parseFloat(val.replace(/\./g, '').replace(',', '.'));

        const body = {
            descricao: desc,
            valor: valorFormatado,
            tipo,
            categoria,
            data
        };

        const method = idEditando ? 'PUT' : 'POST';
        const url = idEditando ? `http://localhost:8080/transacoes/${idEditando}` : `http://localhost:8080/transacoes/usuario/${idUsuarioLogado}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const erroBackend = await response.text();
                return notifications.show({
                    title: 'Erro do Servidor',
                    message: erroBackend,
                    color: 'red',
                    icon: <IconX size={18} />
                });
            }

            const [anoAdd, mesAdd] = data.split('-');
            setMesFiltro(parseInt(mesAdd).toString());
            setAnoFiltro(anoAdd);

            notifications.show({
                title: 'Sucesso!',
                message: idEditando ? 'Transação atualizada com sucesso.' : 'Transação salva com sucesso.',
                color: 'green',
                icon: <IconCheck size={18} />
            });

            limparFormulario();
            carregarDados();

        } catch (erro) {
            console.error(erro);
            notifications.show({
                title: 'Erro de conexão',
                message: 'Verifique se o servidor Java está rodando.',
                color: 'red',
                icon: <IconX size={18} />
            });
        }
    };

    const removerTransacao = async (id) => {
        if (confirm("Tem certeza que deseja excluir esta transação?")) {
            await fetch(`http://localhost:8080/transacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            carregarDados();

            notifications.show({
                title: 'Excluído',
                message: 'A transação foi removida.',
                color: 'orange',
                icon: <IconTrash size={18} />
            });
        }
    };

    const editarTransacao = (t) => {
        setDescricao(t.descricao); setValor(t.valor.toString().replace('.', ',')); setTipo(t.tipo); setCategoria(t.categoria); setData(t.data); setIdEditando(t.id);
    };

    const limparFormulario = () => {
        setDescricao(''); setValor(''); setCategoria(null); setData(''); setTipo(null); setIdEditando(null);
        setChaveReset(valorAtual => valorAtual + 1); // 🔥 GIRA A CHAVE PARA RECRIAR O VISUAL DOS SELECTS
    };

    const limparFiltros = () => {
        setMesFiltro(null);
        setAnoFiltro(null);
        setCategoriasFiltro([]);
    };

    const renderizarOpcaoCategoria = ({ option }) => {
        const Icone = iconePorCategoria[option.value] || IconDots;
        const cor = corBadgeCategoria[option.value] || 'gray';
        return (
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color={cor} variant="filled" radius="xl" size="sm" style={{ flexShrink: 0 }}>
                    <Icone size={14} />
                </ThemeIcon>
                <Text size="sm">{option.label}</Text>
            </Group>
        );
    };

    if (!isAutenticado) {
        return <Login onLogin={(nomeReal, idReal, tokenReal) => {
            setIsAutenticado(true);
            setUsuarioLogado(nomeReal);
            setIdUsuarioLogado(idReal);
            setToken(tokenReal);

            localStorage.setItem('isAutenticado', 'true');
            localStorage.setItem('usuarioLogado', nomeReal);
            localStorage.setItem('idUsuarioLogado', idReal);
            localStorage.setItem('tokenJWT', tokenReal);
        }} />;
    }

    const handleLogout = () => {
        setIsAutenticado(false);
        setUsuarioLogado('');
        setIdUsuarioLogado(null);
        setToken('');

        localStorage.removeItem('isAutenticado');
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('idUsuarioLogado');
        localStorage.removeItem('tokenJWT');

        setMesFiltro(null);
        setAnoFiltro(null);
        setCategoriasFiltro([]);
    };

    return (
        <>
            <Container fluid px="xl" pt="xl">
                <Group justify="space-between" mb="md" align="flex-start" wrap="nowrap">
                    <Group gap="sm" align="center" wrap="nowrap">
                        <Box w={5} h={45} bg="indigo" style={{ borderRadius: '8px' }} />
                        <Stack gap={0}>
                            <Title order={2} size="h3">
                                Olá, {usuarioLogado}
                            </Title>
                            <Text size="sm" c="dimmed" tt="capitalize" mt={-4}>
                                {dataFormatada}
                            </Text>
                        </Stack>
                    </Group>

                    <Group gap="sm" wrap="nowrap">
                        <ThemeToggle />
                        <Button
                            variant="subtle"
                            color="red"
                            onClick={handleLogout}
                            px="xs"
                            leftSection={<IconLogout size={18} />}
                        >
                            <Box display={{ base: 'none', sm: 'block' }}>Sair</Box>
                        </Button>
                    </Group>
                </Group>
            </Container>

            <Container size="xl" pb="xl">
                <Group justify="flex-end" mb="xl" gap="sm">
                    <Select
                        placeholder="Mês"
                        value={mesFiltro}
                        onChange={(valor) => {
                            setMesFiltro(valor);
                            limparFormulario();
                        }}
                        data={['1','2','3','4','5','6','7','8','9','10','11','12'].map(m => ({ value: m, label: `Mês ${m}` }))}
                        w={{ base: '100%', sm: 110 }}
                        clearable
                    />
                    <Select
                        placeholder="Ano"
                        value={anoFiltro}
                        onChange={(valor) => {
                            setAnoFiltro(valor);
                            limparFormulario();
                        }}
                        data={listaAnos}
                        w={{ base: '100%', sm: 110 }}
                        clearable
                    />

                    <MultiSelect
                        leftSection={<IconFilter size={16} />}
                        placeholder="Filtrar categorias"
                        data={listaCategoriasFiltro}
                        value={categoriasFiltro}
                        onChange={(valores) => {
                            if (valores[valores.length - 1] === 'Todas as categorias') {
                                setCategoriasFiltro(['Todas as categorias']);
                            } else if (categoriasFiltro.includes('Todas as categorias')) {
                                setCategoriasFiltro(valores.filter(v => v !== 'Todas as categorias'));
                            } else {
                                setCategoriasFiltro(valores);
                            }
                        }}
                        clearable
                        hidePickedOptions
                        w={{ base: '100%', sm: 250 }}
                        renderOption={renderizarOpcaoCategoria}
                    />

                    <Group gap="sm">
                        <Tooltip label="Limpar Filtros" withArrow position="bottom">
                            <ActionIcon variant="light" color="red" size="lg" onClick={limparFiltros} aria-label="Limpar Filtros">
                                <IconFilterOff size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Button
                            color="teal"
                            variant="light"
                            leftSection={<IconFileDownload size={18} />}
                            onClick={gerarRelatorioPDF}
                            disabled={!mesFiltro || !anoFiltro}
                        >
                            Gerar PDF
                        </Button>
                    </Group>
                </Group>

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

                <Grid mb="xl">
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Card padding="lg" radius="md" shadow="sm" withBorder h="100%" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <GraficoPizza labels={labelsGrafico} valores={valoresGrafico} />
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 7 }}>
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
                                        key={`tipo-${chaveReset}`} // 🔥 CHAVE CONECTADA AQUI
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
                                        key={`cat-${chaveReset}`} // 🔥 CHAVE CONECTADA AQUI
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
                    </Grid.Col>
                </Grid>

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
            </Container>
        </>
    );
}

export default App;