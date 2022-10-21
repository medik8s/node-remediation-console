FROM registry.access.redhat.com/ubi8/nodejs-16:latest AS builder
ARG VERSION=0.0.1
USER root
RUN npm install -g corepack
RUN corepack enable yarn

COPY . /opt/app-root/src
# replace version in package.json
RUN sed -r -i "s|\"version\": \"0.0.0\"|\"version\": \"${VERSION}\"|;" ./package.json
RUN yarn install --frozen-lockfile && yarn build

FROM registry.access.redhat.com/ubi9/nginx-120:latest
COPY default.conf "${NGINX_CONFIGURATION_PATH}"
COPY --from=builder /opt/app-root/src/dist .
USER 1001
CMD /usr/libexec/s2i/run
