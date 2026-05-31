import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const baseURL = env.BASE_URL

	return {
		base: baseURL,
		plugins: [vue()]
	}
})
