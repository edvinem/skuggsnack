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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
