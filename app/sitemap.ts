import { MetadataRoute } from 'next';

// Список всех 20 ссылок на наши новые SEO-страницы
const slugs = [
  "respond-1-star-yelp-food-poisoning",
  "google-review-rude-waiter",
  "tripadvisor-fake-competitor-review",
  "google-review-hidden-fees-auto-gratuity",
  "yelp-review-dirty-bathroom",
  "google-review-hair-in-food",
  "tripadvisor-aggressive-bouncer-security",
  "yelp-review-ignored-food-allergy",
  "google-review-overpriced-small-portions",
  "tripadvisor-waiting-hour-for-table",
  "google-review-cold-undercooked-food",
  "yelp-review-racist-discrimination-allegations",
  "tripadvisor-watered-down-drinks",
  "google-review-loud-noise-level",
  "yelp-review-terrible-valet-scratched-car",
  "tripadvisor-cockroach-bug-in-restaurant",
  "google-review-unhelpful-manager",
  "yelp-review-hostess-ignored-guests",
  "tripadvisor-stale-expired-ingredients",
  "google-review-refused-entry-dress-code"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://restoreview.online';

  // Динамически генерируем XML-узлы для всех шаблонов
  const templateUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/templates/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8, // Высокий приоритет для SEO-статей
  }));

  // Возвращаем главную страницу сервиса + все 20 сгенерированных страниц
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1, // Максимальный приоритет для главной
    },
    ...templateUrls,
  ];
}
