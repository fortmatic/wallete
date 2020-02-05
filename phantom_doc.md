# Fortmatic Whitelabel SKD - Phantom 👻
***

The Phantom Mode is experimental and is currently in Beta. The library can be changed anytime. Fortmatic team will keep this document up to date with any changes and new features that we release. If you run into any issue with the libraries, please reach out to us on Telegram or send us an email: support+phantom@fortmatic.com.

The Phantom mode allows you to create web applications without having to manage user credentials or implement cumbersome authentication logic for API requests. Our authentication flow sends a “Magic Link” directly to your users’ email inbox, allowing them to log in passwordlessly across devices. It provides a complete white labeling solution (without UI) to authenticate your users and interact with Web3.

The Phantom mode consists of three main components:

- Client JavaScript SDK
- Admin SDK
- Decentralized IDentity Token (DID Token)

Client JavaScript SDK allows you to create an authentication logic to log in your users by using "Magic Link" with emails. Upon a successful user login, a Decentralized IDentity Token (DID Token) is generated to represent a valid login session for the given user. You can optionally use Admin SDK to securely validate the given user session, DID Token, with your custom backend server.

Phantom mode can support both server or serverless web applications. It is up to the developers to implement the Admin SDK to validate the DAT.

## Client JavaScript SDK

Follow this guide to use Client JavaScript SDK in your web application to implement your authentication logic

### Step 1: Installation

- NPM: `npm i --save fortmatic@2.0.0-beta.6`
- Yarn: `yarn add fortmatic@2.0.0-beta.6`
- CDN: `<script src="https://cdn.jsdelivr.net/npm/fortmatic@beta/dist/fortmatic.js"></script>`

### Step 2: Set up Your Fortmatic Phantom Instance

If you don't have a Fortmatic app already, you will need to sign up or log into your [Fortmatic dashboard](https://dashboard.fortmatic.com/) and create an app to get your API keys.

‌
Once you have an API key, you can create a Fortmatic instance, then instantiate a Fortmatic Phantom:

```javascript
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('YOUR_API_KEY'); // ✨
```

### Step 3: Build Something!

In the example below, create a button that takes in a use email. Once the button is clicked, Fortmatic will send a magic link to the specified email. As soon as that link is opened in a browser, loginWithMagicLink will resolve with the logged-in user object.

```javascript
<input type="text" id="user-email" placeholder="Enter your email!" />
<button onclick="handleLoginWithMagicLink()">
```

```
const handleLoginWithMagicLink = async () => {
    const email = document.getElementById('user-email').value;
    const user = await fmPhantom.loginWithMagicLink({ email });
    console.log(await user.isLoggedIn()); // => true
    console.log((await user.getMetadata()).publicAddress); // You should use this as a unique user Id.
};
```

You don't need to store user passwords, or even keep a user table if your application is serverless. The next time your user logs in with the same email, the same publicAddress (user id) will be returned.

Isn't that easy 😆?

### Methods

Client JavasScript SDK provides the following methods

#### PhantomMode

#### - `PhantomMode.loginWithMagicLink(configuration): Promise<PhantomUser>`

Send a "magic link" email to a user. After the user clicks the link inside the email, this login Promise will resolve and the user session (DID Token) started.

**Parameters:**

Configuration for this method is provided as a JavaScript object with the following interface:

```javascript
{
  /**
   * The email address of the user attempting to login.
   */
  email: string;
  
  /**
   * When `true`, a pre-built modal interface will show to the user, directing
   * them to check their email for the "magic link" to complete their
   * authentication.
   */
  showPendingModal?: boolean;
}
```

**Returns:**

A Promise resolving to an instance of PhantomUser.


### PhantomUser

#### - `PhantomUser.getMetadata(): Promise<PhantomUserMetadata>`

Retrieve information about the currently active user, if they are logged in.

**Parameters:**

```javascript
None
```

**Returns:**

A Promise resolving to an PhantomUserMetadata object, which has the following shape

```javascript
{
  publicAddress: string | null
  userEmail: string | null
}
```

#### - `PhantomUser.getIdToken(configuration?): Promise<string | null>`

Generates a DID Token for retrieving user-specific, server-side resources.

**Parameters:**

Configuration for this method is provided as a JavaScript object with the following interface:

```javascript
{
  /**
   * The number of seconds until the generated ID token will expire.
   */
  lifespan?: number;
}
```

**Returns:**

A Promise resolving to a DID Token string, or null if a user is not currently logged in.

#### - `PhantomUser.isLoggedIn(): Promise<boolean>`

Checks if the current user is logged in.

**Parameters:**

```javascript
None
```

**Returns:**

A Promise resolving to a boolean, true if the currently active user is logged in, and false otherwise.

#### - `PhantomUser.logout(): Promise<void>`

Logs out the current user.

**Parameters:**

```javascript
None
```

**Returns:**

A Promise resolving to a `void`.

## Admin SDK

Follow this guide to use Admin SDK in your Express-based Node.js server environment for admin operations.

