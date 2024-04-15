FROM node:21 as build

WORKDIR /usr/local/app
COPY ./frontend/main ./main
COPY ./frontend/report ./report

WORKDIR /usr/local/app/main
RUN npm install
RUN npm run build

WORKDIR /usr/local/app/report
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/local/app/main/dist/rh-email-sanitizer/browser /usr/share/nginx/html/main
COPY --from=build /usr/local/app/report/build /usr/share/nginx/html/report
COPY ./frontend/configs/default.conf /etc/nginx/conf.d/