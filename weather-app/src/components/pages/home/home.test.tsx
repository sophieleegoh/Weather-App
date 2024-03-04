import renderer from 'react-test-renderer';
import Home from './index';

describe("Home page snapshot tests", () => {
  it("Renders the component", () => {
    const component = renderer.create(
      <Home />
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  })
})