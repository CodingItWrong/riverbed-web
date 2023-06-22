import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Can't do strict mode yet as react-native-web doesn't support it
// see https://github.com/necolas/react-native-web/issues/1035
root.render(<App />);
