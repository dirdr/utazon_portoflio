import React, { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { cn } from "../../utils/cn";
import { apiClient } from "../../services/api";
import { BehanceIcon } from "./BehanceIcon";
import { InstagramIcon } from "./InstagramIcon";
import { LinkedInIcon } from "./LinkedInIcon";

interface ContactModalProps {
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("contact.validation.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("contact.validation.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.validation.emailInvalid");
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = t("contact.validation.telephoneRequired");
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = t("contact.validation.telephoneInvalid");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.validation.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiClient.sendContact(formData);

      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            telephone: "",
            message: "",
          });
          setIsSubmitted(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(
          result.message || t("contact.validation.sendingFailed"),
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : t("contact.validation.sendingFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        message: "",
      });
      setErrors({});
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <div
      className="px-16 py-8 min-h-full bg-cover bg-center bg-no-repeat relative rounded-2xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/images/card_backgrounds/3.webp')`,
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-8 right-16 z-10 p-2 text-white transition-all duration-200 hover:scale-110 focus:outline-none"
        aria-label="Close modal"
        disabled={isSubmitting}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="mt-18 mb-18">
        <p className="text-lg text-white text-left font-nord">
          {t(
            "contact.description",
            "Share your vision, I'll help you bring it to life",
          )}
        </p>
      </div>

      {isSubmitted && (
        <div className="mb-18 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <div className="text-green-400 mb-2">
            <svg
              className="w-8 h-8 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-300 font-nord font-medium">
            {t("contact.successTitle", "Message sent successfully!")}
          </p>
          <p className="text-green-400 text-sm mt-1 font-nord font-thin">
            {t("contact.successDescription", "Thank you for reaching out.")}
          </p>
        </div>
      )}

      {errors.general && (
        <div className="mb-18 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-red-400 text-sm font-nord font-thin">
            {errors.general}
          </p>
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 mb-18">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm text-white mb-2 font-nord"
              >
                {t("contact.firstName", "First Name")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg text-white placeholder-gray-300 text-base",
                  "focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors",
                  errors.firstName ? "border-red-500" : "border-gray-500",
                )}
                style={{
                  backgroundColor: "#262626",
                  borderColor: "#565656",
                  fontFamily: 'NeueMontreal, sans-serif',
                  fontWeight: 400,
                }}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm text-white mb-2 font-nord"
              >
                {t("contact.lastName", "Last Name")}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg text-white placeholder-gray-300 text-base",
                  "focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors",
                  errors.lastName ? "border-red-500" : "border-gray-500",
                )}
                style={{
                  backgroundColor: "#262626",
                  borderColor: "#565656",
                  fontFamily: 'NeueMontreal, sans-serif',
                  fontWeight: 400,
                }}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 mb-18">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-white mb-2 font-nord"
              >
                {t("contact.email", "Email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg text-white placeholder-gray-300 text-base",
                  "focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors",
                  errors.email ? "border-red-500" : "border-gray-500",
                )}
                style={{
                  backgroundColor: "#262626",
                  borderColor: "#565656",
                  fontFamily: 'NeueMontreal, sans-serif',
                  fontWeight: 400,
                }}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block text-sm text-white mb-2 font-nord"
              >
                {t("contact.telephone", "Telephone")}
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg text-white placeholder-gray-300 text-base",
                  "focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors",
                  errors.telephone ? "border-red-500" : "border-gray-500",
                )}
                style={{
                  backgroundColor: "#262626",
                  borderColor: "#565656",
                  fontFamily: 'NeueMontreal, sans-serif',
                  fontWeight: 400,
                }}
                disabled={isSubmitting}
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-400">{errors.telephone}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm text-white mb-2 font-nord"
            >
              {t("contact.message", "Message")}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={cn(
                "w-full px-4 py-3 border rounded-lg text-white placeholder-gray-300 resize-none text-base",
                "focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors",
                errors.message ? "border-red-500" : "border-gray-500",
              )}
              style={{
                backgroundColor: "#262626",
                borderColor: "#565656",
                fontFamily: 'NeueMontreal, sans-serif',
                fontWeight: 400,
              }}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-18 pb-18">
            <div className="flex items-center gap-6 order-2 sm:order-1">
              <a
                href="https://instagram.com/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                aria-label={t("contact.social.instagram", "Instagram")}
              >
                <InstagramIcon />
                <span className="text-sm font-nord font-thin">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/antoine-vernez-b542b8290/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                aria-label={t("contact.social.linkedin", "LinkedIn")}
              >
                <LinkedInIcon />
                <span className="text-sm font-nord font-thin">LinkedIn</span>
              </a>

              <a
                href="https://behance.net/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                aria-label={t("contact.social.behance", "Behance")}
              >
                <BehanceIcon />
                <span className="text-sm font-nord font-thin">Behance</span>
              </a>
            </div>

            <div className="order-1 sm:order-2">
              <Button
                as="button"
                type="submit"
                disabled={isSubmitting}
                glint={!isSubmitting}
                className="text-sm font-normal"
              >
                {isSubmitting
                  ? t("contact.sending", "Sending...")
                  : t("contact.sendMessage", "Send Message")}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
