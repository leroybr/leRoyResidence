import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno. 
  // 'path.resolve('.')' asegura que busque el archivo .env en la raíz.
  const env = loadEnv(mode, path.resolve('.'), '');

  return {
    // Configuración para que el servidor de desarrollo escuche en 0.0.0.0
    // (Útil para contenedores o Vercel Dev)
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    // Plugins necesarios para React
    plugins: [react()],
    
    // Inyecta las variables de entorno en el código del navegador (cliente).
    // Usamos el fallback (|| '') para evitar que el compilador falle si no encuentra la clave.
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },

    resolve: {
      alias: {
        // Alias para poder usar importaciones relativas como @/components/Header
        '@': path.resolve('.'),
      }
    }
  };
});