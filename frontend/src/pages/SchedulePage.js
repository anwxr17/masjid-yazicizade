import React from 'react';
import { Clock, Moon, Star, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const SchedulePage = ({ content }) => {
  const { t, getText } = useLanguage();

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen" data-testid="schedule-page">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-4">
            <Calendar className="h-12 w-12 text-accent mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
              {t('schedule.title')}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t('schedule.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-heading text-3xl text-foreground font-semibold mb-8 text-center">
            {t('schedule.daily')}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Isha */}
            <Card className="hover-lift text-center" data-testid="schedule-isha">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Moon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {t('home.isha')}
                </h3>
                <p className="text-3xl font-heading text-primary font-bold">
                  {content?.isha_time || '8:30 PM'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Daily
                </p>
              </CardContent>
            </Card>

            {/* Taraweeh */}
            <Card className="hover-lift text-center border-accent/50 bg-accent/5" data-testid="schedule-taraweeh">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {t('home.taraweeh')}
                </h3>
                <p className="text-2xl font-heading text-accent font-bold">
                  {getText(content?.taraweeh_note) || 'After Isha'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Throughout Ramadan
                </p>
              </CardContent>
            </Card>

            {/* Tahajjud */}
            {content?.tahajjud_enabled && (
              <Card className="hover-lift text-center" data-testid="schedule-tahajjud">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {t('home.tahajjud')}
                  </h3>
                  <p className="text-3xl font-heading text-primary font-bold">
                    {content?.tahajjud_time || '3:00 AM'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected Nights
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Last Updated */}
          {content?.prayer_times_updated && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              {t('home.lastUpdated')}: {formatDate(content.prayer_times_updated)}
            </p>
          )}
        </div>
      </section>

      {/* Last 10 Nights Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-semibold">
              {t('schedule.last10')}
            </h2>
            <p className="text-muted-foreground mt-2">Special programs during the blessed final nights</p>
          </div>

          {content?.last_10_nights && content.last_10_nights.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {content.last_10_nights.map((night) => (
                <Card 
                  key={night.id} 
                  className="hover-lift"
                  data-testid={`night-${night.night_number}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center">
                      <span className="text-3xl font-heading text-primary">{night.night_number}</span>
                      <span className="text-sm text-muted-foreground block">Night</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    {night.date && (
                      <p className="text-sm text-foreground">{night.date}</p>
                    )}
                    {getText(night.program) && (
                      <p className="text-xs text-muted-foreground">{getText(night.program)}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  Special Programs Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  The Last 10 Nights schedule will be announced as Ramadan progresses.
                  <br />Join our WhatsApp community for updates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Special Notes */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <Card className="border-accent/30">
            <CardContent className="py-8 px-6 text-center">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                Important Information
              </h3>
              <ul className="text-muted-foreground space-y-2 text-left max-w-lg mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Taraweeh is performed in congregation immediately after Isha prayer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Tahajjud/Qiyam programs are held on selected nights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Please arrive 10-15 minutes early for prayer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Bring your own prayer mat if possible
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;
