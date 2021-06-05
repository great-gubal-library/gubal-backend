FROM node:12.3.1

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm install -g typescript
RUN npm run build
RUN npm prune --production

FROM node:12.3.1

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/node_modules ./node_modules
COPY --from=0 /usr/src/app/ormconfig.js ./
COPY --from=0 /usr/src/app/package.json ./
COPY --from=0 /usr/src/app/dist ./dist

# Expose the port
EXPOSE 1337

# Start the app
ENTRYPOINT ["node", "dist/main.js"]
