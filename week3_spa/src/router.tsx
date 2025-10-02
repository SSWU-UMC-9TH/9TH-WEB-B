import React, { useState, useEffect, useMemo, Children, FC, ReactNode, ComponentType } from 'react';
import type { ReactElement } from 'react';

interface RoutesProps { children: ReactNode; }
interface LinkProps { to: string; children: ReactNode; }
interface RouteElementProps { path: string; component: ComponentType<any>; }

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('pushstate', onLocationChange); 
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('pushstate', onLocationChange);
    };
  }, []);
  return currentPath;
};

export const Link: FC<LinkProps> = ({ to, children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event('pushstate')); 
  };

  return (
    <a href={to} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </a>
  );
};

const isRouteElement = (element: any): element is ReactElement<RouteElementProps> => {
    return typeof element === 'object' && element !== null && element.type.name === 'Route'; 
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    let matchingRoute = routes.find((route) => route.props.path === currentPath);
    if (!matchingRoute) {
        matchingRoute = routes.find((route) => route.props.path === '*');
    }
    return matchingRoute ? matchingRoute.props.component : null;
  }, [children, currentPath]);

  if (!activeRoute) return null;
  
  const ComponentToRender = activeRoute;
  return <ComponentToRender />;
};

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};