FROM node:19
WORKDIR /app/
COPY package.json ./
RUN npm install --production
COPY ./ ./
ENV ENV_FILE_PATH=.env.docker
CMD ["npm", "run", "start:prod"]