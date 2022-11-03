const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas')
console.log("schema's imported")
const path = require('path');
const db = require('./config/connection');

const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers
  });
  await server.start();
  //adding Apollo server middlewear
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:3001}${server.graphqlPath}`);

}

startServer();

