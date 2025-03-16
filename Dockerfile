# Step 1: Build the React frontend
FROM node:22 AS builder

WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client/
RUN cd client && npm run build

# Step 2: Build the backend and copy frontend build into it
FROM node:22

WORKDIR /app
COPY package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server ./server
COPY --from=builder /app/client/build ./client/build

# Set working directory to backend
# WORKDIR /app/server

# Expose backend port
EXPOSE 3001 8080

# Start the backend (which also serves the frontend)
CMD ["node", "server/server.js"]
