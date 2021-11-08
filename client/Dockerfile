FROM node:alpine

WORKDIR /app
COPY package.json ./
COPY node_modules ./
# RUN npm install
COPY ./ ./

CMD ["yarn", "start"]