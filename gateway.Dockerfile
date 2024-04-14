FROM nginx:latest
COPY ./gateway/ /etc/nginx/conf.d/
