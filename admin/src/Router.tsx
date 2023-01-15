import { Page, PAGES } from '@/pages';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

type Props = {
  children: (contents: JSX.Element) => JSX.Element;
};

function Router(props: Props): JSX.Element {
  function componentFactory(page: Page): () => Promise<any> {
    switch (page.name) {
      case 'top':
        return () => import('./pages/Top.page');
      case 'users':
        return () => import('./pages/Users.page');
      case 'summary':
        return () => import('./pages/Summary.page');
      case 'tsukes':
        return () => import('./pages/TsukesPage');
      default: {
        const _exhaustiveChecks: never = page.name;
        console.error(_exhaustiveChecks);
        return () => Promise.reject('');
      }
    }
  }

  function routeFactory(page: Page): JSX.Element {
    const Component = React.lazy(componentFactory(page));
    return <Route key={page.name} path={page.path} element={<Component />} />;
  }

  const contents = (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{PAGES.map(routeFactory)}</Routes>
    </Suspense>
  );
  return <BrowserRouter>{props.children(contents)}</BrowserRouter>;
}

export default Router;
