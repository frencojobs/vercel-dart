import { AppProps } from "next/app";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { themeContext } from "../utils/themeContext";
import { useState } from "react";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <GeistProvider theme={{ type: theme }}>
      <CssBaseline />
      <themeContext.Provider
        value={{
          theme,
          toggleTheme: () => {
            console.log(theme);
            setTheme(theme == "light" ? "dark" : "light");
          },
        }}
      >
        <Component {...pageProps} />
      </themeContext.Provider>
    </GeistProvider>
  );
};

export default App;
