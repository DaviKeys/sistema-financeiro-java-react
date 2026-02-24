import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function ThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="lg"
            aria-label="Alternar tema"
        >
            {/* Se estiver Escuro (Lua) -> Mostra LUA. Se estiver Claro (Sol) -> Mostra SOL */}
            {computedColorScheme === 'dark' ? (
                <IconMoon size={20} stroke={1.5} />
            ) : (
                <IconSun size={20} stroke={1.5} />
            )}
        </ActionIcon>
    );
}

export default ThemeToggle;