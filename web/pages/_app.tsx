import { AppProps } from 'next/app'
import { CssBaseline, GeistProvider } from '@geist-ui/react'
import { useState } from 'react'

import { themeContext } from '../utils/themeContext'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <GeistProvider theme={{ type: theme }}>
      <CssBaseline />
      <themeContext.Provider
        value={{
          theme,
          toggleTheme: () => {
            setTheme(theme == 'light' ? 'dark' : 'light')
          },
        }}
      >
        <Component {...pageProps} />
      </themeContext.Provider>
    </GeistProvider>
  )
}

export default App
