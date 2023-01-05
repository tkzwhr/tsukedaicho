import '@/App.styl';
import Router from '@/Router';
import createApolloClient from '@/apolloClientFactory';
import ServerConnectionProvider, {
  ServerConnectionContext,
} from '@/components/server-connection-provider/ServerConnectionProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';

export default function App(): JSX.Element {
  return (
    <ServerConnectionProvider>
      <ServerConnectionContext.Consumer>
        {(srvConnCtx) => (
          <ApolloProvider
            client={createApolloClient(srvConnCtx.endpoint, srvConnCtx.secret)}
          >
            <Router>
              {(contents: any) => (
                <>
                  <Sidebar />
                  <div className="contents">{contents}</div>
                </>
              )}
            </Router>
          </ApolloProvider>
        )}
      </ServerConnectionContext.Consumer>
    </ServerConnectionProvider>
  );
}
