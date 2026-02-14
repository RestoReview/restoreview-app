'use client';
import { useState } from 'react';

export default function Home() {
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateResponse = async () => {
    if (!review) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      alert('Error generating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', color: '#1a202c' }}>RestoReview<span style={{color:'#e53e3e'}}>.</span></h1>
        <p style={{ fontSize: '1.2rem', color: '#718096' }}>
          Turn negative reviews into loyalty. Perfect AI responses in 1 click.
        </p>
      </header>

      <main style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', color: '#4a5568' }}>
          Paste the guest's review here:
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Example: The waiter was rude and the soup was cold. Never coming back..."
          style={{ width: '100%', minHeight: '180px', padding: '20px', borderRadius: '12px', border: '2px solid #cbd5e0', marginBottom: '25px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
        />
        
        <button 
          onClick={generateResponse}
          disabled={loading}
          style={{ 
            width: '100%', padding: '18px', borderRadius: '12px', border: 'none', 
            background: loading ? '#cbd5e0' : '#e53e3e', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' 
          }}
        >
          {loading ? 'Writing...' : 'Generate Response'}
        </button>

        {response && (
          <div style={{ marginTop: '40px', background: '#f0fff4', padding: '30px', borderRadius: '12px', border: '1px solid #9ae6b4' }}>
            <h3 style={{ color: '#276749', marginTop: 0, fontSize: '1.2rem' }}>Suggested Response:</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#22543d' }}>{response}</p>
            <button 
              onClick={() => navigator.clipboard.writeText(response)}
              style={{ marginTop: '15px', background: 'none', border: 'none', color: '#276749', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
              Copy Text
            </button>
          </div>
        )}
      </main>
      
      <footer style={{ textAlign: 'center', marginTop: '50px', color: '#a0aec0', fontSize: '0.9rem' }}>
        © 2026 RestoReview.online
      </footer>
    </div>
  );
}
