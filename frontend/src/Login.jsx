import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Group, Anchor, Center, Box } from '@mantine/core';
import { IconMail, IconLock, IconUser, IconShieldCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);

    // 🔥 NOVO: Controle da tela de digitar o código
    const [isVerificando, setIsVerificando] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [codigo, setCodigo] = useState(''); // 🔥 NOVO: O código de 6 dígitos
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://api-financeiro-davi.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                const erro = await response.text();

                // 🔥 Se o Java avisar que a conta não está ativa (Erro 403), joga a pessoa pra tela de código!
                if (response.status === 403) {
                    setIsVerificando(true);
                    setIsLogin(false);
                }

                notifications.show({ title: 'Atenção', message: erro, color: 'red' });
            } else {
                const dados = await response.json();
                onLogin(dados.nome, dados.id, dados.token);
            }
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha na conexão com o servidor.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://api-financeiro-davi.onrender.com/auth/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
            });

            const mensagem = await response.text();

            if (!response.ok) {
                notifications.show({ title: 'Erro', message: mensagem, color: 'red' });
            } else {
                notifications.show({ title: 'Quase lá!', message: mensagem, color: 'blue' });

                // 🔥 Sucesso ao cadastrar! Muda para a tela de colocar o código em vez do Login normal
                setIsVerificando(true);
                setIsLogin(false);
            }
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha na conexão com o servidor.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

     //Enviar o código para o Java
    const handleVerificacao = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://api-financeiro-davi.onrender.com/auth/verificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, codigo }),
            });

            const mensagem = await response.text();

            if (!response.ok) {
                notifications.show({ title: 'Erro', message: mensagem, color: 'red' });
            } else {
                notifications.show({ title: 'Sucesso!', message: mensagem, color: 'green' });

                // 🔥 Conta ativada! Volta pra tela de login limpinha para a pessoa entrar
                setIsVerificando(false);
                setIsLogin(true);
                setSenha('');
                setCodigo('');
            }
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha na conexão.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Center mb="xl">
                <Group gap="sm">
                    <Box w={8} h={40} bg="indigo" style={{ borderRadius: '8px' }} />
                    <Title order={1} fw={900}>Gestão Financeira</Title>
                </Group>
            </Center>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">

                {/* 🔥 TELA 1: VERIFICAÇÃO DE E-MAIL (Só aparece se o isVerificando for true) */}
                {isVerificando ? (
                    <form onSubmit={handleVerificacao}>
                        <Title order={3} ta="center" mb="sm">Verifique seu E-mail</Title>
                        <Text c="dimmed" size="sm" ta="center" mb="md">
                            Enviamos um código de 6 dígitos para o e-mail <b>{email || 'informado'}</b>. Digite abaixo para ativar sua conta.
                        </Text>

                        <TextInput
                            label="Código de Verificação"
                            placeholder="Ex: 123456"
                            required
                            maxLength={6}
                            value={codigo}
                            onChange={(e) => setCodigo(e.currentTarget.value)}
                            leftSection={<IconShieldCheck size={18} />}
                            mb="md"
                            styles={{ input: { textAlign: 'center', letterSpacing: '5px', fontSize: '20px', fontWeight: 'bold' } }}
                        />

                        <Button fullWidth mt="xl" type="submit" loading={loading} color="teal">
                            Ativar Minha Conta
                        </Button>

                        <Text ta="center" mt="md" size="sm">
                            <Anchor type="button" component="button" size="sm" onClick={() => { setIsVerificando(false); setIsLogin(true); }}>
                                Voltar para o Login
                            </Anchor>
                        </Text>
                    </form>

                ) : (

                    /* 🔥 TELA 2: LOGIN OU CADASTRO NORMAL */
                    <form onSubmit={isLogin ? handleLogin : handleCadastro}>
                        <Title order={3} ta="center" mb="md">
                            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                        </Title>

                        {!isLogin && (
                            <TextInput
                                label="Nome"
                                placeholder="Seu nome completo"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.currentTarget.value)}
                                leftSection={<IconUser size={18} />}
                                mb="md"
                            />
                        )}

                        <TextInput
                            label="E-mail"
                            placeholder="seu@email.com"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            leftSection={<IconMail size={18} />}
                            mb="md"
                        />

                        <PasswordInput
                            label="Senha"
                            placeholder="Sua senha secreta"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.currentTarget.value)}
                            leftSection={<IconLock size={18} />}
                            mb="xl"
                        />

                        <Button fullWidth mt="xl" type="submit" loading={loading} color="indigo">
                            {isLogin ? 'Entrar' : 'Cadastrar e Receber Código'}
                        </Button>

                        <Text ta="center" mt="md" size="sm">
                            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                            <Anchor type="button" component="button" size="sm" onClick={() => { setIsLogin(!isLogin); setIsVerificando(false); }}>
                                {isLogin ? 'Cadastre-se' : 'Faça login'}
                            </Anchor>
                        </Text>

                        {/* Opção extra caso a pessoa já tenha o código na mão e só queira ativar */}
                        {isLogin && (
                            <Text ta="center" mt="xs" size="sm">
                                <Anchor type="button" component="button" size="xs" color="gray" onClick={() => setIsVerificando(true)}>
                                    Já tenho um código de ativação
                                </Anchor>
                            </Text>
                        )}
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default Login;