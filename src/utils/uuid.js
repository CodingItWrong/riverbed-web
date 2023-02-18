import {polyfillWebCrypto} from 'expo-standard-web-crypto';
polyfillWebCrypto();
import {v4 as uuidv4} from 'uuid';

// Mobile says "Random.getRandomBytes is not supported; falling back to insecure Math.random"
// But this is fine for this use case
export default uuidv4;
