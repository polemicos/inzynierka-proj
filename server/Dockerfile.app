# Use the official Node.js image.
FROM node:20

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install the application dependencies.
RUN npm install

# Copy the rest of your application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Command to run the application.
CMD ["node", "src/app.js"]