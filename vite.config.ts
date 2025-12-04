import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga todas las variables de entorno (incluyendo las de .env)
  // El tercer argumento '' permite cargar variables que no tengan prefijo VITE_
  // Fix: Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Inyecta la variable API_KEY del sistema/archivo .env en el código del cliente
      // Se usa JSON.stringify para asegurar que sea un string válido
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})