import "../styles/globals.css";
import { Inter } from "@next/font/google";
import { AuthContextProvider } from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </AuthContextProvider>
  );
}

export default MyApp;
