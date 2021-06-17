FROM fedora

RUN dnf update -y && \
    dnf module install nodejs:12 -y

RUN mkdir /exec
COPY package.json /exec/package.json
COPY package-lock.json /exec/package-lock.json
COPY tsconfig.json /exec/tsconfig.json

WORKDIR /exec
RUN npm install

VOLUME [ "/exec/dist" ]
VOLUME [ "/exec/scripts" ]
VOLUME [ "/exec/swipeforfuture.com" ]

ENTRYPOINT [ "bash" ]