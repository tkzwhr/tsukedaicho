import './index.styl';
import createApolloClient from '@/apolloClientFactory';
// import SummaryPage from '@/pages/SummaryPage';
import TopPage from '@/pages/Top.page';
// import TsukesPage from '@/pages/TsukesPage';
import UsersPage from '@/pages/Users.page';
import ServerConnectionProvider, {
  ServerConnectionContext,
} from '@/providers/ServerConnectionProvider';
import { ApolloProvider } from '@apollo/client/react';
import { Typography, Layout, Menu, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router-dom';

type PageKey = 'top' | 'users';

const PAGES: { key: PageKey; path: string; name: string }[] = [
  {
    key: 'top',
    path: '/',
    name: 'トップ',
  },
  // {
  //     path: '/summary',
  //     name: 'サマリ',
  // },
  // {
  //     path: '/tsukes',
  //     name: 'ツケ一覧',
  // },
  {
    key: 'users',
    path: '/users',
    name: 'ユーザー一覧',
  },
];

const MENUS = PAGES.map((p) => ({
  key: p.path,
  label: p.name,
}));

function App({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigatePage = (a: any) => {
    navigate(a.key, { replace: true });
  };

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
          items={MENUS}
          defaultSelectedKeys={selectedKeys}
          onClick={navigatePage}
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

const PAGE_COMPONENTS = PAGES.map((p) => {
  switch (p.key) {
    case 'top':
      return {
        path: p.path,
        element: (
          <App>
            <TopPage />
          </App>
        ),
      };
    // {
    //     path: '/summary',
    //     element: <SummaryPage />,
    // },
    // {
    //     path: '/tsukes',
    //     element: <TsukesPage />,
    // },
    case 'users':
      return {
        path: p.path,
        element: (
          <App>
            <UsersPage />
          </App>
        ),
      };
  }
});

const router = createBrowserRouter(PAGE_COMPONENTS);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ServerConnectionProvider>
    <ServerConnectionContext.Consumer>
      {(srvConnCtx) => (
        <ApolloProvider
          client={createApolloClient(srvConnCtx.endpoint, srvConnCtx.secret)}
        >
          <RouterProvider router={router} />
        </ApolloProvider>
      )}
    </ServerConnectionContext.Consumer>
  </ServerConnectionProvider>,
);
