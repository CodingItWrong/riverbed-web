import '@testing-library/jest-dom';
import {TextDecoder, TextEncoder} from 'node:util';

// jsdom does not provide these, but react-router requires them
global.TextEncoder ??= TextEncoder;
global.TextDecoder ??= TextDecoder;
