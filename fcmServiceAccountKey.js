module.exports = {
  type: process.env.FCM_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.FCM_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.FCM_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.FCM_SERVICE_ACCOUNT_PRIVATE_KEY,
  client_email: process.env.FCM_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.FCM_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.FCM_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.FCM_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FCM_SERVICE_ACCOUNT_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FCM_SERVICE_ACCOUNT_CLIENT_CERT_URL,
  universe_domain: process.env.FCM_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};
