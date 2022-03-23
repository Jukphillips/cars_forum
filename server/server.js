// called in for its resources & tools to help build and manage app
const express = require('express');
// provides help working with file and directory paths. 
const path = require('path');
// Spec-compliant GraphQl server that's compatible with any any GraphQl client - connects client with server
const { ApolloServer } = require('apollo-server-express');
// database connection to mongoose/mongodb 
const db = require('./config/connection');
// loading Javascript modules from schemas folder for apollo server access
const {typeDefs, resolvers} = require('./schemas');
// loading in authentication modules from auth folder. 
const { authMiddleware } = require('./utils/auth');
// Assigning Port to whatever is in the environment variable, or 3000 if there's nothing there
const PORT = process.env.PORT || 3001;
// assigning the cosnt variable 'app' an instance of the express method. 
const app = express();

// creating an instance of ApolloServer through a constructor that requires two paramters:
// schema definition and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // used to pass useful things to the resolvers, in this case authentication
    context: authMiddleware,
});

// required logic for intergrating with express
server.applyMiddleware({ app });

// inbuilt in express to recognize the incoming Request(POST or PUT) Object as strings or arrays
app.use(express.urlencoded({ extended: true }));
// inbuilt in express to recognize the incoming Request(POST or PUT) Object as a JSON Object
app.use(express.json());

// if we're in production, serve client/build as static assets
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(_dirname, '../client/build')))
};

// this is express being called and being specifcally told to return all response from app instance and 
// from the response to transfer to react index build
app.get('*', (req, res) => {
    res.sendFile(path.join(_dirname, '../client/build/index.html'))
});

// retrieiving our database function and calling it once 
db.once('open', () => {
    // telling our express instance to listen for PORT being true and then executing function
    app.listen(PORT, () => {
        // log what Port our api server's is running on
        console.log(`API server running on ${PORT}!`)
        // log wehre we can go to test our GraphQl ApI 
        console.log(`GraphQl at http;//localhost:${PORT}${server.graphqlPath}`);
    });
});