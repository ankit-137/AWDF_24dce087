FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (layer cache optimisation)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Expose the port Express listens on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
