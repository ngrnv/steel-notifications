FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

COPY ./dist/apps/notifications-fe /usr/share/nginx/html
COPY ./apps/notifications-fe/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
