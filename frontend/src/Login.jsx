import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Group, Anchor, Center, Box } from '@mantine/core';
import { IconMail, IconLock, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
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
                notifications.show({ title: 'Sucesso!', message: mensagem, color: 'green' });

                const loginResponse = await fetch('https://api-financeiro-davi.onrender.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha }),
                });

                if (!loginResponse.ok) {
                    const erroLogin = await loginResponse.text();
                    notifications.show({ title: 'Atenção', message: erroLogin, color: 'yellow' });
                    setIsLogin(true);
                } else {
                    const dados = await loginResponse.json();
                    await onLogin(dados.nome, dados.id, dados.token);
                }
            }
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha na conexão com o servidor.', color: 'red' });
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
                        {isLogin ? 'Entrar' : 'Cadastrar'}
                    </Button>

                    <Text ta="center" mt="md" size="sm">
                        {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                        <Anchor type="button" component="button" size="sm" onClick={() => { setIsLogin(!isLogin); }}>
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </Anchor>
                    </Text>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;