### Step 1: Installation

Add the SDK to your project:

- NPM: `npm i --save @fortmatic/admin@beta`
- Yarn: `yarn add @fortmatic/beta`

### Step 2: Set up Your Fortmatic Auth Instance

If you don't have a Fortmatic app already, you will need to sign up or log into your [Fortmatic dashboard](https://dashboard.fortmatic.com/) and create an app to get your secret API key.

Once you have a secret API key, you can create a Fortmatic instance.

```javascript
const Fortmatic = require('@fortmatic/admin');

const fm = new Fortmatic('SECRET_API_KEY');
```

### Step 3: Build Something!

See end-to-end authentication experience on how to set up Express middleware and interact with the APIs.

Express middleware provided by the SDK is a recommended practice that you should be using to protect your routes. Once the Express middleware is applied, you can create something like:

```javascript
app.get('/user/public_address', (req: any, res: any) => {
  return fortmatic.getUserPublicAddress(req.headers.authorization);
});
```

### Methods

Admin SDK provides the following methods.

#### - `Fortmatic.validateToken(DAT: string): Promise<void>`

Checks if the given Decentralized Access Token is valid. Here are the criteria for a valid token:

- Token is signed by the expected private key.
- Expiration date has not passed.
- The challenge message, if present, is current and expected based on the configured challenge message service.

**Parameters:**

```
A string representation of a Decentralized Access Token.
This is analogous to a JWT in traditional web development.
```

**Returns:**

A Promise resolving to a `void` if the token is valid, otherwise throws with an error describing why validation failed.

#### - `Fortmatic.invalidateToken(DAT: string): Promise<boolean>`

Invalidates previously-generated tokens for the user encoded in the DAT via the configured challenge message service.

**Parameters:**

```
A string representation of a Decentralized Access Token.
This is analogous to a JWT in traditional web development.
```

**Returns:**

A Promise resolving to a `void` if the token invalidation was successful, otherwise throws with an error describing why invalidation failed. This is dependent on the challenge message service implementation.

#### - `Fortmatic.invalidateTokenBySignerAddress( userPublicAddress: string): Promise<boolean>`

Invalidates previously-generated tokens for the given user's public address.

**Parameters:**

```
A string representation of a Decentralized Access Token.
This is analogous to a JWT in traditional web development.
```

**Returns:**

A Promise resolving to a `void` if the token invalidation was successful, otherwise throws with an error describing why invalidation failed. This is dependent on the challenge message service implementation.

#### - `Fortmatic.decodeToken(DAT: string): [string, string]`

Decodes a DAT string to its raw elements as a tuple representing `[proof, claim]`, where `proof` is the signed token, and `claim` is the unsigned token.

**Parameters:**

```
A string representation of a Decentralized Access Token.
This is analogous to a JWT in traditional web development.
```

**Returns:**

A `[string, string]` tuple representing the decoded Decentralized Access Token.

#### - Fortmatic.getUserPublicAddress(DAT: string): string

A convenience method to easily get a user's public address from an encoded Decentralized Access Token.

**Parameters:**

```
A string representation of a Decentralized Access Token.
This is analogous to a JWT in traditional web development.
```

**Returns:**

A string representing the public address of the user that signed the token.

#### - Fortmatic.expressMiddleware

An Express-compatible middleware that automatically protects a route with a DID Token in its authorization header.

## DID Token

DID tokens are cryptographically-generated proofs that can manage user credentials to your application's resource server.

### What is an DID Token?

The ID token created by Phantom Mode (see `getIdToken`) makes use of Ethereum's—`personal_sign`—so that a user's proof of authorization can be encoded into a lightweight, digital signature.

The token is constructed as a Base64 JSON string tuple representing the `proof`, a digital signature, and a `claim`, which is the unsigned data a user asserts.

```javascript
const claim = { ... }; // Data representing the user's access.
const proof = sign(claim); // personal_sign
const DIDToken = btoa(JSON.stringify([proof, claim]));
```

The spec for Fortmatic DID tokens Claim is as follows:

```javascript
/* This is in the format of a Claim */
const claim = JSON.stringify({
    iat: Math.floor(Date.now() / 1000), // Issued At (now) in seconds.
    ext: Math.floor(Date.now() / 1000) + lifespan, // Expiry time in seconds.
    iss: `did:ethr:${account.address}`, // Issuer (signer)
    sub: subject, // Fortmatic Entity
    aud: `did:magic:${uuid()}`, // Identifies project space of the DID
    nbf: Math.floor(Date.now() / 1000), // Not before in seconds.
    tid: uuid(), // Unique token identifier
});

// The final token is an encoded string containing a JSON tuple: [proof, claim]
// proof should be a signed claim, if correct.
const proof = Web3Service.personalSign(claim, account.privateKey);
return btoa(JSON.stringify([proof, claim]));
```

## Examples

See more example in [repl.it](https://repl.it/@ArthurJen/PlayfulFirebrickRepositories) (Thanks to David He).