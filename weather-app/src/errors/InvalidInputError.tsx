export class InvalidInputError extends Error {
  readonly type = "InvalidInputError" as const;
  readonly message = "Please enter a valid city and country"
}