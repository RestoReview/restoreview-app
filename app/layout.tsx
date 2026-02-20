import type { Metadata } from 'next';
import Script from 'next/script';

// Базовые SEO-настройки для красивого отображения ссылок
export const metadata: Metadata = {
  title: 'RestoReview | AI Reputation Manager',
  description: 'Turn angry guests into loyal customers with AI-generated review responses in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        
        {/* Microsoft Clarity - Продуктовая аналитика и тепловые карты */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vkch143hqd");
          `}
        </Script>
      </body>
    </html>
  );
}
