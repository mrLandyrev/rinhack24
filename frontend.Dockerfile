FROM node:21 as build-main

WORKDIR /usr/local/app
COPY ./frontend/main ./main

WORKDIR /usr/local/app/main
RUN npm install
RUN npm run build

FROM node:21 as build-report

WORKDIR /usr/local/app
COPY ./frontend/report ./report

WORKDIR /usr/local/app/report
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build-main /usr/local/app/main/dist/rh-email-sanitizer/browser /usr/share/nginx/html/main
COPY --from=build-report /usr/local/app/report/build /usr/share/nginx/html/report
COPY ./frontend/configs/default.conf /etc/nginx/conf.d/