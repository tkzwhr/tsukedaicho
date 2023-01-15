import './main.styl';
import SummaryPage from '@/pages/Summary.page';
import TopPage from '@/pages/Top.page';
import TsukesPage from '@/pages/Tsukes.page';
import UsersPage from '@/pages/Users.page';
import GraphQLServerConnectionProvider from '@/providers/GraphQLServerConnectionProvider';
import { Typography, Layout, Menu, theme } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router-dom';

type PageKey = 'summary' | 'tsukes' | 'settings' | 'users';

const PAGES: { key: PageKey; path: string; name: string }[] = [
  {
    key: 'summary',
    path: '/',
    name: 'サマリ',
  },
  {
    key: 'tsukes',
    path: '/tsukes',
    name: 'カレンダー',
  },
  {
    key: 'users',
    path: '/users',
    name: 'ユーザー',
  },
  {
    key: 'settings',
    path: '/settings',
    name: '設定',
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
    case 'summary':
      return {
        path: p.path,
        element: (
          <App>
            <SummaryPage />
          </App>
        ),
      };
    case 'tsukes':
      return {
        path: p.path,
        element: (
          <App>
            <TsukesPage />
          </App>
        ),
      };
    case 'settings':
      return {
        path: p.path,
        element: (
          <App>
            <TopPage />
          </App>
        ),
      };
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
const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);
root.render(
  <GraphQLServerConnectionProvider>
    <RouterProvider router={router} />
  </GraphQLServerConnectionProvider>,
);
