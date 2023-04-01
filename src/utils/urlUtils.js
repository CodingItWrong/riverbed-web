const URL_REGEX = /^\w+:\/\/([^/]+\.\w+)/;

export function isValidUrl(string) {
  // new URL does not throw on React Native for invalid URLs
  return URL_REGEX.test(string);
}

export function domainForUrl(string) {
  const match = string?.match(URL_REGEX);
  if (match) {
    let [, host] = match;
    if (host.startsWith('www.')) {
      host = host.substr(4);
    }
    return host;
  } else {
    return string;
  }
}
