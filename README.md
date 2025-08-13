> [!WARNING]  
> Spotless is no longer maintained and has been superseded by [Echo](https://github.com/sleepyfran/echo)

# Spotless

Spotless is a little Spotify companion client that focuses on albums and genres instead of songs, letting you play the entire discography of an artist easily and letting you shuffle entire albums instead of just songs.


## 🔧 Running locally

Spotless is a web application developed with React and TypeScript that uses Vite for building. To get started locally, clone this repository making sure you have a recent-ish Node.js version installed and `yarn` installed globally. Then, inside of the repository's folder:

```bash
yarn
yarn web:dev
```

This will compile the app and run a local server exposing it at `localhost:5173`.

In order to log into your Spotify account you'll need to have a developer account in Spotify and an app created. If you don't, you can do so [in the Spotify Developer Portal](https://developer.spotify.com/dashboard/login). Once you do, copy the client ID and client secret codes and add a file named `.env.local` inside of the `packages/app` folder with the following content:

```
VITE_CLIENT_ID=your_client_id
VITE_CLIENT_SECRET=your_client_secret
```

With this setup, Vite will automatically populate the config correctly to be able to login.
