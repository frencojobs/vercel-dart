import { createContext } from 'react'

type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const themeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})
