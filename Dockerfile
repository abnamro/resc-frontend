# Build arguments
ARG SOURCE_REGISTRY

# build stage
FROM ${SOURCE_REGISTRY}node:22-alpine3.20 as build-stage
RUN apk -U upgrade
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

# production stage
FROM ${SOURCE_REGISTRY}nginx:1.26.0-alpine as production-stage
RUN apk -U upgrade && \
    mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN chown -R nginx:nginx /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /etc/nginx
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
USER nginx
