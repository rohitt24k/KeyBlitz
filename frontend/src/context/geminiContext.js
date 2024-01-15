import { createContext } from "react";

const geminiContext = createContext();

export function GeminiProvider({ children }) {
  return <geminiContext.Provider>{children}</geminiContext.Provider>;
}

export default geminiContext;
