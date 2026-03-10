import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Bell, Users, LogOut, Save,
  Upload, Trash2, Plus, Check, X, Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = ({ content, setContent, announcements, setAnnouncements, refreshContent }) => {
  const { t } = useLanguage();
  const { admin, logout, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localContent, setLocalContent] = useState(content || {});
  const [volunteers, setVolunteers] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: { en: '', ar: '', tr: '' },
    content: { en: '', ar: '', tr: '' },
    is_banner: false,
    is_active: true
  });

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  const fetchVolunteers = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API}/admin/volunteers`, getAuthHeaders());
      setVolunteers(response.data);
    } catch (err) {
      console.error('Failed to fetch volunteers:', err);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`${API}/admin/content`, localContent, getAuthHeaders());
      setContent(response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/admin/upload`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      setLocalContent(prev => ({
        ...prev,
        [field]: response.data.url
      }));
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await axios.post(`${API}/admin/announcements`, newAnnouncement, getAuthHeaders());
      setAnnouncements(prev => [...prev, response.data]);
      setNewAnnouncement({
        title: { en: '', ar: '', tr: '' },
        content: { en: '', ar: '', tr: '' },
        is_banner: false,
        is_active: true
      });
    } catch (err) {
      console.error('Failed to create announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API}/admin/announcements/${id}`, getAuthHeaders());
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleDeleteVolunteer = async (id) => {
    try {
      await axios.delete(`${API}/admin/volunteers/${id}`, getAuthHeaders());
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const updateNestedContent = (field, lang, value) => {
    setLocalContent(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-xl font-semibold">{t('admin.dashboard')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {admin?.name || admin?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              {t('admin.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.content')}</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.announcements')}</span>
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.volunteers')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveContent}
                disabled={saving}
                className="gap-2"
                data-testid="save-content-btn"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t('admin.saved')}
                  </>
                ) : saving ? (
                  t('admin.saving')
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t('admin.save')}
                  </>
                )}
              </Button>
            </div>

            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Hero Title ({lang.toUpperCase()})</Label>
                      <Input
                        value={localContent.hero_title?.[lang] || ''}
                        onChange={(e) => updateNestedContent('hero_title', lang, e.target.value)}
                        data-testid={`hero-title-${lang}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Hero Subtitle ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={localContent.hero_subtitle?.[lang] || ''}
                        onChange={(e) => updateNestedContent('hero_subtitle', lang, e.target.value)}
                        rows={2}
                        data-testid={`hero-subtitle-${lang}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image')}
                      className="max-w-xs"
                    />
                    {localContent.hero_image && (
                      <img src={localContent.hero_image} alt="Hero" className="h-16 rounded" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prayer Times */}
            <Card>
              <CardHeader>
                <CardTitle>Prayer Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Isha Time</Label>
                    <Input
                      value={localContent.isha_time || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, isha_time: e.target.value }))}
                      placeholder="8:30 PM"
                      data-testid="isha-time-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tahajjud Time</Label>
                    <Input
                      value={localContent.tahajjud_time || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, tahajjud_time: e.target.value }))}
                      placeholder="3:00 AM"
                      data-testid="tahajjud-time-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tahajjud Enabled</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={localContent.tahajjud_enabled || false}
                        onCheckedChange={(checked) => setLocalContent(prev => ({ ...prev, tahajjud_enabled: checked }))}
                        data-testid="tahajjud-enabled"
                      />
                      <span className="text-sm text-muted-foreground">
                        {localContent.tahajjud_enabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Taraweeh Note ({lang.toUpperCase()})</Label>
                      <Input
                        value={localContent.taraweeh_note?.[lang] || ''}
                        onChange={(e) => updateNestedContent('taraweeh_note', lang, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Masjid Info */}
            <Card>
              <CardHeader>
                <CardTitle>Masjid Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Masjid Name ({lang.toUpperCase()})</Label>
                      <Input
                        value={localContent.masjid_name?.[lang] || ''}
                        onChange={(e) => updateNestedContent('masjid_name', lang, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Address ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={localContent.masjid_address?.[lang] || ''}
                        onChange={(e) => updateNestedContent('masjid_address', lang, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Link</Label>
                  <Input
                    value={localContent.google_maps_link || ''}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, google_maps_link: e.target.value }))}
                    placeholder="https://www.google.com/maps/..."
                    data-testid="maps-link-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Embed URL</Label>
                  <Input
                    value={localContent.google_maps_embed || ''}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, google_maps_embed: e.target.value }))}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Parking Notes ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={localContent.parking_notes?.[lang] || ''}
                        onChange={(e) => updateNestedContent('parking_notes', lang, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Links */}
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Group Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>WhatsApp Group Link</Label>
                  <Input
                    value={localContent.whatsapp_group_link || ''}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, whatsapp_group_link: e.target.value }))}
                    placeholder="https://chat.whatsapp.com/..."
                    data-testid="whatsapp-group-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Masjid Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Masjid Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Gallery Title ({lang.toUpperCase()})</Label>
                      <Input
                        value={localContent.gallery_title?.[lang] || ''}
                        onChange={(e) => updateNestedContent('gallery_title', lang, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Gallery Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(localContent.gallery_images || []).map((image, index) => (
                      <div key={image.id || index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newImages = localContent.gallery_images.filter((_, i) => i !== index);
                            setLocalContent(prev => ({ ...prev, gallery_images: newImages }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Input
                          className="mt-2 text-xs"
                          placeholder="Caption (EN)"
                          value={image.caption?.en || ''}
                          onChange={(e) => {
                            const newImages = [...(localContent.gallery_images || [])];
                            newImages[index] = {
                              ...newImages[index],
                              caption: { ...newImages[index].caption, en: e.target.value }
                            };
                            setLocalContent(prev => ({ ...prev, gallery_images: newImages }));
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Add New Image (URL)</Label>
                      <Input
                        id="new-gallery-url"
                        placeholder="Paste image URL here..."
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const urlInput = document.getElementById('new-gallery-url');
                        if (urlInput.value) {
                          const newImage = {
                            id: Date.now().toString(),
                            url: urlInput.value,
                            caption: { en: '', ar: '', tr: '' },
                            order: (localContent.gallery_images?.length || 0) + 1
                          };
                          setLocalContent(prev => ({
                            ...prev,
                            gallery_images: [...(prev.gallery_images || []), newImage]
                          }));
                          urlInput.value = '';
                        }
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Image
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Upload images via the Upload button or paste URLs directly. Click Save Changes to apply.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      value={localContent.bank_name || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, bank_name: e.target.value }))}
                      data-testid="bank-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      value={localContent.account_name || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, account_name: e.target.value }))}
                      data-testid="account-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input
                      value={localContent.iban || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, iban: e.target.value }))}
                      data-testid="iban-input"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Donation Explanation ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={localContent.donation_explanation?.[lang] || ''}
                        onChange={(e) => updateNestedContent('donation_explanation', lang, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Founder */}
            <Card>
              <CardHeader>
                <CardTitle>Founder Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Founder Name</Label>
                    <Input
                      value={localContent.founder_name || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, founder_name: e.target.value }))}
                      data-testid="founder-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alias (Arabic Name)</Label>
                    <Input
                      value={localContent.founder_alias || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, founder_alias: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Founder Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'founder_image')}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={localContent.founder_phone || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, founder_phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={localContent.founder_email || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, founder_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={localContent.founder_instagram || ''}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, founder_instagram: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Bio ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={localContent.founder_bio?.[lang] || ''}
                        onChange={(e) => updateNestedContent('founder_bio', lang, e.target.value)}
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            {/* Create New */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Title ({lang.toUpperCase()})</Label>
                      <Input
                        value={newAnnouncement.title[lang]}
                        onChange={(e) => setNewAnnouncement(prev => ({
                          ...prev,
                          title: { ...prev.title, [lang]: e.target.value }
                        }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {['en', 'ar', 'tr'].map(lang => (
                    <div key={lang} className="space-y-2">
                      <Label>Content ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={newAnnouncement.content[lang]}
                        onChange={(e) => setNewAnnouncement(prev => ({
                          ...prev,
                          content: { ...prev.content, [lang]: e.target.value }
                        }))}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newAnnouncement.is_banner}
                      onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, is_banner: checked }))}
                    />
                    <Label>Show as Banner</Label>
                  </div>
                  <Button onClick={handleCreateAnnouncement} className="gap-2" data-testid="create-announcement-btn">
                    <Plus className="h-4 w-4" />
                    Create Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Announcements */}
            <div className="space-y-4">
              {announcements?.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {announcement.title?.en || 'Untitled'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.content?.en || ''}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {announcement.is_banner && (
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Banner</span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded ${announcement.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {announcement.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-destructive hover:bg-destructive/10"
                        data-testid={`delete-announcement-${announcement.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!announcements || announcements.length === 0) && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No announcements yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-6">
            <div className="space-y-4">
              {volunteers.map((volunteer) => (
                <Card key={volunteer.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{volunteer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{volunteer.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Skills</p>
                          <p className="text-sm">{volunteer.skills || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Availability</p>
                          <p className="text-sm">{volunteer.availability || '-'}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVolunteer(volunteer.id)}
                        className="text-destructive hover:bg-destructive/10"
                        data-testid={`delete-volunteer-${volunteer.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {volunteers.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No volunteer submissions yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
