import React, { useState } from 'react';
import { Heart, Copy, Check, Building2, CreditCard, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const DonatePage = ({ content }) => {
  const { t, getText } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyIBAN = async () => {
    const iban = content?.iban || 'TR51 0001 0021 0498 0591 7850 01';
    try {
      await navigator.clipboard.writeText(iban.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen" data-testid="donate-page">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 text-accent mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
              {t('donate.title')}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t('donate.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Donation Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Explanation */}
          <Card className="mb-8" data-testid="donation-explanation">
            <CardContent className="py-8 px-6 text-center">
              <p className="text-lg text-foreground leading-relaxed">
                {getText(content?.donation_explanation) || 
                  "Your contributions help support masjid activities, Qur'an programs, and Ramadan arrangements."}
              </p>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="border-accent/30" data-testid="bank-details">
            <CardHeader className="text-center border-b border-border">
              <CardTitle className="font-heading text-2xl text-foreground">
                Bank Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 px-6 space-y-6">
              {/* Bank Name */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-semibold text-foreground text-lg" data-testid="bank-name">
                    {content?.bank_name || 'Ziraat Bank'}
                  </p>
                </div>
              </div>

              {/* Account Name */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-semibold text-foreground text-lg" data-testid="account-name">
                    {content?.account_name || 'SALIH SAMIER S OTMAN'}
                  </p>
                </div>
              </div>

              {/* IBAN */}
              <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg border-2 border-accent/30">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p 
                    className="font-mono font-semibold text-foreground text-lg break-all"
                    data-testid="iban-display"
                  >
                    {content?.iban || 'TR51 0001 0021 0498 0591 7850 01'}
                  </p>
                </div>
                <Button
                  onClick={copyIBAN}
                  variant={copied ? "default" : "outline"}
                  className={`gap-2 flex-shrink-0 ${copied ? 'bg-green-500 hover:bg-green-500' : ''}`}
                  data-testid="copy-iban-btn"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t('donate.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t('donate.copyIBAN')}
                    </>
                  )}
                </Button>
              </div>

              {/* QR Code */}
              {content?.donation_qr_image && (
                <div className="text-center pt-4">
                  <img
                    src={content.donation_qr_image}
                    alt="Donation QR Code"
                    className="w-48 h-48 mx-auto rounded-lg shadow-md"
                    data-testid="donation-qr"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Scan to copy IBAN
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transparency Note */}
          <Card className="mt-8 bg-muted/30" data-testid="transparency-note">
            <CardContent className="py-6 px-6">
              <p className="text-center text-sm text-muted-foreground">
                <Heart className="h-4 w-4 inline-block mr-2 text-accent" />
                {t('donate.transparency')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
