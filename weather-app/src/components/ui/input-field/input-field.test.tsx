import renderer from "react-test-renderer";
import InputField from "./index";

describe("Input field snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(
      <InputField
        placeholder="placeholder text"
        inputText=""
        onUpdate={() => {}}
      />
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
