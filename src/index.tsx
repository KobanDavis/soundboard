import React, { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Home from './App'
import { ThemeProvider, useTheme } from '@kobandavis/ui'
import './index.css'
import { PlayerProvider } from './providers/Player'

const defaultTheme = { primary: '#e92b64', secondary: '#01000a' }

const App = () => {
	const { setThemeColor } = useTheme()

	useLayoutEffect(() => {
		document.body.classList.add('bg-theme-secondary', 'text-theme-primary')
		setThemeColor('primary', localStorage.getItem('primary') ?? defaultTheme.primary)
		setThemeColor('secondary', localStorage.getItem('secondary') ?? defaultTheme.secondary)
	}, [])

	return <Home />
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
	<React.StrictMode>
		<ThemeProvider>
			<PlayerProvider>
				<App />
			</PlayerProvider>
		</ThemeProvider>
	</React.StrictMode>
)
