import { useEffect, useState } from "react";
import { ResponseError } from "../../../errors/ResponseError";
import InputField from "../../ui/input-field";
import Button from "../../ui/button";
import { InvalidInputError } from "../../../errors/InvalidInputError";
import { TooManyRequestsError } from "../../../errors/TooManyRequestsError";
import { FormProvider, useForm } from "react-hook-form";
import WeatherResponse from "../../../models/WeatherResponse";
import DisplayText from "../../ui/display-text";
import axios from "axios";
import { InvalidApiKeyError } from "../../../errors/InvalidApiKey";

function Home() {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [response, setResponse] = useState("");
  const [error, setError] = useState<ResponseError>();
  const [validationMessage, setValidationMessage] = useState("");
  const [result, setResult] = useState("");

  const methods = useForm();

  useEffect(() => {
    setResult(response ? response : error ? error.message : "");
  }, [response, error]);

  function clearState() {
    setResponse("");
    setError(undefined);
  }

  async function getWeather(city: string, country: string) {
    clearState();

    if (city.length === 0) {
      setValidationMessage("The city field is required. Please enter a city");
    } else {
      if (country.length !== 2) {
        setValidationMessage(
          "Warning: Country code should be exactly 2 characters. If you are passing an invalid country code, it is not guaranteed that you will be retrieving the weather description for the correct city"
        );
      } else {
        setValidationMessage("");
      }

      const url = `http://localhost:5000/weather?country=${country}&city=${city}`;
      await axios
        .get<WeatherResponse>(url, {
          headers: {
            "API-KEY": "12345",
          },
        })
        .then((res) => {
          setResponse(
            `The weather description is "${res.data.description.join(", ")}"`
          );
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setError(new InvalidApiKeyError());
          } else if (err.response.status === 404) {
            setError(new InvalidInputError());
          } else if (err.response.status === 429) {
            setError(new TooManyRequestsError());
          }
        });
    }
  }

  return (
    <div className="p-10 md:p-40">
      <h1 className="text-xl py-4">Weather Description App</h1>
      <DisplayText
        text="Enter a city and a country code, and submit to view the description of
          the weather in that location."
      />
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              placeholder="City"
              inputText={cityInput}
              onUpdate={setCityInput}
            />
            <InputField
              placeholder="Country code"
              inputText={countryInput}
              onUpdate={setCountryInput}
            />
          </div>
          <Button
            buttonLabel="Submit"
            onUpdate={() => getWeather(cityInput, countryInput)}
          />
        </form>
      </FormProvider>
      {validationMessage && <DisplayText text={validationMessage} />}
      {result && <DisplayText text={result} />}
    </div>
  );
}

export default Home;
