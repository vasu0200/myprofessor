FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build --production

# Start server
CMD ["npm", "start"]
