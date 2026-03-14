import Link from 'next/link';
import { notFound } from 'next/navigation';

// Встраиваем базу данных прямо в код страницы, чтобы обойти проблемы с путями!
const templatesData = [
  {
    slug: "respond-1-star-yelp-food-poisoning",
    title: "How to Respond to a 1-Star Yelp Review About Food Poisoning",
    description: "Allegations of food poisoning are a severe PR crisis. If left unanswered, they can trigger health inspections and scare away hundreds of potential guests. Here is how to handle it professionally.",
    platform: "Yelp",
    issue: "food poisoning",
    bad_example: "This is a lie! Nobody else got sick. We have a perfect health score!",
    good_example: "Dear guest, we take allegations of foodborne illness extremely seriously, as the health and safety of our patrons is our highest priority. We would like to investigate this immediately. Please contact our management team directly so we can gather more details."
  },
  {
    slug: "google-review-rude-waiter",
    title: "Handling a Google Review About a Rude Waiter",
    description: "A review about a rude staff member hurts your hospitality image. The key is not to get defensive, but to show that management is holding the team accountable.",
    platform: "Google",
    issue: "rude staff",
    bad_example: "Our staff is working 12-hour shifts. If you were nicer to them, maybe they would smile more.",
    good_example: "Thank you for bringing this to our attention. This level of service does not reflect our standards. We are addressing your feedback with our front-of-house team to ensure this doesn't happen again."
  }
];

export async function generateStaticParams() {
  return templatesData.map((template) => ({
    slug: template.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const template = templatesData.find((t) => t.slug === params.slug);
  
  if (!template) {
    return { title: 'Template Not Found' };
  }

  return {
    title: template.title,
    description: template.description,
  };
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const template = templatesData.find((t) => t.slug === params.slug);

  if (!template) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        {template.title}
      </h1>

      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        {template.description}
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h3 className="text-red-700 font-bold text-lg mb-4">
            How NOT to respond
          </h3>
          <p className="text-red-900 italic text-lg">&quot;{template.bad_example}&quot;</p>
        </div>

        <div className="bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-green-700 font-bold text-lg mb-4">
            A Better Approach
          </h3>
          <p className="text-green-900 italic text-lg">&quot;{template.good_example}&quot;</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-10 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">
          Every Review is Unique. Don&apos;t Just Copy-Paste.
        </h2>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Templates are great, but your guests can tell when a response is canned. 
          Let our AI analyze the exact tone of your guest and write a perfectly tailored, 
          PR-safe response in 3 seconds.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-white text-slate-900 font-bold text-lg py-4 px-10 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200"
        >
          Generate Custom Reply for Free
        </Link>
      </div>
      
    </div>
  );
}
