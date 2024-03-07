import { useState } from "react";
import InputField from "../../ui/input-field";
import Button from "../../ui/button";
import WeatherResponse from "../../../models/WeatherResponse";
import DisplayText from "../../ui/display-text";
import axios from "axios";
import Form from "../../ui/form";

function Home() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [validationMessage, setValidationMessage] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  function clearState() {
    setApiResponse("");
    setValidationMessage("");
  }

  function handleErrors(err: any) {
    console.log(err);
    if (err.response.status === 401) {
      setApiResponse("Please provide a valid API key");
    } else if (err.response.status === 404) {
      setApiResponse("Please enter a valid city and country");
    } else if (err.response.status === 429) {
      setApiResponse(
        "You have reached the maximum amount of request allowed within 1 hour. Please try again later"
      );
    }
  }

  async function getWeather() {
    clearState();

    if (apiKey.length === 0) {
      setValidationMessage("The API key is required. Please enter an API key");
    } else if (city.length === 0) {
      setValidationMessage("The city field is required. Please enter a city");
    } else {
      if (country.length !== 2) {
        setValidationMessage(
          "Warning: Country code should be exactly 2 characters. If you are passing an invalid country code, it is not guaranteed that you will be retrieving the weather description for the correct city"
        );
      }

      const url = `http://localhost:5000/weather?country=${country}&city=${city}`;
      await axios
        .get<WeatherResponse>(url, {
          headers: {
            "API-KEY": apiKey,
          },
        })
        .then((res) => {
          setApiResponse(
            `The weather description is "${res.data.description.join(", ")}"`
          );
        })
        .catch((err) => handleErrors(err));
    }
  }

  return (
    <div className="p-10 md:p-40">
      <h1 className="text-xl py-4">Weather Description App</h1>
      <DisplayText text="Please enter a valid API key" />
      <InputField
        placeholder="API Key"
        inputText={apiKey}
        onUpdate={setApiKey}
      />

      <DisplayText
        text="Enter a city and a country code, and submit to view the description of
          the weather in that location."
      />
      <Form>
        <InputField placeholder="City" inputText={city} onUpdate={setCity} />
        <InputField
          placeholder="Country code"
          inputText={country}
          onUpdate={setCountry}
        />
        <Button buttonLabel="Submit" onUpdate={() => getWeather()} />
      </Form>
      {validationMessage && <DisplayText text={validationMessage} />}
      {apiResponse && <DisplayText text={apiResponse} />}
    </div>
  );
}

export default Home;
