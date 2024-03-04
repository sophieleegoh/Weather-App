export class CityNotFound extends Error {
  readonly type = "CityNotFound" as const;
  readonly message = "Please enter a valid city and country"
}