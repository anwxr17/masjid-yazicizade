import React, { useState } from 'react';
import { MessageCircle, Users, Heart, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const JoinPage = ({ content }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skills: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await axios.post(`${API}/volunteer`, formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', skills: '', availability: '' });
    } catch (err) {
      setError(t('join.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen" data-testid="join-page">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 text-accent mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
              {t('join.title')}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t('join.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Group */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-md mx-auto mb-16">
            {/* Group */}
            <Card className="hover-lift border-green-200 dark:border-green-900" data-testid="whatsapp-group-card">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {t('join.group')}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t('join.groupDesc')}
                </p>
                <a
                  href={content?.whatsapp_group_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 gap-2" data-testid="join-group-btn">
                    <MessageCircle className="h-4 w-4" />
                    {t('join.joinGroup')}
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Volunteer Form */}
          <Card className="max-w-2xl mx-auto" data-testid="volunteer-form-card">
            <CardHeader className="text-center">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-accent-foreground" />
              </div>
              <CardTitle className="font-heading text-2xl">
                {t('join.volunteer')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8" data-testid="volunteer-success">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {t('join.thankYou')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('join.weWillContact')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    {t('join.submitAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('join.name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('join.namePlaceholder')}
                      data-testid="volunteer-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('join.phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={t('join.phonePlaceholder')}
                      data-testid="volunteer-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">{t('join.skills')}</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder={t('join.skillsPlaceholder')}
                      rows={3}
                      data-testid="volunteer-skills"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">{t('join.availability')}</Label>
                    <Input
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      placeholder={t('join.availabilityPlaceholder')}
                      data-testid="volunteer-availability"
                    />
                  </div>

                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={submitting}
                    data-testid="volunteer-submit"
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t('join.submit')}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;
