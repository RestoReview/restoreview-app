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
    if (count >= 3) return;

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
      
      // 🔥 ЛОВУШКА ДЛЯ ХИТРЕЦОВ: Если Redis заблокировал IP (статус 403)
      if (res.status === 403) {
        setCount(3); // Принудительно включаем Пейволл
        localStorage.setItem('usageCount', '3'); // Записываем в память
        setLoading(false);
        return; // Останавливаем выполнение
      }
      
      const data = await res.json();
      
      if (data.reply) {
        setReviewTranslation(data.reviewTranslation);
        setResponse(data.reply);
        setTranslation(data.translation);
        
        const newCount = count + 1;
        setCount(newCount);
        localStorage.setItem('usage
