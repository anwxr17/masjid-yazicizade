import React from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '../ui/card';

const FounderSection = ({ content }) => {
  const { t, getText } = useLanguage();

  const founderImage = content?.founder_image || 'https://customer-assets.emergentagent.com/job_road-to-jannah/artifacts/2syzy3fc_image.png';

  return (
    <section 
      className="py-16 md:py-24 bg-muted/30"
      data-testid="founder-section"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-semibold">
            {t('founder.title')}
          </h2>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-auto min-h-[300px]">
                <img
                  src={founderImage}
                  alt={content?.founder_name || "Anwar Abdulkadir"}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  data-testid="founder-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-accent font-medium mb-2">
                    {getText(content?.founder_title) || "Founder of roadtojannah Initiative"}
                  </p>
                  <h3 
                    className="font-heading text-2xl md:text-3xl text-foreground font-semibold"
                    data-testid="founder-name"
                  >
                    {content?.founder_name || "Anwar Abdulkadir"}
                  </h3>
                  <p className="text-muted-foreground font-arabic text-lg mt-1">
                    {content?.founder_alias || "Abu Eisa (أبو عيسى)"}
                  </p>
                </div>

                <p 
                  className="text-foreground/80 leading-relaxed"
                  data-testid="founder-bio"
                >
                  {getText(content?.founder_bio) || "Anwar Abdulkadir, also known as Abu Eisa (أبو عيسى), founded the roadtojannah Initiative to create a structured space for prayer, Qur'an, and community engagement during Ramadan and beyond."}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground">{t('founder.contact')}</h4>
                  <div className="flex flex-col gap-2">
                    {content?.founder_phone && (
                      <a
                        href={`tel:${content.founder_phone}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        data-testid="founder-phone"
                      >
                        <Phone className="h-4 w-4" />
                        {content.founder_phone}
                      </a>
                    )}
                    {content?.founder_email && (
                      <a
                        href={`mailto:${content.founder_email}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        data-testid="founder-email"
                      >
                        <Mail className="h-4 w-4" />
                        {content.founder_email}
                      </a>
                    )}
                    {content?.founder_instagram && (
                      <a
                        href={`https://instagram.com/${content.founder_instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        data-testid="founder-instagram"
                      >
                        <Instagram className="h-4 w-4" />
                        {content.founder_instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FounderSection;
