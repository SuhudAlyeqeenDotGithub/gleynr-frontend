import { getBackendApiUrl } from "../env/getter";

type ApiError = {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

const formatFieldName = (field: string) =>
  field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
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
      const error = content as ApiError;
      const errors = content.errors
        ?.map(
          (error: { field: string; message: string }) =>
            `${formatFieldName(error.field)}: ${error.message}`,
        )
        .join("\n");

      throw new Error(
        [error.message || errorMessage, errors].filter(Boolean).join("\n"),
      );
    }

    return content as Return;
  }
}
