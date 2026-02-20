import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Heart, MessageCircle, Instagram, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

const Footer = ({ content }) => {
  const { t, getText } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-primary font-heading text-lg font-bold">ر</span>
              </div>
              <span className="font-heading text-2xl font-semibold">roadtojannah</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {getText(content?.hero_subtitle) || "Join us on the road to Jannah through prayer, Qur'an, and community."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-accent">
              {t('footer.quickLinks')}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/schedule" 
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
                data-testid="footer-schedule-link"
              >
                <Calendar className="h-4 w-4" />
                {t('nav.schedule')}
              </Link>
              <Link 
                to="/location" 
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
                data-testid="footer-location-link"
              >
                <MapPin className="h-4 w-4" />
                {t('nav.location')}
              </Link>
              <Link 
                to="/donate" 
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
                data-testid="footer-donate-link"
              >
                <Heart className="h-4 w-4" />
                {t('nav.donate')}
              </Link>
            </nav>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-accent">
              {getText(content?.masjid_name) || "Yazicizade Mosque"}
            </h3>
            <address className="not-italic text-primary-foreground/80 text-sm leading-relaxed">
              {getText(content?.masjid_address) || "88PF+64G, Namık Kemal Cd, Girne 99300"}
            </address>
            <a
              href={content?.google_maps_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm"
              data-testid="footer-maps-link"
            >
              <MapPin className="h-4 w-4" />
              {t('location.openMaps')}
            </a>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-accent">
              {t('footer.connect')}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={content?.whatsapp_community_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-whatsapp-btn"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t('join.community')}
                </Button>
              </a>
              {content?.founder_instagram && (
                <a
                  href={`https://instagram.com/${content.founder_instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
                  data-testid="footer-instagram-link"
                >
                  <Instagram className="h-4 w-4" />
                  {content.founder_instagram}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © roadtojannah {currentYear}. {t('footer.rights')}.
          </p>
          <Link
            to="/admin"
            className="text-primary-foreground/40 hover:text-primary-foreground/60 text-xs transition-colors"
            data-testid="footer-admin-link"
          >
            {t('nav.admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
