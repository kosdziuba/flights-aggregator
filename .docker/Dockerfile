FROM node:19
WORKDIR /app/
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
COPY ./ ./
ENV ENV_FILE_PATH=.env.docker
ENV FLIGHTS_PROVIDERS_CONFIG_PATH=/app/flights-providers-config.yaml
RUN ["rm", "-rf", "dist"]
RUN ["npm", "run", "build"]
CMD ["npm", "run", "start:prod"]