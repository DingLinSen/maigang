FROM nginx:stable-alpine-perl

RUN rm -f /etc/nginx/nginx.conf \
    && rm -f /etc/nginx/conf.d/default.conf

ARG ENV
COPY docker/${ENV}/nginx.k8s.conf /etc/nginx/nginx.conf

EXPOSE 80

COPY ./dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]

MAINTAINER zhangzangqian
