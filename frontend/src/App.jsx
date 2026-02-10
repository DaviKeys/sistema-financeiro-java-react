import { useEffect, useState } from 'react'
import './App.css'
import GraficoPizza from './GraficoPizza';

function App() {
    const [transacoes, setTransacoes] = useState([])

    // ESTADOS DO FILTRO (Começa no mês atual)
    const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1) // Janeiro é 0, por isso +1
    const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear())

    // ESTADOS DO FORMULÁRIO
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState('')
    const [tipo, setTipo] = useState('DESPESA')
    const [categoria, setCategoria] = useState('')
    const [data, setData] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        carregarDados();
    }, [])

    const carregarDados = async () => {
        try {
            const resp = await fetch('http://localhost:8080/transacoes');
            const dados = await resp.json();
            setTransacoes(dados);
        } catch (erro) {
            console.error("Erro ao buscar dados:", erro);
        }
    }

    // --- LÓGICA DE FILTRAGEM ---
    // Filtra a lista principal baseado no Mês e Ano selecionados
    const transacoesFiltradas = transacoes.filter((t) => {
        const [ano, mes] = t.data.split('-'); // O formato é "2026-02-10"
        return parseInt(ano) === anoFiltro && parseInt(mes) === mesFiltro;
    });

    // --- CÁLCULO DO DASHBOARD (Baseado no Filtro) ---
    const totalReceitas = transacoesFiltradas
        .filter(t => t.tipo === 'RECEITA')
        .reduce((acc, t) => acc + t.valor, 0);

    const totalDespesas = transacoesFiltradas
        .filter(t => t.tipo === 'DESPESA')
        .reduce((acc, t) => acc + t.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    // --- FUNÇÕES DE CRUD (Iguais) ---
    const salvarTransacao = async (e) => {
        e.preventDefault();
        const transacaoDados = { descricao, valor: parseFloat(valor), tipo, categoria, data }

        const url = idEditando
            ? `http://localhost:8080/transacoes/${idEditando}`
            : 'http://localhost:8080/transacoes';

        const method = idEditando ? 'PUT' : 'POST';

        try {
            const resposta = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transacaoDados)
            });

            if (resposta.ok) {
                limparFormulario();
                await carregarDados();
            }
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    const removerTransacao = async (id) => {
        if (!confirm("Excluir?")) return;
        await fetch(`http://localhost:8080/transacoes/${id}`, { method: 'DELETE' });
        carregarDados();
    }

    const editarTransacao = (t) => {
        setDescricao(t.descricao);
        setValor(t.valor);
        setTipo(t.tipo);
        setCategoria(t.categoria);
        setData(t.data);
        setIdEditando(t.id);
    }

    const limparFormulario = () => {
        setDescricao(''); setValor(''); setCategoria(''); setData(''); setTipo('DESPESA'); setIdEditando(null);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>💰 Minhas Finanças</h1>

            {/* --- ÁREA DE FILTROS --- */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <select value={mesFiltro} onChange={(e) => setMesFiltro(parseInt(e.target.value))} style={inputStyle}>
                    <option value={1}>Janeiro</option>
                    <option value={2}>Fevereiro</option>
                    <option value={3}>Março</option>
                    <option value={4}>Abril</option>
                    <option value={5}>Maio</option>
                    <option value={6}>Junho</option>
                    <option value={7}>Julho</option>
                    <option value={8}>Agosto</option>
                    <option value={9}>Setembro</option>
                    <option value={10}>Outubro</option>
                    <option value={11}>Novembro</option>
                    <option value={12}>Dezembro</option>
                </select>
                <input
                    type="number"
                    value={anoFiltro}
                    onChange={(e) => setAnoFiltro(parseInt(e.target.value))}
                    style={inputStyle}
                />
            </div>

            {/* DASHBOARD */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}>
                    <h3>Saldo</h3>
                    <p style={{ color: 'blue', fontSize: '24px', fontWeight: 'bold' }}>R$ {saldo.toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                    <h3>Receitas</h3>
                    <p style={{ color: 'green', fontSize: '24px', fontWeight: 'bold' }}>R$ {totalReceitas.toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                    <h3>Despesas</h3>
                    <p style={{ color: 'red', fontSize: '24px', fontWeight: 'bold' }}>R$ {totalDespesas.toFixed(2)}</p>
                </div>
            </div>

            {/* GRÁFICO */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ width: '400px' }}>
                    <GraficoPizza receitas={totalReceitas} despesas={totalDespesas} />
                </div>
            </div>

            {/* FORMULÁRIO */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ddd' }}>
                <h2 style={{ marginTop: 0 }}>{idEditando ? '✏️ Editando' : '➕ Nova Transação'}</h2>
                <form onSubmit={salvarTransacao} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required style={inputStyle} />
                    <input placeholder="Valor" type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required style={inputStyle} />
                    <input placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={inputStyle} />
                    <input type="date" value={data} onChange={(e) => setData(e.target.value)} required style={inputStyle} />
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </select>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" style={buttonStyle}>{idEditando ? 'Atualizar' : 'Salvar'}</button>
                        {idEditando && <button type="button" onClick={limparFormulario} style={{ ...buttonStyle, background: '#ccc', color: '#333' }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            {/* TABELA FILTRADA */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#333', color: 'white' }}>
                    <th style={{ padding: '10px' }}>Descrição</th>
                    <th style={{ padding: '10px' }}>Data</th>
                    <th style={{ padding: '10px' }}>Valor</th>
                    <th style={{ padding: '10px' }}>Ações</th>
                </tr>
                </thead>
                <tbody>
                {transacoesFiltradas.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma transação neste mês.</td></tr>
                ) : (
                    transacoesFiltradas.map((t) => (
                        <tr key={t.id}>
                            <td style={{ padding: '10px' }}>{t.descricao}</td>
                            <td style={{ padding: '10px' }}>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                            <td style={{ padding: '10px', color: t.tipo === 'DESPESA' ? 'red' : 'green' }}>R$ {t.valor.toFixed(2)}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button onClick={() => editarTransacao(t)} style={{ marginRight: '10px' }}>✏️</button>
                                <button onClick={() => removerTransacao(t.id)} style={{ color: 'red' }}>🗑️</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )
}

const cardStyle = { border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '200px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: 'white' }
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }
const buttonStyle = { flex: 1, padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }

export default App