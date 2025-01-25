FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
ENV REACT_APP_API_URL=/api

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/
