const API_URL = import.meta.env.VITE_UTAZON_API_URL || "https://api.utazon.fr";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, {
      method: "GET",
    });
  }

  async post(endpoint: string, data?: unknown): Promise<Response> {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private async request(
    endpoint: string,
    options: RequestInit,
  ): Promise<Response> {
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    return response;
  }

  getVideoUrl(videoPath: string): string {
    return `${this.baseUrl}/api/videos/${videoPath}`;
  }

  /**
   * Fetch a presigned URL for streaming video from R2 storage
   * @param objectKey - The R2 object key (e.g., "fooh/details.mp4")
   * @returns Presigned URL and expiration time in seconds
   */
  async getPresignedVideoUrl(
    objectKey: string,
  ): Promise<{ url: string; expires_in: number }> {
    const response = await this.get(
      `/api/v1/video?object_key=${encodeURIComponent(objectKey)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch presigned URL: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async sendContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      number: data.telephone,
      email: data.email,
      message: data.message,
    };

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Contact sending failed: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_URL);
