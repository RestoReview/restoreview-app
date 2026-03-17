import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // Разрешаем сканировать ВСЕ страницы
    },
    sitemap: 'https://restoreview.online/sitemap.xml',
  };
}
