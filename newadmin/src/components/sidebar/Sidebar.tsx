import '@/components/sidebar/Sidebar.styl';
import useLocationChange from '@/hooks/locationChange';
import { PAGES } from '@/pages';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export default function Sidebar(): JSX.Element {
  const { pathname } = useLocation();
  const pageName = PAGES.find((p) => p.path === pathname)?.name ?? 'top';
  const [activeItem, setActiveItem] = useState(pageName);

  useLocationChange((location) => {
    const pageName =
      PAGES.find((p) => p.path === location.pathname)?.name ?? 'top';
    setActiveItem(pageName);
  });

  return (
    <Menu className="side-bar" pointing secondary vertical fixed="left">
      <Menu.Item header>つけ台帳 Admin</Menu.Item>
      {PAGES.map((p) => (
        <Menu.Item
          key={p.name}
          as={Link}
          to={p.path}
          name={p.label}
          active={activeItem === p.name}
          onClick={() => setActiveItem(p.name)}
        />
      ))}
    </Menu>
  );
}
