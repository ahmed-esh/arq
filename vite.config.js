import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()],
  server: {
    https: true,
    host: true, // This exposes the server to your network
    port: 5173, // Default Vite port
  },
  base: '/arq', // Replace with your repository name
  build: {
    outDir: 'dist'
  }
} 