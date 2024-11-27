FROM node:23-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./

RUN ls -l /app/src/components
RUN npm run build
RUN ls -R /app/build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["sh", "-c", "nginx -s reload || nginx -g 'daemon off;'"]
