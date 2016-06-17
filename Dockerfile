from node:latest

# Create application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json /usr/src/app/
RUN npm install --quiet

# Bundle app sources
COPY ./lib /usr/src/app/lib
COPY ./test /usr/src/app/test
COPY ./static /usr/src/app/static

# Expose application port
EXPOSE 8000

# Run application
CMD [ "npm", "start" ]


