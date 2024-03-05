import renderer from 'react-test-renderer';
import DisplayText from './index';

describe("Display text snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(
      <DisplayText text="This is some test display text" />
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  })
})