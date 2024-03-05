import { useEffect, useState } from "react";
import { ResponseError } from "../../../errors/ResponseError";
import InputField from "../../ui/input-field";
import Button from "../../ui/button";
import { CityNotFound } from "../../../errors/CityNotFoundError";
import { TooManyRequestsError } from "../../../errors/TooManyRequestsError";
import { FormProvider, useForm } from "react-hook-form";
import WeatherResponse from "../../../models/WeatherResponse";
import DisplayText from "../../ui/display-text";

function Home() {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [response, setResponse] = useState("");
  const [error, setError] = useState<ResponseError>();
  const [validationMessage, setValidationMessage] = useState("");
  const [result, setResult] = useState("")

  const methods = useForm();

  useEffect(() => {
    setResult(response ? response : error ? error.message : "")
  }, [response, error])

  function getWeather(city: string, country: string) {
    setResponse("")
    setError(undefined)
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

      fetch(`http://localhost:5000/weather?country=${country}&city=${city}`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "API-KEY": "321",
          "User-Agent": "Mozilla 5.0",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          if (response.status.toString() === "404") {
            setError(new CityNotFound());
          } else if (response.status.toString() === "429") {
            setError(new TooManyRequestsError());
          }
        })
        .then((json) => {
          const response: WeatherResponse = json;
          setResponse(`The weather description is "${response.description}"`)
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <div className="p-20">
      <h1 className="text-xl py-4">Weather Description App</h1>
      <DisplayText text="Enter a city and a country code, and submit to view the description of
        the weather in that location." />

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
      {result && <DisplayText text={result} /> }
    </div>
  );
}

export default Home;
