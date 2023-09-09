CONTAINERTAG := node:swipeforfuture

build: Dockerfile
	podman build --tag ${CONTAINERTAG} -f Dockerfile

run:
	mkdir -p build
	podman run -it -p 3000:3000 \
		-v ./:/app:z \
		${CONTAINERTAG}
