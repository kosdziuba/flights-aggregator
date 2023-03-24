FROM node:19
WORKDIR /app/
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --production
COPY ./ ./
COPY ./.docker/app/.env.docker .env
RUN ["chmod", "+x", "./docker-entrypoint.sh"]
CMD ./docker-entrypoint.sh