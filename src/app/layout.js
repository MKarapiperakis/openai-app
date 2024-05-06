import MainHeader from '@/components/main-header/main-header';
import './globals.css';

export const metadata = {
  title: 'OPENAI CODEMASTER',
  description: 'Test your knowledge with OpenAI\'s assistance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
