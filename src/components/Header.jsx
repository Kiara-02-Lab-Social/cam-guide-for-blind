import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header({ sectionLabelKey }) {
  const { t } = useApp();
  return (
    <div className="section-label" aria-hidden="true">
      {t(sectionLabelKey)}
    </div>
  );
}
