import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PrayerWidget from '../components/home/PrayerWidget';
import AnnouncementBanner from '../components/home/AnnouncementBanner';
import FounderSection from '../components/home/FounderSection';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Heart, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage = ({ content, announcements }) => {
  const { t, getText } = useLanguage();

  const features = [
    { icon: Calendar, title: t('nav.schedule'), link: '/schedule', color: 'bg-primary' },
    { icon: MapPin, title: t('nav.location'), link: '/location', color: 'bg-accent' },
    { icon: BookOpen, title: t('nav.activities'), link: '/activities', color: 'bg-primary' },
    { icon: Users, title: t('nav.join'), link: '/join', color: 'bg-accent' },
    { icon: Heart, title: t('nav.donate'), link: '/donate', color: 'bg-primary' },
  ];

  return (
    <div data-testid="home-page">
      {/* Announcement Banner */}
      <AnnouncementBanner announcements={announcements} />

      {/* Hero Section */}
      <HeroSection content={content} />

      {/* Prayer Widget Section */}
      <section className="py-16 md:py-24 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Prayer Widget */}
            <div className="animate-slide-up">
              <PrayerWidget content={content} />
            </div>

            {/* Quick Links */}
            <div className="space-y-4 animate-slide-up animation-delay-150">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground font-semibold mb-6">
                Explore
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Link key={feature.link} to={feature.link}>
                    <Card 
                      className="hover-lift cursor-pointer border-border/50 hover:border-primary/30"
                      data-testid={`quick-link-${feature.link.replace('/', '')}`}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-medium text-foreground">{feature.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <Card className="border-accent/30 bg-accent/5 mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{t('join.group')}</h3>
                      <p className="text-sm text-muted-foreground">Stay connected with the community</p>
                    </div>
                    <a 
                      href={content?.whatsapp_group_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-green-500 hover:bg-green-600" data-testid="home-whatsapp-cta">
                        Join
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements && announcements.filter(a => !a.is_banner && a.is_active).length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-semibold text-center mb-12">
              Latest Updates
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.filter(a => !a.is_banner && a.is_active).slice(0, 3).map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="hover-lift"
                  data-testid={`announcement-${announcement.id}`}
                >
                  {announcement.image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={announcement.image_url} 
                        alt={getText(announcement.title)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {getText(announcement.title)}
                    </h3>
                    <p className="text-muted-foreground">
                      {getText(announcement.content)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Founder Section */}
      <FounderSection content={content} />
    </div>
  );
};

export default HomePage;
