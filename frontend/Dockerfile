FROM node:22-alpine

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy the rest of the frontend files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
