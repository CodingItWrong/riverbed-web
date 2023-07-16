const emailRegex = /^[^@\s]+@[^@\s]+\.[A-Za-z]+$/;

export function isValidEmail(emailString) {
  return emailRegex.test(emailString);
}
