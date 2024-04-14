FROM node:21 as build

WORKDIR /usr/local/app
COPY ./frontend ./
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/local/app/dist/rh-email-sanitizer/browser /usr/share/nginx/html
COPY ./frontend/default.conf /etc/nginx/conf.d/