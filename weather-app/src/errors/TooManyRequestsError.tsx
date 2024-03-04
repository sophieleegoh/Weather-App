export class TooManyRequestsError extends Error {
  readonly type = "TooManyRequestsError" as const;
  readonly message = "You have reached the maximum amount of request allowed. Please try again in 1 hour"
}