'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // Основные данные
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [translation, setTranslation] = useState(''); // Для перевода владельцу
  const [loading, setLoading] = useState(false);
  
  // Настройки владельца
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerLang, setOwnerLang] = useState('English');
  const [showSettings, setShowSettings] = useState(false); // Скрывать/показывать настройки

  // Лимиты и оплата
  const [count, setCount] = useState(0);
  
  // 🔥 ТВОЯ ГОТОВАЯ ССЫЛКА НА ОПЛАТУ 🔥
  const PADDLE_CHECKOUT_LINK = 'https://buy.paddle.com/items?price_ids=pri_01khnaa03z25nsm9xzm7tz7sys'; 

  // Загрузка настроек при старте
  useEffect(() => {
    const savedCount = localStorage.getItem('usageCount');
    if (savedCount) setCount(parseInt(savedCount));

    // Загружаем сохраненные данные владельца
    const savedName = localStorage.getItem('ownerName');
    const savedRest = localStorage.getItem('restaurantName');
    const savedLang = localStorage.getItem('ownerLang');

    if (savedName) setOwnerName(savedName);
    if (savedRest) setRestaurantName(savedRest);
    if (savedLang) setOwnerLang(savedLang);
  }, []);

  // Сохранение настроек при изменении
  useEffect(() => {
    localStorage.setItem('ownerName', ownerName);
    localStorage.setItem('restaurantName', restaurantName);
    localStorage.setItem('ownerLang', ownerLang);
  }, [ownerName, restaurantName, ownerLang]);

  const generateResponse = async () => {
    if (!review) return;
    // Если лимит (3) исчерпан — не генерируем, покажем пейвол
    if (count >= 3) return;

    setLoading(true);
    setResponse('');
    setTranslation('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          review, 
          ownerName, 
          restaurantName, 
          ownerLang 
        }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setResponse(data.reply);
        setTranslation(data.translation);
        
        const newCount = count + 1;
        setCount(newCount);
        localStorage.setItem('usageCount', newCount.toString());
      }
    } catch (err) {
      alert('Error generating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showPaywall = count >= 3;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', color: '#1a202c' }}>RestoReview<span style={{color:'#e53e3e'}}>.</span></h1>
        <p style={{ fontSize: '1.2rem', color: '#718096' }}>Turn negative reviews into loyalty.</p>
      </header>

      {/* Блок Настроек (Раскрывающийся) */}
      <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <div 
          onClick={() => setShowSettings(!showSettings)} 
          style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>⚙️ Your Business Settings {ownerName ? '✅' : '(Click to set)'}</span>
          <span>{showSettings ? '▲' : '▼'}</span>
        </div>
        
        {showSettings && (
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Your Name</label>
              <input 
                type="text" 
                placeholder="e.g. Alex" 
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Restaurant Name</label>
              <input 
                type="text" 
                placeholder="e.g. Best Burger" 
                value={restaurantName} 
                onChange={(e) => setRestaurantName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.9rem', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Translate replies for me into:</label>
              <select 
                value={ownerLang} 
                onChange={(e) => setOwnerLang(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
              >
                <option value="English">English</option>
                <option value="Hebrew">Hebrew (עברית)</option>
                <option value="Russian">Russian (Русский)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Italian">Italian (Italiano)</option>
                <option value="Portuguese">Portuguese (Português)</option>
                <option value="Chinese">Chinese (中文)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
              <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '5px' }}>
                *The reply itself will be in the customer's language. This is just for you to verify.
              </p>
            </div>
          </div>
        )}
      </div>

      <main style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {!showPaywall ? (
          <>
            <div style={{marginBottom: '10px', textAlign: 'right', fontSize: '0.9rem', color: '#718096'}}>
              Free generations left: <span style={{fontWeight: 'bold', color: '#e53e3e'}}>{3 - count}</span>
            </div>
            
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', color: '#4a5568' }}>
              Paste the guest's review here:
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Example: The waiter was rude and the soup was cold..."
              style={{ width: '100%', minHeight: '150px', padding: '20px', borderRadius: '12px', border: '2px solid #cbd5e0', marginBottom: '25px', fontSize: '16px', outline: 'none' }}
            />
            
            <button 
              onClick={generateResponse}
              disabled={loading}
              style={{ 
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none', 
                background: loading ? '#cbd5e0' : '#e53e3e', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' 
              }}
            >
              {loading ? 'Thinking...' : 'Generate Response'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>🚀 Limit Reached</h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '30px' }}>
              Get unlimited AI responses and increase your rating.
            </p>
            <a 
              href={PADDLE_CHECKOUT_LINK}
              target="_blank"
              style={{ 
                display: 'inline-block', padding: '20px 40px', borderRadius: '50px', 
                background: '#2b6cb0', color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none',
              }}
            >
              Upgrade for $29/mo
            </a>
            <p style={{marginTop: '15px', fontSize: '0.9rem', color:'#718096'}}>Secure payment via Paddle</p>
          </div>
        )}

        {/* Блок с ответом */}
        {response && !showPaywall && (
          <div style={{ marginTop: '40px', display: 'grid', gap: '20px' }}>
            
            {/* 1. Готовый ответ */}
            <div style={{ background: '#f0fff4', padding: '25px', borderRadius: '12px', border: '1px solid #9ae6b4' }}>
              <h3 style={{ color: '#276749', marginTop: 0, fontSize: '1.1rem' }}>✅ Ready to Copy:</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.05rem' }}>{response}</p>
              <button 
                onClick={() => navigator.clipboard.writeText(response)}
                style={{ marginTop: '10px', background: '#276749', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Copy Response
              </button>
            </div>

            {/* 2. Перевод для владельца */}
            <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '12px', border: '1px solid #bee3f8' }}>
              <h3 style={{ color: '#2c5282', marginTop: 0, fontSize: '1rem' }}>🧐 Verification ({ownerLang}):</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#2a4365', fontSize: '0.95rem', fontStyle: 'italic' }}>
                {translation}
              </p>
            </div>

          </div>
        )}
      </main>
      
      <footer style={{ textAlign: 'center', marginTop: '50px', color: '#a0aec0', fontSize: '0.9rem' }}>
        © 2024 RestoReview.online
      </footer>
    </div>
  );
}
