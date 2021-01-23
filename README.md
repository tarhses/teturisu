# TETURISU!

An online multiplayer Tetris clone written in Typescript with a Svelte front-end and a Deno back-end.

## Getting started

To run the server, [Deno](https://deno.land) is required:

```sh
export PORT=8080 # or 8001 by default
deno run --allow-env --allow-net server/main.ts
```

The client interface uses [Svelte](https://svelte.dev) and can be built with [Rollup](https://rollupjs.org):

```sh
npm install
npm run build # make a production build into "public/",
npm run dev # or directly serve static files (in dev mode!)
```

In production, you should serve the public directory and redirect every WebSocket request (the `/ws` route) to the Deno server. This can be achieved with a reverse-proxy. For instance, an Nginx configuration file could look like this:

```nginx
server {
  # Serve static files.
  root "/path/to/public";

  # Any room ID (i.e. 12 characters base64 string) is
  # rewritten to return "index.html".
  rewrite "^/[A-Za-z0-9\-_]{12}$" "/index.html";

  # Send WebSocket requests upstream.
  # See https://www.nginx.com/blog/websocket-nginx/.
  location = /ws {
    proxy_pass $to_my_server;
  }

  # ...
}
```

## _Tetris Guideline_

The game tries to follow [the Tetris Guideline](https://tetris.wiki/Tetris_Guideline) as close as possible but it deviates on certain points:

* The scoring and level systems mimic [the NES version](https://tetris.wiki/Tetris_(NES,_Nintendo)). Thus _T-spins_, _Back-to-Backs_, and _Combos_ are not rewarded.
* The speed curve also imitates the NES version.
* You can not [hold a piece](https://tetris.wiki/Hold_piece).
* There is no [ghost piece](https://tetris.wiki/Ghost_piece).
* [The garbage system](https://tetris.wiki/Garbage) is not implemented.
* The game uses [infinity](https://tetris.wiki/Infinity) to handle its lock delay. It actually is compliant to the Guideline, but another locking type could be preferable (well maybe, I dunno).

These features might be implemented in the future, though. Feel free to contribute anyway :wink:.

## License

This project is [MIT](/LICENSE) licensed.

:copyright: 2021, Pierre Luycx
