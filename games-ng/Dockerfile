FROM node:20.18.0 as build

WORKDIR /source

# Copy the package lock file into the container
COPY package*.json ./
# Run ci only for the production dependencies
RUN npm ci

# Copy the rest of the files into the container and build
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /source/dist/games-ng/browser /usr/share/nginx/html
COPY --from=build /source/nginx.conf /etc/nginx/conf.d/
EXPOSE 8080
