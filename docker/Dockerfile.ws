FROM oven/bun:1

WORKDIR /user/src/app

COPY ./turbo.json ./turbo.json
COPY ./bun.lock ./bun.lock
COPY ./package.json ./package.json
COPY ./packages ./packages
COPY ./apps/ws ./apps/ws

RUN bun install
RUN bun run db:generate

EXPOSE 3002

CMD ["bun","run","start:ws"]