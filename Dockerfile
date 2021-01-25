FROM hayd/alpine-deno:1.5.2

EXPOSE 8001
WORKDIR /app
RUN mkdir server game

# Cache dependencies
COPY server/deps.ts server
RUN deno cache server/deps.ts

# Cache source code
COPY server server
COPY game game
RUN deno cache server/main.ts

# Run
CMD ["run", "--allow-env", "--allow-net", "--allow-write", "--allow-read", "server/main.ts"]
