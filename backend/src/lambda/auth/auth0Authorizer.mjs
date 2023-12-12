import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-psgwcpa0ttqk80ay.us.auth0.com/.well-known/jwks.json'

// const CERTIFICATE = `-----BEGIN CERTIFICATE-----
// MIIDHTCCAgWgAwIBAgIJdGrr9t0fTnWCMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
// BAMTIWRldi1wc2d3Y3BhMHR0cWs4MGF5LnVzLmF1dGgwLmNvbTAeFw0yMzEyMTEw
// NjM3NDBaFw0zNzA4MTkwNjM3NDBaMCwxKjAoBgNVBAMTIWRldi1wc2d3Y3BhMHR0
// cWs4MGF5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// ggEBAOABFqIg/aBevZbSXDQEFBFs+r8CAxZ1coOqaS1sGFmU4xKfXdg8+prXpRd4
// avEtNojRqIn5G/PY5ZjkS/I8k+A80eIFqGHPems40coEbgxJOeHmq13L9BobBf1D
// 82Qkg4rH1ZR6oe9Uydb5xqkq6T6wuAc9ViBGxWXxLwUb1pEp5fZ8r0oytJnb5cgt
// nKH8mW60aKZw2+XkguPvNChriwKrt8M/doUVkJ9M6NgegtJIxadJ6H8Af3czzVpU
// 0Sdiu3h4isojYnFu9q4Af+e4uJ4sgvYQGpFd6zzHtwxDKdR2Osi2fVTzLYRQqRXd
// P97PFNnUKWXFQpJh74vM4PbQuFcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
// BgNVHQ4EFgQUg45RKb2SfK6G67XPqvNkD9WCKxIwDgYDVR0PAQH/BAQDAgKEMA0G
// CSqGSIb3DQEBCwUAA4IBAQAZW7Gsry/HWj429oNXxFH+zN4pExG9TxjedWA08xzj
// hsEykNlTtkBDesApUzLqxlexD1HOCG8EBWX7Zq4/Q4IUkdasOFsCcC1NAqaTwVEL
// 9GF+Jw44gmbVgXZSmyunOg6JX7LOpvLa6c0fkhQeHnRzzoaE3MMka7HPiNf3EaJl
// j1KH/hFCVin0+dAIW40oI5R1+BbtApZz2X9gaB7AyigzMZt5maGCWbAOgUrjLSnW
// gRZatJR+umTHuBdhsGDQIJubCpu8LsEQjSmhyLZOd9sH2+yI0DYaQZkLxI2LsVq9
// MCP+el2la2gpmuPtwSfcOysBXTTPqMo6IAcCBtTnrJBp
// -----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const _res = await Axios.get(jwksUrl);
  const keys = _res.data.keys;
  const signKeys = keys.find(key => key.kid === jwt.header.kid);

  if(!signKeys) throw new Error("Incorrect Keys");
  const pemDT = signKeys.x5c[0];
  const secret = `-----BEGIN CERTIFICATE-----\n${pemDT}\n-----END CERTIFICATE-----\n`;;

  const verifyToken = verify(token,secret, {algorithms: ['RS256']});

  logger.info('Verify token', verifyToken);
  return verifyToken;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
