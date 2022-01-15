// node_modules
const fs = require( "fs" );
const path = require( "path" );
const express = require( "express" );
// local
const routes = require( "./routes" );
const bodyParser = require('body-parser');

const server = express();
const hostname = "127.0.0.1";
const port = 3000;

server.set( "documents", path.join( __dirname, "assets/documents" ) );
server.set( "views", path.join( __dirname, "views" ) );
server.set( "view engine", "pug" );
server.use( bodyParser.urlencoded( { extended: false } ) );
server.use( bodyParser.json() );

server.use( express.static( path.join( __dirname, "assets" ) ) );

server.listen( port, () => 
{
    console.log( `server running at http://${ hostname }:${ port }` );
} );

// set routes
routes.get( server );