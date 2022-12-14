# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
RUN npm install -g npm@8.19.3

# ==== BUILD =====
# # Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm ci
# Build the app
RUN  yarn install
RUN  yarn add @mui/icons-material
RUN  yarn add @material-ui/core
RUN  yarn add @material-ui/icons
RUN  yarn add @testing-library/jest-dom
RUN  yarn add @types/passport-google-oauth20
RUN  yarn add @types/passport-jwt
RUN  yarn add @types/react-calendar
RUN  yarn add axios
RUN  yarn add passport-google-oauth20
RUN  yarn add passport-jwt
RUN  yarn add rc-image
RUN  yarn add react-calendar
RUN  yarn  run build 

# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
# Start the app
CMD [ "npx", "serve", "build" ]