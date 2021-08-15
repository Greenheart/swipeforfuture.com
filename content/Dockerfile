FROM fedora:34

RUN dnf update -y && \
    dnf module install nodejs:16/development -y

RUN mkdir /exec
RUN mkdir /exec/content
COPY package.json /exec/content/package.json
COPY package-lock.json /exec/content/package-lock.json
COPY tsconfig.json /exec/content/tsconfig.json

WORKDIR /exec/content
RUN npm install

ENTRYPOINT [ "bash" ]