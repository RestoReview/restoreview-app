export default function Legal() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#333', lineHeight: '1.6' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#1e3a8a' }}>Legal Information</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2563eb', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Terms of Service</h2>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>Welcome to RestoReview. By using our website and services, you agree to these terms.</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Service:</strong> We provide an AI-powered reputation management tool for restaurants.</li>
          <li><strong>Subscriptions:</strong> Payments are processed securely via Paddle. You can cancel your subscription at any time.</li>
          <li><strong>Usage:</strong> You agree not to misuse the AI to generate offensive or illegal content.</li>
        </ul>
      </section>

      <section>
        <h2 style={{ color: '#2563eb', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Privacy Policy</h2>
        <p>Your privacy is important to us.</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Data Collection:</strong> We collect only the necessary information to provide our service (e.g., your restaurant name and language preferences).</li>
          <li><strong>Payment Data:</strong> We do not store your credit card details. All transactions are handled safely by Paddle.</li>
          <li><strong>Contact:</strong> If you have any questions, please contact us at Restoreview.connect@gmail.com.</li>
        </ul>
      </section>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>← Back to Home</a>
      </div>
    </div>
  );
}
