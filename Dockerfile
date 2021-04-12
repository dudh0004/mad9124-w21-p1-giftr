FROM node:14-slim

ENV API_PORT="80"
ENV DEBUG="api:*"

RUN mkdir -p /app /app/config /app/exceptions /app/logs /app/middleware /app/models /app/public /app/routes /app/startup

COPY config/ /app/config/
COPY exceptions/ /app/exceptions/
COPY middleware/ /app/middleware/
COPY models/ /app/models/
COPY public/ /app/public/
COPY routes/ /app/routes/
COPY startup/ /app/startup/
COPY server.js app.js package.json /app/

WORKDIR /app
RUN npm install --unsafe-perm

EXPOSE 80
CMD node server.js
