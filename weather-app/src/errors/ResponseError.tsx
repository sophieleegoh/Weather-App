import { CityNotFound } from "./CityNotFoundError";
import { TooManyRequestsError } from "./TooManyRequestsError";

export type ResponseError = TooManyRequestsError | CityNotFound;
