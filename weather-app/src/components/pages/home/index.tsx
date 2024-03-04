import { useState } from "react";
import { ResponseError } from "../../../errors/ResponseError";
import InputField from "../../ui/input-field";
import Button from "../../ui/button";
import { CityNotFound } from "../../../errors/CityNotFoundError";
import { TooManyRequestsError } from "../../../errors/TooManyRequestsError";

function Home() {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [response, setResponse] = useState("");
  const [error, setError] = useState<ResponseError>();

  function getWeather(city: string, country: string)
  {
    fetch(`http://localhost:5000/weather?country=${country}&city=${city}`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        'API-KEY' : '321',
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

  return (
    <div>
      <div>
        <InputField placeholder="city" inputText={cityInput} onUpdate={setCityInput} />
        <InputField placeholder="country" inputText={countryInput} onUpdate={setCountryInput} />
        <Button buttonLabel="Submit" onUpdate={() => getWeather(cityInput, countryInput)} />
      </div>
      {response ? response : error && error.message}
    </div>
  );
};

export default Home; 