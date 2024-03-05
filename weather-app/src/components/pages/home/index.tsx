import { useState } from "react";
import { ResponseError } from "../../../errors/ResponseError";
import InputField from "../../ui/input-field";
import Button from "../../ui/button";
import { CityNotFound } from "../../../errors/CityNotFoundError";
import { TooManyRequestsError } from "../../../errors/TooManyRequestsError";
import { FormProvider, useForm } from "react-hook-form";

function Home() {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [response, setResponse] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [error, setError] = useState<ResponseError>();

  const methods = useForm()

  function validateInput(city: string)
  {
    setValidationMessage("")
    if (city.length == 0)
    {
      setValidationMessage("The city field is required. Please enter a city")
    }
  }

  function getWeather(city: string, country: string)
  {
    setResponse("")
    validateInput(city)
    
    if (validationMessage == "")
    {
      if (country.length != 2)
      {
        setValidationMessage("Warning: Country code should be exactly 2 characters. If you are passing an invalid country code, it is not guaranteed that you will be retrieving the weather description for the correct city")
      }

      fetch(`http://localhost:5000/weather?country=${country}&city=${city}`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          'API-KEY' : '123',
          'User-Agent': 'Mozilla 5.0',
      }})
      .then(response => {
        if (response.ok) {
          return response.json()
        }
  
        if (response.status.toString() === "404") {
          setError(new CityNotFound())
        }
        else if (response.status.toString() === "429") {
          setError(new TooManyRequestsError())
        }
      })
      .then(json => setResponse(JSON.stringify(json)))
      .catch(error => console.log(error));
    }
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={e => e.preventDefault()}>
          <InputField placeholder="city" inputText={cityInput} onUpdate={setCityInput} />
          <InputField placeholder="country" inputText={countryInput} onUpdate={setCountryInput} />
          <Button buttonLabel="Submit" onUpdate={() => getWeather(cityInput, countryInput)} />
        </form>
      </FormProvider>
      <div>
        {validationMessage}
      </div>
      {response ? response : error && error.message}
    </div>
  );
};

export default Home; 
