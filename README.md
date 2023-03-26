# Spotless

Spotless is an alternative Spotify client that focuses on albums and genres instead of songs.

# 🔧 Running locally

Spotless is a web application developed with React and TypeScript, and uses Vite for building. To get started locally, clone this repository, make sure you have Node.js installed locally and `yarn` installed globally. Then, inside of the repository's folder:

```bash
yarn install
yarn app:dev
```

This will compile the app and run a local server exposing it at `localhost:5173`.

In order to log into your Spotify account you'll need to have a developer account in Spotify and an app developed. If you don't, you can do so [in the Spotify Developer Portal](https://developer.spotify.com/dashboard/login). Once you do, copy the client ID and client secret codes and add a file named `.env.local` inside of the `packages/app` folder with the following content:

```
VITE_CLIENT_ID=your_client_id
VITE_CLIENT_SECRET=your_client_secret
```

With this setup, Vite will automatically populate the config correctly to be able to login.
