import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { ThemeProvider } from './contexts/ThemeContext';

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
      return pages[`../pages/${name}.tsx`];
    },
    setup: ({ App, props }) => (
      <ThemeProvider>
        <App {...props} />
      </ThemeProvider>
    ),
  });
}
