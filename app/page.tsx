'use client';
import { useState, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs';

export default function Home() {
  const { userId } = useAuth(); // Достаем ID авторизованного пользователя
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [translation, setTranslation] = useState('');
  const [reviewTranslation, setReviewTranslation] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); 
  
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerLang, setOwnerLang] = useState('English');
  const [showSettings, setShowSettings] = useState(false);

  const [count, setCount] = useState(0);
  const [isPremiumUser, setIsPremiumUser] = useState(false); // Статус Премиум
  
  const PADDLE_CHECKOUT_LINK = 'https://buy.paddle.com/items?price_ids=pri_01khnaa03z25nsm9xzm7tz7sys';

  // 🔥 Режим Бога
  const isGodMode = ownerName === 'Nevid_73';

  useEffect(() => {
    const savedCount = localStorage.getItem('usageCount');
    if (savedCount) setCount(parseInt(savedCount));

    const savedPremium = localStorage.getItem('isPremium');
    if (savedPremium === 'true') setIsPremiumUser(true);

    const savedName = localStorage.getItem('ownerName');
    const savedRest = localStorage.getItem('restaurantName');
    const savedLang = localStorage.getItem('ownerLang');

    if (savedName) setOwnerName(savedName);
    if (savedRest) setRestaurantName(savedRest);
    if (savedLang) setOwnerLang(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('ownerName', ownerName);
    localStorage.setItem('restaurantName', restaurantName);
    localStorage.setItem('ownerLang', ownerLang);
  }, [ownerName, restaurantName, ownerLang]);

  const generateResponse = async () => {
    if (!review) return;
    
    // Блокируем на фронте, если лимит исчерпан, не God Mode и не Premium
    if (count >= 3 && !isGodMode && !isPremiumUser) return;

    setLoading(true);
    setResponse('');
    setTranslation('');
    setReviewTranslation('');
    setCopySuccess(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, ownerName, restaurantName, ownerLang }),
      });
      
      // ЛОВУШКА: Если сервер (Redis/Supabase) сказал "Нет доступа" (403)
      if (res.status === 403) {
        setCount(3); 
        localStorage.setItem('usageCount', '3'); 
        setIsPremiumUser(false); // Снимаем премиум, если он пытался обмануть
        localStorage.removeItem('isPremium');
        setLoading(false);
        return; 
      }
      
      const data = await res.json();
      
      if (data.reply) {
        setReviewTranslation(data.reviewTranslation);
        setResponse(data.reply);
        setTranslation(data.translation);
        
        // Если сервер подтвердил, что юзер Premium - сохраняем это навсегда!
        if (data.isPremium) {
          setIsPremiumUser(true);
          localStorage.setItem('isPremium', 'true');
        } else if (!isGodMode) {
          // Иначе просто мотаем счетчик обычных попыток
          const newCount = count + 1;
          setCount(newCount);
          localStorage.setItem('usageCount', newCount.toString());
        }
      } else if (data.error) {
        alert(`Oops: ${data.message || data.error}`);
      }
    } catch (err) {
      alert('Error generating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Показывать ли Пейволл? (Если лимит >= 3, не God Mode и не Premium)
  const showPaywall = count >= 3 && !isGodMode && !isPremiumUser;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* Навигация / Хедер с интеграцией Clerk */}
      <nav style={{ background: '#ffffff', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.5px' }}>
            RestoReview<span style={{color:'#2563eb'}}>.</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', color: '#0f172a', lineHeight: '1.2' }}>
            Turn Angry Guests Into <br/><span style={{ color: '#2563eb' }}>Loyal Customers.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
            Paste any customer review below. Our AI will analyze the complaint, translate it for you, and craft the perfect professional reply in seconds.
          </p>
        </header>

        {/* Настройки */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div 
            onClick={() => setShowSettings(!showSettings)} 
            style={{ cursor: 'pointer', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1e293b' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚙️</span> Personalize Your AI {ownerName ? <span style={{color: '#10b981'}}>✓</span> : ''}
            </span>
            <span style={{ color: '#94a3b8' }}>{showSettings ? 'Close ▲' : 'Open ▼'}</span>
          </div>
          
          {showSettings && (
            <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</label>
                <input 
                  type="text" placeholder="e.g. Alex" value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Restaurant Name</label>
                <input 
                  type="text" placeholder="e.g. Best Burger" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Native Language (for translations)</label>
                <select 
                  value={ownerLang} onChange={(e) => setOwnerLang(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                >
                  <option value="English">English</option>
                  <option value="Hebrew">Hebrew (עברית)</option>
                  <option value="Russian">Russian (Русский)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Italian">Italian (Italiano)</option>
                  <option value="Chinese">Chinese (中文)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Основной Блок */}
        <main style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          
          {!showPaywall ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.1rem' }}>
                  Paste the customer review:
                </label>
                <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', color: '#475569', fontWeight: '600' }}>
                  {isGodMode ? (
                    <span style={{ color: '#10b981' }}>God Mode ♾️</span>
                  ) : isPremiumUser ? (
                    <span style={{ color: '#10b981' }}>Premium ✦</span>
                  ) : (
                    <>Free generations left: <span style={{ color: count >= 2 ? '#ef4444' : '#2563eb' }}>{Math.max(0, 3 - count)}</span></>
                  )}
                </span>
              </div>
              
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Example: The food was cold and the waiter was rude..."
                style={{ width: '100%', minHeight: '140px', padding: '20px', borderRadius: '16px', border: '2px solid #e2e8f0', marginBottom: '25px', fontSize: '16px', outline: 'none', transition: 'border 0.2s', resize: 'vertical' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              
              <button 
                onClick={generateResponse}
                disabled={loading || !review}
                style={{ 
                  width: '100%', padding: '18px', borderRadius: '16px', border: 'none', 
                  background: loading ||
