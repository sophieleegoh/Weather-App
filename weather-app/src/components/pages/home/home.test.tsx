import renderer from "react-test-renderer";
import Home from "./index";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
const axios = require("axios");
jest.mock("axios");

const inputCity = (city: string) => {
  const cityInput = screen.getByPlaceholderText("City");
  fireEvent.change(cityInput, {
    target: {
      value: city,
    },
  });
};

const inputCountry = (country: string) => {
  const cityInput = screen.getByPlaceholderText("Country code");
  fireEvent.change(cityInput, {
    target: {
      value: country,
    },
  });
};

const submit = () => {
  const button = screen.getByText("Submit");
  fireEvent.click(button);
};

describe("Home page snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(<Home />);

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("Home page unit tests", () => {
  it("should return validation message when no input provided", () => {
    render(<Home />);

    const button = screen.getByText("Submit");

    fireEvent.click(button);
    expect(
      screen.getByText("The city field is required. Please enter a city")
    ).toBeInTheDocument();
  });

  it("should return response when valid city only provided", async () => {
    render(<Home />);

    axios.get.mockResolvedValue({
      data: {
        description: ["sunny"],
      },
    });

    inputCity("Melbourne");
    submit();

    expect(
      screen.getByText(
        "Warning: Country code should be exactly 2 characters. If you are passing an invalid country code, it is not guaranteed that you will be retrieving the weather description for the correct city"
      )
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText('The weather description is "sunny"')
      ).toBeInTheDocument();
    });
  });

  it("should return response when valid city and valid country code provided", async () => {
    render(<Home />);

    axios.get.mockResolvedValue({
      data: {
        description: ["cloudy"],
      },
    });

    inputCity("Melbourne");
    inputCountry("AU");
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('The weather description is "cloudy"')
      ).toBeInTheDocument();
    });
  });

  it("should return response when valid city and valid country code provided and there are multiple descriptions", async () => {
    render(<Home />);

    axios.get.mockResolvedValue({
      data: {
        description: ["cloudy", "stormy"],
      },
    });

    inputCity("Melbourne");
    inputCountry("AU");
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('The weather description is "cloudy, stormy"')
      ).toBeInTheDocument();
    });
  });

  it("should display too many requests error message when API limit is exhausted", async () => {
    render(<Home />);

    axios.get.mockRejectedValue({ response: { status: 429 } });

    inputCity("Melbourne");
    inputCountry("AU");
    submit();

    await waitFor(() => {
      expect(
        screen.getByText(
          "You have reached the maximum amount of request allowed. Please try again in 1 hour"
        )
      ).toBeInTheDocument();
    });
  });

  it.each([
    ["melbourne", "madeup"],
    ["madeup", "au"],
    ["madeup", "madeup"],
    ["sydney", "IT"] //Note: IT is the country code for Italy, and there is no city in Italy called Sydney
  ])(
    "should display invalid input error message when %s,%s is provided",
    async (city: string, country: string) => {
      render(<Home />);

      axios.get.mockRejectedValue({ response: { status: 404 } });

      inputCity(city);
      inputCountry(country);
      submit();

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid city and country")
        ).toBeInTheDocument();
      });
    }
  );
});
