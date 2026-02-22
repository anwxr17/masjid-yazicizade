import React from 'react';
import { Clock, Moon, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '../ui/card';

const PrayerWidget = ({ content }) => {
  const { t, getText } = useLanguage();

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const prayers = [
    {
      name: t('home.isha'),
      time: content?.isha_time || '8:30 PM',
      icon: Moon,
      highlight: false
    },
    {
      name: t('home.taraweeh'),
      time: getText(content?.taraweeh_note) || 'After Isha',
      icon: Star,
      highlight: true
    },
    ...(content?.tahajjud_enabled ? [{
      name: t('home.tahajjud'),
      time: content?.tahajjud_time || '3:00 AM',
      icon: Moon,
      highlight: false
    }] : [])
  ];

  return (
    <Card 
      className="glass-card border-2 border-accent/30 overflow-hidden"
      data-testid="prayer-widget"
    >
      <div className="bg-primary px-6 py-4">
        <h3 className="font-heading text-xl text-primary-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('home.tonight')}
        </h3>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {prayers.map((prayer, index) => (
            <div
              key={index}
              className={`px-6 py-4 flex items-center justify-between transition-colors ${
                prayer.highlight ? 'bg-accent/10' : ''
              }`}
              data-testid={`prayer-${prayer.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  prayer.highlight ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <prayer.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{prayer.name}</span>
              </div>
              <span className={`font-heading text-lg ${
                prayer.highlight ? 'text-accent font-semibold' : 'text-foreground'
              }`} dir="ltr">
                {prayer.time}
              </span>
            </div>
          ))}
        </div>
        {content?.prayer_times_updated && (
          <div className="px-6 py-3 bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              {t('home.lastUpdated')}: {formatDate(content.prayer_times_updated)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerWidget;
