FROM fedora:34

RUN dnf update -y && \
    dnf module install nodejs:16/development -y

RUN mkdir /exec
COPY package.json /exec/package.json
COPY package-lock.json /exec/package-lock.json
COPY postcss.config.cjs /exec/postcss.config.cjs
COPY svelte.config.js /exec/svelte.config.js
COPY tsconfig.json /exec/tsconfig.json
COPY tailwind.config.cjs /exec/tailwind.config.cjs

WORKDIR /exec
RUN npm install

ENTRYPOINT [ "bash" ]