# Use Node.js version 18
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the specific port (5001 for gateway, 5004 for blockchain)
EXPOSE 5001 

CMD ["node", "index.js"]