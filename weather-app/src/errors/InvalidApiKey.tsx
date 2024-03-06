export class InvalidApiKeyError extends Error {
  readonly type = "InvalidApiKey" as const;
  readonly message = "Please provide a valid API key"
}