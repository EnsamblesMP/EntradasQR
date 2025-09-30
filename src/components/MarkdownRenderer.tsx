import Markdown from 'react-markdown';
import { Prose } from '../chakra/prose';
import type { FC } from 'react';

interface MarkdownRendererProps {
  contenido: string;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ contenido }) => {
  return (
    <Prose
      className="light"
      bg="white"
      color="black"
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      <Markdown
        components={{
          a: ({ children, href }) => (
            <a
              href={href}
              style={{ color: '#3182ce', textDecoration: 'underline' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p style={{ 
              margin: '0 0 0.5em 0', // Bottom margin only, like in emails
              padding: 0,
              whiteSpace: 'preserve-breaks',
            }}>
              {children}
            </p>
          ),
        }}
      >
        {contenido}
      </Markdown>
    </Prose>
  );
};
