import { InvalidApiKeyError } from "./InvalidApiKey";
import { InvalidInputError } from "./InvalidInputError";
import { TooManyRequestsError } from "./TooManyRequestsError";

export type ResponseError = TooManyRequestsError | InvalidInputError | InvalidApiKeyError ;
