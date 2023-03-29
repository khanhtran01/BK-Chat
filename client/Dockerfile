FROM node:16-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.3 as production-stage

COPY --from=build-stage /usr/src/app/build/ /usr/share/nginx/html

COPY --from=build-stage /usr/src/app/config/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
