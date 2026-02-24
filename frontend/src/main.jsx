import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

// 🔥 1. Importamos as notificações aqui na raiz!
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider defaultColorScheme="dark">

            {/* 🔥 2. Colocamos o desenhista de notificações globalmente ANTES do App */}
            <Notifications position="top-right" zIndex={1000} />

            <App />
        </MantineProvider>
    </React.StrictMode>,
)