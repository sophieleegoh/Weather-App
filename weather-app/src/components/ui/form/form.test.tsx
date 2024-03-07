import renderer from "react-test-renderer";
import Form from "./index";

describe("Form snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(
      <Form>
        <div>This is a form</div>
      </Form>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
