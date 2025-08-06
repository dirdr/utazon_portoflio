import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ContactModalProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitted(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-2xl font-semibold text-foreground">
            {t('contact.title', 'Contact')}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted hover:text-foreground transition-colors p-1"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success message */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <div className="text-green-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-300 font-medium">Message sent successfully!</p>
            <p className="text-green-400 text-sm mt-1">Thank you for reaching out.</p>
          </div>
        )}

        {/* Contact form */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-background text-foreground',
                  'focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.name ? 'border-red-500' : 'border-border'
                )}
                placeholder="Your name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-background text-foreground',
                  'focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.email ? 'border-red-500' : 'border-border'
                )}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Subject field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-background text-foreground',
                  'focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.subject ? 'border-red-500' : 'border-border'
                )}
                placeholder="Project inquiry"
                disabled={isSubmitting}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
              )}
            </div>

            {/* Message field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none',
                  'focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.message ? 'border-red-500' : 'border-border'
                )}
                placeholder="Tell me about your project or inquiry..."
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex gap-3 pt-4">
              <Button
                as="button"
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border border-border text-foreground hover:bg-muted/10"
              >
                Cancel
              </Button>
              <Button
                as="button"
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                glint={!isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        )}
    </div>
  );
};