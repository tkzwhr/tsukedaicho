import './index.styl';
import createApolloClient from '@/apolloClientFactory';
// import SummaryPage from '@/pages/SummaryPage';
import TopPage from '@/pages/TopPage';
import ServerConnectionProvider, {
  ServerConnectionContext,
} from '@/providers/ServerConnectionProvider';
// import TsukesPage from '@/pages/TsukesPage';
// import UsersPage from '@/pages/UsersPage';
import { ApolloProvider } from '@apollo/client/react';
import { Typography, Layout, Menu, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useLocation } from 'react-use';

const PAGES = [
  {
    path: '/',
    name: 'トップ',
    element: <TopPage />,
  },
  // {
  //     path: '/summary',
  //     name: 'サマリ',
  //     element: <SummaryPage />,
  // },
  // {
  //     path: '/tsukes',
  //     name: 'ツケ一覧',
  //     element: <TsukesPage />,
  // },
  // {
  //     path: '/users',
  //     name: 'ユーザー一覧'
  //     element: <UsersPage />,
  // },
];
const MENUS = PAGES.map((p) => ({
  key: p.path,
  label: p.name,
}));

const router = createBrowserRouter(PAGES);

function App({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  console.log(location.pathname);
  const selectedKeys = MENUS.filter((m) => m.key === location.pathname)?.map(
    (m) => m.key,
  );
  const bgColorStyle = { background: colorBgContainer };

  return (
    <Layout className="container">
      <Layout.Header className="header">
        <Typography.Title className="title" level={4}>
          ツケ台帳 Admin
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={selectedKeys}
          items={MENUS}
        />
      </Layout.Header>
      <Layout.Content className="content">
        <div className="inner" style={bgColorStyle}>
          {children}
        </div>
      </Layout.Content>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ServerConnectionProvider>
    <ServerConnectionContext.Consumer>
      {(srvConnCtx) => (
        <ApolloProvider
          client={createApolloClient(srvConnCtx.endpoint, srvConnCtx.secret)}
        >
          <App>
            <RouterProvider router={router} />
          </App>
        </ApolloProvider>
      )}
    </ServerConnectionContext.Consumer>
  </ServerConnectionProvider>,
);
