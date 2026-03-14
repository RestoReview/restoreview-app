import Link from 'next/link';
import { notFound } from 'next/navigation';

// Импортируем нашу будущую базу данных (пока файла нет, но мы его создадим следующим шагом)
import templatesData from '@/data/seo-templates.json';

// 1. МАГИЯ NEXT.JS: Генерируем все 500+ страниц заранее во время билда (SSG)
// Это дает нулевое время ожидания для пользователя и 100/100 баллов в Google PageSpeed
export async function generateStaticParams() {
  return templatesData.map((template) => ({
    slug: template.slug,
  }));
}

// 2. ДИНАМИЧЕСКОЕ SEO: Google будет видеть уникальный заголовок для каждой страницы
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const template = templatesData.find((t) => t.slug === params.slug);
  
  if (!template) {
    return { title: 'Template Not Found' };
  }

  return {
    title: template.title,
    description: template.description,
    openGraph: {
      title: template.title,
      description: template.description,
    },
  };
}

// 3. UI ВОРОНКА: Визуальная часть, которая продает твой продукт
export default function TemplatePage({ params }: { params: { slug: string } }) {
  const template = templatesData.find((t) => t.slug === params.slug);

  // Если кто-то ввел неправильный URL, кидаем на красивую страницу 404
  if (!template) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 font-sans">
      
      {/* Шаг 1: Заголовок, бьющий точно в боль ресторатора */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        {template.title}
      </h1>

      {/* Шаг 2: Эмпатия и объяснение рисков */}
      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        {template.description}
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Шаг 3: Как делать НЕЛЬЗЯ (Анти-паттерн) */}
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">❌</span> How NOT to respond
          </h3>
          <p className="text-red-900 italic text-lg">"{template.bad_example}"</p>
        </div>

        {/* Шаг 4: Бесплатная ценность (Шаблон) */}
        <div className="bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-green-700 font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">✅</span> A Better Approach
          </h3>
          <p className="text-green-900 italic text-lg">"{template.good_example}"</p>
        </div>
      </div>

      {/* Шаг 5: Пейволл-крючок (Call To Action) */}
      <div className="bg-slate-900 text-white rounded-3xl p-10 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">
          Every Review
