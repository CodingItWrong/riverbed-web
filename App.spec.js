import {render, screen} from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renders a hello message', () => {
    render(<App />);
    expect(screen.getByText('Hello, React Native!')).toBeVisible();
  });
});