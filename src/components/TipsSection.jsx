import React from 'react';
import { useApp } from '../context/AppContext';

export default function TipsSection() {
  const { t, language } = useApp();
  
  // Read localized tips array
  const tips = t('tips') || [];

  return (
    <div className="tips-section">
      <h2>{t('tipsTitle')}</h2>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className="tip">
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
