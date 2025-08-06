interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const contactService = {
  async sendContactEmail(data: ContactData): Promise<ContactResponse> {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Contact service error:", error);
      return {
        success: false,
        message: "Failed to send contact request",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

