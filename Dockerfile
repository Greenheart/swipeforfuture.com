FROM node:20

RUN corepack enable

RUN corepack prepare pnpm@latest --activate
ENV PNPM_HOME="/pnpm"
RUN pnpm config set store-dir /pnpm/.pnpm-store

RUN mkdir /app
WORKDIR /app

CMD [ "bash"]