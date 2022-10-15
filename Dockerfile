########
# Base #
########
FROM node:16-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

################
# Dependencies #
################
FROM base AS dependencies
RUN yarn install --production=false --frozen-lockfile && yarn cache clean

#######################
# Pruned Dependencies #
#######################
FROM dependencies AS pruned-dependencies
RUN npm prune --omit=dev --legacy-peer-deps

###########
# Builder #
###########
FROM base AS builder
COPY --from=dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN yarn build

##############
# Production #
##############
FROM base AS production
COPY --from=pruned-dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/ormconfig.js ./

RUN touch .env
RUN chown node:node .env

USER node
EXPOSE 3000
CMD printf "%s" "$ENV_FILE" > .env && node dist/main.js
