import React from "react";
import { useLocalStorage } from "react-use";

type ContextValue = {
  endpoint: string | undefined;
  setEndpoint: (v: string) => void;
  secret: string | undefined;
  setSecret: (v: string) => void;
};

export const ServerConnectionContext = React.createContext<ContextValue>({
  endpoint: "",
  setEndpoint: () => {
    return;
  },
  secret: "",
  setSecret: () => {
    return;
  },
});

export default function ServerConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [endpoint, setEndpoint] = useLocalStorage("ENDPOINT", "");
  const [secret, setSecret] = useLocalStorage("SECRET", "");

  return (
    <ServerConnectionContext.Provider
      value={{ endpoint, setEndpoint, secret, setSecret }}
    >
      {children}
    </ServerConnectionContext.Provider>
  );
}
