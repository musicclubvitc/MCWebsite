import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  HelpCircle
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../components/SocialIcons';

export const Contact = () => {
  const { content } = useContent();
  const { showToast } = useAuth();

  const contact = content?.contact || {
    email: "musicclubvitchennai@gmail.com",
    instagram: "https://www.instagram.com/vitcmusicclub",
    youtube: "https://www.youtube.com/@MusicClubVITChennai"
  };

  const faqs = content?.faqs || [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent to VITC Music Club core team!");
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
          CONTACT
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          Get In Touch
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Have questions about auditions, joining a band, or collaborating for events? Contact us via email or reach out through our official channels.
        </p>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'flex-start'
        }}
      >
        {/* Left Column: Direct Contact Info & Socials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div 
            className="glass-panel"
            style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
          >
            <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', marginBottom: '18px' }}>
              Club Contact
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--blue-sky)', flexShrink: 0 }}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Official Email</div>
                  <a href={`mailto:${contact.email}`} style={{ color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                    {contact.email}
                  </a>
                </div>
              </div>

            </div>

            {/* Social channels */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--blue-border)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
                Follow Club Updates
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {contact.instagram && (
                  <a 
                    href={contact.instagram} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-ghost"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <InstagramIcon className="w-4 h-4 text-sky-400" /> Instagram
                  </a>
                )}
                {contact.youtube && (
                  <a 
                    href={contact.youtube} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-ghost"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <YoutubeIcon className="w-4 h-4 text-sky-400" /> YouTube
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* FAQs */}
          {faqs.length > 0 && (
            <div 
              className="glass-panel"
              style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
            >
              <h4 style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle className="w-4 h-4 text-sky-400" /> Frequently Asked Questions
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.slice(0, 3).map((faq, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
                    <div style={{ fontWeight: 600, color: '#E2E8F0', fontSize: '0.85rem' }}>{faq.q}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '4px' }}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Send Message Form */}
        <div 
          className="glass-panel"
          style={{ padding: '32px', backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
        >
          <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', marginBottom: '8px' }}>
            Send Us an Email
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '24px' }}>
            Fill in the details below and your message will be dispatched directly to the club coordinators.
          </p>

          {submitted ? (
            <div 
              style={{
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                color: '#34d399'
              }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#ffffff' }}>Message Sent!</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                Thanks for reaching out. The team will reply to your VIT student email shortly.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  VIT Student Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name.year@vitstudent.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="e.g. Band Inquiries, Auditions"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Write your query here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px', fontSize: '0.92rem', marginTop: '6px' }}
              >
                <Send className="w-4 h-4" /> Send Email
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
