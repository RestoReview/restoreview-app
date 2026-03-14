import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

// Наша захардкоженная база данных
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
  },
  {
    slug: "tripadvisor-fake-competitor-review",
    title: "How to Reply to a Fake 1-Star Review on TripAdvisor",
    description: "Competitors or trolls often leave fake reviews to tank your rating. Your response isn't for the troll; it's to show future guests that you are a legitimate, well-managed business.",
    platform: "TripAdvisor",
    issue: "fake review",
    bad_example: "We know you work for the pizza place across the street. Stop leaving fake reviews, we are calling our lawyers!",
    good_example: "Hi there, we have checked our reservation system and have no record of a guest under this name, nor any reports matching this incident. We take real feedback seriously. If you actually dined with us, please reach out directly."
  },
  {
    slug: "google-review-hidden-fees-auto-gratuity",
    title: "Responding to Complaints About Hidden Fees or Auto-Gratuity",
    description: "Guests hate feeling tricked by unexpected service charges. A calm, transparent explanation of your pricing policy prevents the 'scam' label from sticking to your brand.",
    platform: "Google",
    issue: "hidden fees",
    bad_example: "It clearly says on the menu that we charge an 18% service fee. You should learn how to read before eating out.",
    good_example: "We appreciate your feedback. To ensure fair compensation for our entire team, we include a standard service charge, which is noted on our menus. We apologize if this was not communicated clearly by our staff during your visit."
  },
  {
    slug: "yelp-review-dirty-bathroom",
    title: "Handling a Yelp Review About Dirty Restrooms",
    description: "A dirty bathroom makes guests question the cleanliness of your kitchen. You must publicly reassure readers that sanitation protocols are in place and actively enforced.",
    platform: "Yelp",
    issue: "dirty restroom",
    bad_example: "It was a busy Friday night, what do you expect? We can't clean it every five minutes.",
    good_example: "Thank you for bringing this to our attention. Cleanliness is a top priority for us, and we clearly fell short during your visit. We have updated our restroom check logs with our staff to ensure this is monitored strictly during peak hours."
  },
  {
    slug: "google-review-hair-in-food",
    title: "How to Respond When a Guest Finds Hair in Their Food",
    description: "Finding foreign objects in food is deeply unpleasant. The only valid PR strategy is absolute apology, empathy, and immediate operational correction.",
    platform: "Google",
    issue: "hair in food",
    bad_example: "None of our chefs have blonde hair, so it must have been yours.",
    good_example: "We are deeply sorry about this experience. This falls far below our strict hygiene standards. We have reviewed our kitchen protocols and hairnet policies with our culinary team. We would love the chance to make this right—please contact us directly."
  },
  {
    slug: "tripadvisor-aggressive-bouncer-security",
    title: "Responding to Reviews About Aggressive Door Staff or Bouncers",
    description: "Claims of physical or verbal abuse by security can destroy a venue's reputation and lead to legal trouble. Management must isolate the employee's behavior from the brand.",
    platform: "TripAdvisor",
    issue: "aggressive bouncer",
    bad_example: "Our security is just doing their job. If you were sober, you wouldn't have been kicked out.",
    good_example: "We take accusations regarding our security team very seriously. Guest safety and respect are our core values. We are actively investigating this incident with our door staff. Please email management so we can gather more details."
  },
  {
    slug: "yelp-review-ignored-food-allergy",
    title: "How to Address a Severe Review About an Ignored Food Allergy",
    description: "Allergy mismanagement is a life-threatening liability. A public response must demonstrate total accountability and rigorous safety training.",
    platform: "Yelp",
    issue: "ignored allergy",
    bad_example: "You should have reminded the waiter again. We serve nuts in our kitchen, so it's a risk you take.",
    good_example: "We are incredibly sorry. We take food allergies with the utmost seriousness, and a lapse in communication between our staff and kitchen is unacceptable. We are retraining our team immediately on allergy protocols. Please contact management so we can personally apologize."
  },
  {
    slug: "google-review-overpriced-small-portions",
    title: "Replying to Complaints About Expensive, Small Portions",
    description: "Value-for-money complaints are common in fine dining. Respond by highlighting the quality, sourcing, and technique behind the ingredients without sounding arrogant.",
    platform: "Google",
    issue: "small portions",
    bad_example: "This is fine dining, not a fast-food buffet. Quality costs money.",
    good_example: "Thank you for your feedback. We source premium, local ingredients and focus on culinary technique, which is reflected in our portion sizes and pricing. However, we always want our guests to leave satisfied, and we will share your thoughts with our culinary team."
  },
  {
    slug: "tripadvisor-waiting-hour-for-table",
    title: "Handling Complaints About Waiting an Hour Despite a Reservation",
    description: "Failing to honor reservation times breaks trust. Acknowledge the operational failure and offer a sincere apology to rebuild goodwill.",
    platform: "TripAdvisor",
    issue: "long wait time",
    bad_example: "People were taking too long to eat and wouldn't leave their tables. We can't force them out.",
    good_example: "We sincerely apologize. Honoring reservation times is important to us, and we failed to manage our table turnover effectively during your visit. We are reviewing our booking system to ensure this doesn't happen again. We'd love to make it up to you."
  },
  {
    slug: "google-review-cold-undercooked-food",
    title: "Responding to Reviews About Cold or Undercooked Food",
    description: "A kitchen execution failure needs a humble response. Focus on your commitment to quality and the specific steps taken to fix the line's workflow.",
    platform: "Google",
    issue: "cold food",
    bad_example: "It was hot when it left the kitchen. You probably spent 10 minutes taking photos for Instagram.",
    good_example: "We apologize that your meal did not arrive at the perfect temperature. This is not the standard we strive for. We have shared your feedback directly with our Executive Chef to review our plating and delivery timing."
  },
  {
    slug: "yelp-review-racist-discrimination-allegations",
    title: "How to Respond to Allegations of Racism or Discrimination",
    description: "These are the most damaging reviews a business can receive. A generic response will cause outrage. You must state an unequivocal zero-tolerance policy.",
    platform: "Yelp",
    issue: "discrimination",
    bad_example: "We are not racist! Our manager is a minority. You are making things up because you didn't get a free table.",
    good_example: "We are deeply disturbed by your review. We have a strict zero-tolerance policy for discrimination of any kind, and we want every guest to feel welcome. We are launching an immediate internal investigation. Please reach out to ownership directly."
  },
  {
    slug: "tripadvisor-watered-down-drinks",
    title: "Replying to Accusations of Watered-Down Cocktails",
    description: "Guests who feel cheated at the bar will leave scathing reviews. Address the pour policies politely to reassure future patrons of your beverage integrity.",
    platform: "TripAdvisor",
    issue: "watered down drinks",
    bad_example: "We use standard jiggers. If you want a double, pay for a double.",
    good_example: "Thank you for your feedback. Our bartenders strictly follow precise recipes and pour measurements to ensure consistency. We are sorry your cocktail didn't hit the mark, and we will review our ice-to-liquor ratios with the bar team."
  },
  {
    slug: "google-review-loud-noise-level",
    title: "Handling Complaints About Extreme Noise Levels",
    description: "Atmosphere is subjective, but overwhelming noise ruins a dinner. Validate their experience while framing your venue's typical vibe appropriately.",
    platform: "Google",
    issue: "loud noise",
    bad_example: "It's a weekend in the city, of course it's loud. Go to a library if you want quiet.",
    good_example: "We appreciate your feedback. We aim for a lively, energetic atmosphere, but we understand it can sometimes get a bit too loud for intimate conversations. We are currently looking into acoustic solutions to better balance the sound in our dining room."
  },
  {
    slug: "yelp-review-terrible-valet-scratched-car",
    title: "Responding to a Yelp Review About a Scratched Car by Valet",
    description: "Valet damages shift the complaint from a bad meal to property damage. Redirect the conversation offline immediately to your insurance or third-party vendor.",
    platform: "Yelp",
    issue: "bad valet",
    bad_example: "We don't own the valet company, so it's not our problem. Take it up with them.",
    good_example: "We are very sorry to hear about this incident. While our valet is operated by a third-party service, we expect our guests' property to be treated with total care. Please contact us so we can connect you with the valet management team to resolve this."
  },
  {
    slug: "tripadvisor-cockroach-bug-in-restaurant",
    title: "Crisis Management: Responding to a Bug/Cockroach Sighting",
    description: "Pest sightings cause instant panic and loss of bookings. Emphasize your professional pest control contracts to neutralize the fear.",
    platform: "TripAdvisor",
    issue: "bug sighting",
    bad_example: "It's Florida, bugs get inside sometimes when the door opens. It's not a big deal.",
    good_example: "We are mortified by this and sincerely apologize. We employ professional, preventative pest control services on a weekly basis, and we have immediately called them in for a comprehensive inspection. This does not reflect our stringent health standards."
  },
  {
    slug: "google-review-unhelpful-manager",
    title: "How to Reply When the Manager is Called Out for Being Unhelpful",
    description: "When the escalation point (the manager) fails, the brand is in trouble. Ownership must step in and show that the manager's behavior is being addressed.",
    platform: "Google",
    issue: "bad management",
    bad_example: "The manager was following protocol. You were being unreasonable about your steak.",
    good_example: "We are disappointed to read this. Our management team is trained to resolve issues with empathy and professionalism, and it sounds like we failed to do that for you. Ownership is reviewing this interaction internally. We hope you'll allow us to make it right."
  },
  {
    slug: "yelp-review-hostess-ignored-guests",
    title: "Responding to a Review Where the Hostess Ignored Guests",
    description: "The host stand is the first impression. If guests feel ignored, the rest of the meal is tainted. Reiterate the importance of hospitality from the moment they walk in.",
    platform: "Yelp",
    issue: "ignored by hostess",
    bad_example: "She was busy managing a waitlist of 50 people. Have some patience.",
    good_example: "We apologize for the cold reception. Making our guests feel welcome from the moment they walk through the door is our standard. We are addressing your comments with our host team to ensure prompt, friendly greetings even during a rush."
  },
  {
    slug: "tripadvisor-stale-expired-ingredients",
    title: "Replying to Accusations of Stale or Expired Ingredients",
    description: "Claims of old food destroy culinary credibility. Defend your prep protocols gently while offering to investigate the specific dish.",
    platform: "TripAdvisor",
    issue: "stale food",
    bad_example: "Everything is fresh. Your palate just doesn't understand our flavor profile.",
    good_example: "We are sorry your dish tasted off. We pride ourselves on daily deliveries and fresh prep, so this is highly unusual. We have flagged this specific dish with our Executive Chef for an immediate quality check. We'd love to invite you back for a true representation of our menu."
  },
  {
    slug: "google-review-refused-entry-dress-code",
    title: "Handling a Negative Review About Dress Code Rejection",
    description: "Dress code rejections often spark angry reviews. Maintain your standards, but apologize for any lack of clarity or rudeness in how it was communicated.",
    platform: "Google",
    issue: "dress code",
    bad_example: "Read the website. You showed up in flip-flops to a high-end restaurant.",
    good_example: "We appreciate your interest in dining with us. We do maintain a business-casual dress code to preserve the ambiance of our dining room, which is stated on our website. We apologize if this policy wasn't communicated politely at the door."
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
    <>
      {/* ЧИТ-КОД: Подключаем стили прямо из облака */}
      <Script src="https://cdn.tailwindcss.com" />
      
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
    </>
  );
}
