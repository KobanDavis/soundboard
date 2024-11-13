import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { execSync } from 'child_process'

const config: ForgeConfig = {
	packagerConfig: {
		extraResource: ['node_modules/node-global-key-listener/bin/WinKeyServer.exe'],
		icon: './resources/assets/switch.ico',
	},
	rebuildConfig: {},
	hooks: {
		postMake: async (_forgeConfig, result) => {
			console.log(JSON.stringify(result))
			const { version } = result[0].packageJSON
			const tagName = `v${version}`

			try {
				// Check if the tag already exists
				execSync(`git rev-parse ${tagName}`, { stdio: 'ignore' })
				console.log(`Tag ${tagName} already exists. Skipping tag creation.`)
			} catch {
				// If the tag doesn't exist, create and push it
				execSync(`git tag -a ${tagName} -m "Release ${tagName}"`)
				execSync('git push --tags')
				console.log(`Published git tag ${tagName}`)
			}
		},
	},
	makers: [new MakerSquirrel({})],
	plugins: [
		new VitePlugin({
			// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
			// If you are familiar with Vite configuration, it will look really familiar.
			build: [
				{
					// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
					entry: 'src/main.ts',
					config: 'vite.main.config.ts',
				},
				{
					entry: 'src/preload.ts',
					config: 'vite.preload.config.ts',
				},
			],
			renderer: [
				{
					name: 'main_window',
					config: 'vite.renderer.config.ts',
				},
			],
		}),
	],
}

export default config
