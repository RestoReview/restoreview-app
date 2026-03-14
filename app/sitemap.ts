import { MetadataRoute } from 'next';

// Наша база данных (пока копируем сюда те же 2 шаблона)
const templatesData = [
  { slug: "respond-1-star-yelp-food-poisoning" },
  { slug: "google-review-rude-waiter" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://restoreview.online';

  // Динамически генерируем ссылки на все наши SEO-страницы
  const templateUrls: MetadataRoute.Sitemap = templatesData.map((template) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Возвращаем главную страницу + все сгенерированные
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...templateUrls,
  ];
}
