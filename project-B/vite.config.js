import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const isBuild = command === 'build'
	const baseURL = env.BASE_URL

	return {
		base: isBuild ? baseURL : '/',
		plugins: [vue()]
	}
})
