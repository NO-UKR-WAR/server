FROM node:16.13.1-alpine
COPY ./dist /dist
COPY ./node_modules /node_modules
CMD [ "node", "dist/main" ]