# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
RUN npm install -g npm@8.19.2

# ==== BUILD =====
# # Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm ci
# Build the app
RUN  yarn install
RUN  yarn install @mui/icons-material
RUN  yarn install @material-ui/core
RUN  yarn install @material-ui/icons
RUN  yarn install @testing-library/jest-dom
RUN  yarn install @types/passport-google-oauth20
RUN  yarn install @types/passport-jwt
RUN  yarn install @types/react-calendar
RUN  yarn install axios
RUN  yarn install passport-google-oauth20
RUN  yarn install passport-jwt
RUN  yarn install rc-image
RUN  yarn install react-calendar
RUN  yarn build 
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 5000
# Start the app
CMD [ "npx", "serve", "build" ]