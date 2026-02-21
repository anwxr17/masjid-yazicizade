import React from 'react';
import { MapPin, Navigation, Car, Accessibility } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const LocationPage = ({ content }) => {
  const { t, getText } = useLanguage();

  const mapEmbedUrl = content?.google_maps_embed || 
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.0!2d33.31775!3d35.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de1762c7c33b79%3A0x7c9c5c10c8f8f8f8!2sYazicizade%20Mosque!5e0!3m2!1sen!2s!4v1";

  return (
    <div className="min-h-screen" data-testid="location-page">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-4">
            <MapPin className="h-12 w-12 text-accent mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
              {t('location.title')}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t('location.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Map and Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <Card className="overflow-hidden h-full min-h-[400px]" data-testid="map-container">
                <div className="w-full h-full min-h-[400px]">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Yazicizade Mosque Location"
                  />
                </div>
              </Card>
            </div>

            {/* Info */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Masjid Info */}
              <Card data-testid="masjid-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    {getText(content?.masjid_name) || "Yazicizade Mosque"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <address className="not-italic text-foreground leading-relaxed">
                    {getText(content?.masjid_address) || "88PF+64G, Namık Kemal Cd, Girne 99300"}
                    <br />
                    <span className="text-muted-foreground">{t('location.city')}</span>
                  </address>
                  
                  <a
                    href={content?.google_maps_link || "https://maps.app.goo.gl/ZL4Q32j5pYQ1gZGU8"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full gap-2" data-testid="open-maps-btn">
                      <Navigation className="h-4 w-4" />
                      {t('location.openMaps')}
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Masjid Image */}
              {content?.masjid_image && (
                <Card className="overflow-hidden" data-testid="masjid-image-card">
                  <img
                    src={content.masjid_image}
                    alt={getText(content?.masjid_name)}
                    className="w-full h-48 object-cover"
                  />
                </Card>
              )}

              {/* Parking Info */}
              <Card data-testid="parking-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Car className="h-5 w-5 text-accent" />
                    {t('location.parking')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {getText(content?.parking_notes) || "Free parking available on the street and nearby lots."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
