import React, { FC, useEffect, useMemo, useState, Children, cloneElement } from 'react';
import { Route } from './Route';

export const Routes: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(
      (child) => (child as any).type === Route
    );
    return routes.find((route: any) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute as any);
};
