const DEFAULT_PATH = 'oauth/token';
const DEFAULT_ERROR_MESSAGE =
  'An error occurred while logging in. Please try again.';

const oauthLogin = ({httpClient, path = DEFAULT_PATH, username, password}) =>
  httpClient
    .post(
      path,
      {
        grant_type: 'password',
        username,
        password,
      },
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => ({
      accessToken: response.data.access_token,
      userId: response.data.user_id,
    }))
    .catch(handleErrorResponse);

function handleErrorResponse(error) {
  let message = DEFAULT_ERROR_MESSAGE;
  if (error?.responseText) {
    try {
      const responseData = JSON.parse(error?.responseText);
      if (responseData.error_description) {
        message = responseData.error_description;
      }
    } catch {
      // no-op: use default message value
    }
  }
  throw message;
}

export default oauthLogin;
