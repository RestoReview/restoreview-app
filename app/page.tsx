'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [translation, setTranslation] = useState('');
  const [reviewTranslation, setReviewTranslation] = useState(''); // Перевод жалобы
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); // Для анимации кнопки копирования
  
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerLang, setOwnerLang] = useState('English');
  const [showSettings, setShowSettings] = useState(false);

  const [count, setCount] = useState(0);
  const PADDLE_CHECKOUT_LINK = 'https://buy.paddle.com/items?price_ids=pri_01khnaa03z25nsm9xzm7tz7sys';

  // 🔥 Определяем, включен ли режим Бога
  const isGodMode = ownerName === 'Nevid_73';

  useEffect(() => {
    const savedCount = localStorage.getItem('usageCount');
    if (savedCount) setCount(parseInt(savedCount));

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
    // Блокируем, только если лимит исчерпан И это не фаундер
    if (count >= 3 && !isGodMode) return;

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
      
      // ЛОВУШКА ДЛЯ ХИТРЕЦОВ: Если Redis заблокировал IP (статус 403)
      if (res.status === 403) {
        setCount(3); 
        localStorage.setItem('usageCount', '3'); 
        setLoading(false);
        return; 
      }
      
      const data = await res.json();
      
      if (data.reply) {
        setReviewTranslation(data.reviewTranslation);
        setResponse(data.reply);
        setTranslation(data.translation);
        
        // Увеличиваем счетчик только для обычных пользователей
        if (!isGodMode) {
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

  // Пейволл показывается, только если лимит >= 3 И не включен God Mode
  const showPaywall = count >= 3 && !isGodMode;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* Навигация / Хедер */}
      <nav style={{ background: '#ffffff', padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.5px' }}>
            RestoReview<span style={{color:'#2563eb'}}>.</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
            AI Reputation Manager
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
                  background: loading || !review ? '#cbd5e1' : '#2563eb', color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: loading || !review ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !review ? 'none' : '0 4px 14px 0 rgba(37, 99, 235, 0.39)', transition: 'all 0.2s ease'
                }}
              >
                {loading ? '✨ Analyzing and Writing...' : 'Generate Professional Reply'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚀</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '15px', color: '#0f172a' }}>Upgrade to Pro</h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '35px', maxWidth: '400px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
                You've seen the magic. Now get unlimited AI responses, save hours of stress, and boost your restaurant's rating.
              </p>
              <a 
                href={PADDLE_CHECKOUT_LINK}
                target="_blank"
                style={{ 
                  display: 'inline-block', padding: '20px 50px', borderRadius: '50px', 
                  background: '#10b981', color: 'white', fontSize: '1.2rem', fontWeight: '800', textDecoration: 'none',
                  boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)', transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Upgrade for $29/mo
              </a>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                🔒 Secure payment via Paddle
              </div>
            </div>
          )}

          {/* Результат */}
          {response && !showPaywall && (
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease-in' }}>
              
              {/* Перевод Жалобы */}
              <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '16px', border: '1px solid #ffe4e6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚩</span>
                  <h3 style={{ color: '#be123c', margin: 0, fontSize: '1rem', fontWeight: '700' }}>What the guest actually said ({ownerLang}):</h3>
                </div>
                <p style={{ margin: 0, color: '#881337', fontSize: '0.95rem', lineHeight: '1.5' }}>{reviewTranslation}</p>
              </div>

              {/* Готовый Ответ (Главный блок) */}
              <div style={{ background: '#f0fdf4', padding: '25px', borderRadius: '16px', border: '2px solid #bbf7d0', position: 'relative' }}>
                <h3 style={{ color: '#166534', marginTop: 0, marginBottom: '15px', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✅</span> Ready to Publish:
                </h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.05rem', color: '#14532d', margin: 0 }}>{response}</p>
                
                {/* КНОПКА КОПИРОВАНИЯ */}
                <button 
                  onClick={handleCopy}
                  style={{ 
                    marginTop: '25px', width: '100%', background: copySuccess ? '#16a34a' : '#15803d', color: 'white', 
                    border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background 0.2s'
                  }}
                >
                  {copySuccess ? '✓ Copied to Clipboard!' : '📄 Copy Response'}
                </button>
              </div>

              {/* Перевод нашего Ответа */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#475569', marginTop: 0, marginBottom: '10px', fontSize: '0.95rem', fontWeight: '700' }}>
                  What we replied ({ownerLang}):
                </h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                  {translation}
                </p>
              </div>

            </div>
          )}
        </main>
        
        {/* FOOTER */}
        <footer style={{ marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '30px', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '15px' }}>
            Need help? Contact us: <a href="mailto:restoreview.connect@gmail.com" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>restoreview.connect@gmail.com</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <a href="/legal" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/legal" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            © 2026 RestoReview.online. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
