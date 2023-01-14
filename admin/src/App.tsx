import '@/App.styl';
import Router from '@/Router';
import createApolloClient from '@/apolloClientFactory';
import Sidebar from '@/components/sidebar/Sidebar';
import ServerConnectionProvider, {
  ServerConnectionContext,
} from '@/providers/ServerConnectionProvider';
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
