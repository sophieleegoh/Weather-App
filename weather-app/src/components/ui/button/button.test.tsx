import renderer from "react-test-renderer";
import Button from "./index";

describe("Button snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(
      <Button buttonLabel="button label" onUpdate={() => {}} />
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
