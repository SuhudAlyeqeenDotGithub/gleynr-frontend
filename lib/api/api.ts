import { getBackendApiUrl } from "../env/getter";

export class ApiFetch {
  private static readonly baseUrl = getBackendApiUrl();

  static async post<Return, Request>(
    url: string,
    body: Request,
    errorMessage: string = "Unknown error",
    headers?: Record<string, string>,
  ): Promise<Return> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const content = await response.json();
    if (!response.ok) {
      throw new Error(content.message || errorMessage);
    }

    return content as Return;
  }
}
