import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

const HeroSection = ({ content }) => {
  const { t, getText } = useLanguage();

  const heroImage = content?.hero_image || 'https://images.pexels.com/photos/1652303/pexels-photo-1652303.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

  return (
    <section 
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
      </div>

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 w-full">
        <div className="max-w-3xl space-y-8 animate-slide-up">
          {/* Arabic Bismillah */}
          <p className="font-arabic text-2xl md:text-3xl text-accent">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Main Title */}
          <h1 
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground font-bold leading-tight"
            data-testid="hero-title"
          >
            {getText(content?.hero_title) || "Ramadan Taraweeh & Tahajjud at Yazicizade Mosque"}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed"
            data-testid="hero-subtitle"
          >
            {getText(content?.hero_subtitle) || "Join us on the road to Jannah through prayer, Qur'an, and community."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/schedule">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base"
                data-testid="hero-schedule-btn"
              >
                <Calendar className="h-5 w-5" />
                {t('home.viewSchedule')}
              </Button>
            </Link>
            <a 
              href={content?.google_maps_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-base"
                data-testid="hero-directions-btn"
              >
                <MapPin className="h-5 w-5" />
                {t('home.getDirections')}
              </Button>
            </a>
            <a 
              href={content?.whatsapp_community_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-base"
                data-testid="hero-whatsapp-btn"
              >
                <MessageCircle className="h-5 w-5" />
                {t('home.joinWhatsApp')}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 100V60C240 20 480 0 720 20C960 40 1200 80 1440 60V100H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
