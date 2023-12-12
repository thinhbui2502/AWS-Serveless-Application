const apiId = '19fkcsp9qk'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev/`

export const authConfig = {
  domain: 'dev-psgwcpa0ttqk80ay.us.auth0.com',    // Domain from Auth0
  clientId: 'OtBjbOjDZR95dWPgciW5dGfPvBXkn4BG',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}