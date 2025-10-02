import React from 'react';

export const Route = ({ component: Component }: { path: string; component: React.FC }) => {
  return <Component />;
};
