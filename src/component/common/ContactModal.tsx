import React, { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { cn } from "../../utils/cn";
import { apiClient } from "../../services/api";

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
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Telephone is required";
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Please enter a valid telephone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
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
        throw new Error(result.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Failed to send message",
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
      className="p-8 min-h-full bg-cover bg-center bg-no-repeat relative rounded-2xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/images/card_backgrounds/3.webp')`
      }}
    >
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-200 transition-colors p-1"
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg text-white text-center font-nord">
          {t(
            "contact.description",
            "Share your vision, I'll help you bring it to life",
          )}
        </p>
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
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
          <p className="text-green-300 font-medium">
            {t("contact.successTitle", "Message sent successfully!")}
          </p>
          <p className="text-green-400 text-sm mt-1">
            {t("contact.successDescription", "Thank you for reaching out.")}
          </p>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-red-400 text-sm">{errors.general}</p>
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-white mb-2 font-nord"
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
                  "w-full px-4 py-3 border rounded-xl text-white placeholder-gray-300 font-nord",
                  "focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                  errors.firstName ? "border-red-500" : "border-gray-500",
                )}
                style={{ backgroundColor: '#262626', borderColor: '#565656' }}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-white mb-2 font-nord"
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
                  "w-full px-3 py-2 border rounded-md text-white placeholder-gray-300 font-nord",
                  "focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                  errors.lastName ? "border-red-500" : "border-gray-500",
                )}
                style={{ backgroundColor: '#262626', borderColor: '#565656' }}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2 font-nord"
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
                  "w-full px-3 py-2 border rounded-md text-white placeholder-gray-300 font-nord",
                  "focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                  errors.email ? "border-red-500" : "border-gray-500",
                )}
                style={{ backgroundColor: '#262626', borderColor: '#565656' }}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-white mb-2 font-nord"
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
                  "w-full px-3 py-2 border rounded-md text-white placeholder-gray-300 font-nord",
                  "focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                  errors.telephone ? "border-red-500" : "border-gray-500",
                )}
                style={{ backgroundColor: '#262626', borderColor: '#565656' }}
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
              className="block text-sm font-medium text-white mb-2 font-nord"
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
                "w-full px-4 py-3 border rounded-xl text-white placeholder-gray-300 resize-none font-nord",
                "focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                errors.message ? "border-red-500" : "border-gray-500",
              )}
              style={{ 
                backgroundColor: '#262626', 
                borderColor: '#565656', 
                fontFamily: 'Nord, "Crimson Text", "Times New Roman", serif'
              }}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="flex items-center gap-4 order-2 sm:order-1">
              <a
                href="https://behance.net/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Behance"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.150391"
                    y="0.0612793"
                    width="18"
                    height="18"
                    rx="2.90566"
                    fill="white"
                  />
                  <path
                    d="M6.99919 5.49536C7.34117 5.49536 7.65709 5.5197 7.94695 5.5927C8.23682 5.64137 8.47457 5.74175 8.68627 5.86343C8.89797 5.9851 9.0543 6.15848 9.16178 6.38054C9.266 6.60259 9.32137 6.87332 9.32137 7.16838C9.32137 7.51211 9.2432 7.80717 9.05756 8.02922C8.89797 8.25128 8.63742 8.449 8.31824 8.59501C8.76769 8.71668 9.10967 8.93874 9.31811 9.2338C9.52655 9.52886 9.66008 9.89692 9.66008 10.3167C9.66008 10.6604 9.58192 10.9555 9.44838 11.2019C9.31811 11.4483 9.10641 11.6703 8.86866 11.8163C8.6309 11.9654 8.34104 12.0871 8.02512 12.1601C7.7092 12.2331 7.39328 12.2817 7.07736 12.2817L3.54688 12.2878V5.49536H6.99919ZM6.78749 8.25128C7.07736 8.25128 7.31511 8.17827 7.4975 8.05356C7.67989 7.92884 7.76131 7.70983 7.76131 7.4391C7.76131 7.29005 7.73525 7.14404 7.68314 7.04671C7.63103 6.94937 7.55287 6.87332 7.44539 6.80032C7.34117 6.75165 7.23369 6.70298 7.10341 6.67864C6.97314 6.65431 6.8396 6.65431 6.68327 6.65431H5.15579V8.25432C5.15579 8.25128 6.78749 8.25128 6.78749 8.25128ZM6.86566 11.1562C7.02525 11.1562 7.18158 11.1319 7.31511 11.1076C7.44539 11.0832 7.57892 11.0346 7.68314 10.9585C7.78736 10.8825 7.86879 10.8095 7.94695 10.6878C7.99906 10.5661 8.05117 10.4171 8.05117 10.2437C8.05117 9.89996 7.94695 9.65357 7.73525 9.48019C7.52355 9.33114 7.23369 9.25813 6.89171 9.25813H5.15579V11.1532H6.86566V11.1562Z"
                    fill="black"
                  />
                  <path
                    d="M11.9473 11.3096C12.1397 11.5061 12.4269 11.6028 12.8088 11.6028C13.0722 11.6028 13.312 11.5303 13.5044 11.4063C13.6969 11.2582 13.8153 11.1132 13.8626 10.9651H15.0349C14.8425 11.5514 14.5554 11.9685 14.1735 12.2375C13.7916 12.4823 13.3357 12.6274 12.7851 12.6274C12.4032 12.6274 12.0657 12.5549 11.7549 12.4309C11.4441 12.31 11.2043 12.1378 10.9882 11.8929C10.7721 11.6723 10.6063 11.4033 10.5086 11.086C10.3902 10.7686 10.3398 10.4271 10.3398 10.0342C10.3398 9.66846 10.3872 9.3239 10.5086 9.00655C10.63 8.6892 10.7957 8.42021 11.0118 8.17539C11.2279 7.95476 11.4914 7.7583 11.7786 7.6374C12.0894 7.51651 12.4002 7.44095 12.7851 7.44095C13.1936 7.44095 13.5518 7.51348 13.8626 7.68576C14.1735 7.85804 14.4133 8.05147 14.6057 8.34465C14.7981 8.61364 14.9402 8.93099 15.0379 9.27252C15.0853 9.61405 15.109 9.95861 15.0853 10.3485H11.6128C11.6128 10.7475 11.7549 11.1132 11.9473 11.3096ZM13.4571 8.74058C13.2883 8.5683 13.0249 8.47159 12.714 8.47159C12.4979 8.47159 12.3322 8.51995 12.1871 8.59248C12.042 8.66502 11.9473 8.76476 11.8526 8.86148C11.7578 8.95819 11.7075 9.08211 11.6838 9.20301C11.6602 9.3239 11.6365 9.42364 11.6365 9.52036H13.7916C13.7442 9.15767 13.6229 8.91286 13.4571 8.74058ZM11.3493 6.17456H14.0314V6.83344H11.3493V6.17456Z"
                    fill="black"
                  />
                </svg>
              </a>

              <a
                href="https://instagram.com/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_891_355)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.43994 0.115279C6.39966 0.0710975 6.70566 0.0612793 9.15039 0.0612793C11.5951 0.0612793 11.9011 0.0719156 12.86 0.115279C13.8189 0.158643 14.4735 0.311643 15.0462 0.53337C15.6459 0.760007 16.19 1.11428 16.64 1.57246C17.0982 2.02164 17.4517 2.56492 17.6775 3.16546C17.9 3.73819 18.0522 4.39273 18.0964 5.35001C18.1406 6.31137 18.1504 6.61737 18.1504 9.06128C18.1504 11.506 18.1398 11.812 18.0964 12.7717C18.053 13.729 17.9 14.3836 17.6775 14.9563C17.4517 15.5569 17.0976 16.1011 16.64 16.5509C16.19 17.0091 15.6459 17.3626 15.0462 17.5884C14.4735 17.8109 13.8189 17.9631 12.8617 18.0073C11.9011 18.0515 11.5951 18.0613 9.15039 18.0613C6.70566 18.0613 6.39966 18.0506 5.43994 18.0073C4.48266 17.9639 3.82812 17.8109 3.25539 17.5884C2.65478 17.3625 2.11061 17.0085 1.66075 16.5509C1.20288 16.1015 0.848557 15.5575 0.622482 14.9571C0.400754 14.3844 0.248572 13.7298 0.204391 12.7726C0.160209 11.8112 0.150391 11.5052 0.150391 9.06128C0.150391 6.61655 0.161027 6.31055 0.204391 5.35164C0.247754 4.39273 0.400754 3.73819 0.622482 3.16546C0.848891 2.56498 1.20349 2.02108 1.66157 1.57164C2.11079 1.11387 2.65441 0.759551 3.25457 0.53337C3.8273 0.311643 4.48185 0.159461 5.43912 0.115279H5.43994ZM12.7872 1.73528C11.8381 1.69192 11.5534 1.68292 9.15039 1.68292C6.74739 1.68292 6.46266 1.69192 5.51357 1.73528C4.63566 1.77537 4.15948 1.92182 3.84203 2.04537C3.4223 2.20901 3.12203 2.40292 2.80703 2.71792C2.50843 3.00841 2.27863 3.36206 2.13448 3.75292C2.01094 4.07037 1.86448 4.54655 1.82439 5.42446C1.78103 6.37355 1.77203 6.65828 1.77203 9.06128C1.77203 11.4643 1.78103 11.749 1.82439 12.6981C1.86448 13.576 2.01094 14.0522 2.13448 14.3696C2.27848 14.7599 2.50839 15.1142 2.80703 15.4046C3.09748 15.7033 3.45175 15.9332 3.84203 16.0772C4.15948 16.2007 4.63566 16.3472 5.51357 16.3873C6.46266 16.4306 6.74657 16.4396 9.15039 16.4396C11.5542 16.4396 11.8381 16.4306 12.7872 16.3873C13.6651 16.3472 14.1413 16.2007 14.4588 16.0772C14.8785 15.9136 15.1788 15.7196 15.4938 15.4046C15.7924 15.1142 16.0223 14.7599 16.1663 14.3696C16.2898 14.0522 16.4363 13.576 16.4764 12.6981C16.5198 11.749 16.5288 11.4643 16.5288 9.06128C16.5288 6.65828 16.5198 6.37355 16.4764 5.42446C16.4363 4.54655 16.2898 4.07037 16.1663 3.75292C16.0027 3.33319 15.8088 3.03292 15.4938 2.71792C15.2032 2.41934 14.8496 2.18954 14.4588 2.04537C14.1413 1.92182 13.6651 1.77537 12.7872 1.73528ZM8.00085 11.8357C8.64284 12.103 9.3577 12.139 10.0233 11.9378C10.689 11.7365 11.2641 11.3104 11.6504 10.7322C12.0368 10.154 12.2104 9.45963 12.1417 8.76764C12.073 8.07565 11.7661 7.42898 11.2736 6.9381C10.9596 6.62431 10.5799 6.38403 10.1619 6.23458C9.74394 6.08513 9.29801 6.03021 8.85625 6.07378C8.41449 6.11735 7.98788 6.25833 7.60714 6.48657C7.2264 6.7148 6.901 7.02462 6.65437 7.3937C6.40773 7.76279 6.246 8.18197 6.18081 8.62107C6.11563 9.06016 6.1486 9.50825 6.27738 9.93307C6.40615 10.3579 6.62751 10.7489 6.92553 11.0779C7.22354 11.4069 7.59079 11.6657 8.00085 11.8357ZM5.8793 5.79019C6.30887 5.36062 6.81883 5.01987 7.38009 4.78739C7.94134 4.55491 8.54289 4.43526 9.15039 4.43526C9.75789 4.43526 10.3594 4.55491 10.9207 4.78739C11.4819 5.01987 11.9919 5.36062 12.4215 5.79019C12.851 6.21975 13.1918 6.72972 13.4243 7.29098C13.6568 7.85223 13.7764 8.45378 13.7764 9.06128C13.7764 9.66878 13.6568 10.2703 13.4243 10.8316C13.1918 11.3928 12.851 11.9028 12.4215 12.3324C11.5539 13.1999 10.3773 13.6873 9.15039 13.6873C7.92349 13.6873 6.74685 13.1999 5.8793 12.3324C5.01175 11.4648 4.52437 10.2882 4.52437 9.06128C4.52437 7.83438 5.01175 6.65774 5.8793 5.79019ZM14.8024 5.12419C14.9088 5.02377 14.9941 4.90302 15.053 4.76908C15.1119 4.63513 15.1434 4.49073 15.1455 4.3444C15.1477 4.19808 15.1204 4.05282 15.0654 3.91721C15.0104 3.78161 14.9287 3.65842 14.8253 3.55495C14.7218 3.45147 14.5986 3.36981 14.463 3.31479C14.3274 3.25978 14.1821 3.23253 14.0358 3.23467C13.8895 3.2368 13.7451 3.26827 13.6111 3.32721C13.4772 3.38616 13.3564 3.47138 13.256 3.57782C13.0607 3.78485 12.9538 4.05983 12.958 4.3444C12.9621 4.62897 13.077 4.90073 13.2782 5.10197C13.4795 5.30321 13.7512 5.4181 14.0358 5.42225C14.3204 5.4264 14.5954 5.31948 14.8024 5.12419Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_891_355">
                      <rect
                        width="18"
                        height="18"
                        fill="white"
                        transform="translate(0.150391 0.0612793)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/antoine-vernez-b542b8290/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.150391 2.58128C0.150391 1.18952 1.27863 0.0612793 2.67039 0.0612793H15.6304C17.0221 0.0612793 18.1504 1.18952 18.1504 2.58128V15.5413C18.1504 16.933 17.0221 18.0613 15.6304 18.0613H2.67039C1.27863 18.0613 0.150391 16.933 0.150391 15.5413V2.58128Z"
                    fill="white"
                  />
                  <path
                    d="M6.63039 4.92128C6.63039 5.81598 5.90509 6.54128 5.01039 6.54128C4.11569 6.54128 3.39039 5.81598 3.39039 4.92128C3.39039 4.02658 4.11569 3.30128 5.01039 3.30128C5.90509 3.30128 6.63039 4.02658 6.63039 4.92128Z"
                    fill="black"
                  />
                  <path
                    d="M3.75039 7.62128C3.75039 7.42246 3.91157 7.26128 4.11039 7.26128H5.91039C6.10921 7.26128 6.27039 7.42246 6.27039 7.62128V14.4613C6.27039 14.6601 6.10921 14.8213 5.91039 14.8213H4.11039C3.91157 14.8213 3.75039 14.6601 3.75039 14.4613V7.62128Z"
                    fill="black"
                  />
                  <path
                    d="M7.71039 7.26128L9.33039 7.26129C9.52921 7.26129 9.69039 7.42247 9.69039 7.62129V7.98129C10.4104 7.08128 11.7304 7.02127 12.3904 7.08127C14.4479 7.26831 14.7904 9.36128 14.7304 10.5013L14.7304 14.4613C14.7304 14.6601 14.5692 14.8213 14.3704 14.8213L12.7504 14.8213C12.5516 14.8213 12.3904 14.6601 12.3904 14.4613V10.5013C12.3304 10.0213 11.9944 9.06128 11.1304 9.06128C10.2664 9.06128 9.75039 10.1413 9.69039 10.5013V14.4613C9.69039 14.6601 9.52921 14.8213 9.33039 14.8213L7.71039 14.8213C7.51157 14.8213 7.35039 14.6601 7.35039 14.4613V7.62128C7.35039 7.42246 7.51157 7.26128 7.71039 7.26128Z"
                    fill="black"
                  />
                </svg>
              </a>
            </div>

            <div className="order-1 sm:order-2">
              <Button
                as="button"
                type="submit"
                disabled={isSubmitting}
                glint={!isSubmitting}
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
