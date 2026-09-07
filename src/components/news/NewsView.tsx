// ============================================================================
// PROJECT AIRFRAME - AVIATION NEWS NETWORK FEED VIEW
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatGameDate } from '../../i18n';

export const NewsView: React.FC = () => {
  const { company } = useGameStore();
  const { t, locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const newsList = company.newsHistory || [];

  const filteredNews = selectedCategory === 'all'
    ? newsList
    : newsList.filter(n => n.category === selectedCategory);

  const categories = [
    { id: 'all', labelKey: 'news.categories.all' },
    { id: 'commercial', labelKey: 'news.categories.commercial' },
    { id: 'engineering', labelKey: 'news.categories.engineering' },
    { id: 'safety', labelKey: 'news.categories.safety' },
    { id: 'financial', labelKey: 'news.categories.financial' }
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              GLOBAL AVIATION INTELLIGENCE // DISPATCHES
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('news.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {t('news.subtitle')}
            </p>
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#171818] p-1.5 rounded-xl border border-[rgba(255,255,255,0.07)] text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E1F1F] text-[#F5F5F3] font-bold border border-[rgba(255,255,255,0.12)] shadow-sm'
                    : 'text-[#A3A39C] hover:text-[#F5F5F3] hover:bg-[#1E1F1F]'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial News Stream */}
        <div className="flex flex-col gap-5 max-w-4xl">
          {filteredNews.length === 0 ? (
            <div className="p-16 text-center text-sm text-[#73736C] bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-2xl">
              No news articles published in this category yet. Advance the simulation to receive live industry reports.
            </div>
          ) : (
            filteredNews.map(article => (
              <article
                key={article.id}
                className="bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] rounded-2xl p-8 flex flex-col gap-4 shadow-sm transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-mono font-semibold text-[#73736C]">
                    {formatGameDate(article.publishedDate, locale)}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#242525] text-xs font-mono font-semibold text-[#38bdf8] uppercase">
                    {article.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F3] leading-snug tracking-tight">
                  {article.headline}
                </h2>

                <p className="text-sm md:text-base text-[#A3A39C] leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-[#73736C] pt-4 border-t border-[rgba(255,255,255,0.06)] font-mono">
                  <span>Source: {article.source}</span>
                  <span className="capitalize">{article.impactType || 'General Industry'}</span>
                </div>
              </article>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
