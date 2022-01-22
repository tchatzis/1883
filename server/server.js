// node_modules
const fs = require( "fs" );
const path = require( "path" );
const express = require( "express" );
const bodyParser = require( "body-parser" );
// local
const routes = require( "./routes" );

const server = express();
const hostname = "127.0.0.1";
const port = 3000;

server.set( "documents", path.join( __dirname, "assets/documents" ) );
server.set( "views", path.join( __dirname, "views" ) );
server.set( "view engine", "pug" );
server.use( bodyParser.urlencoded( { extended: false } ) );
server.use( bodyParser.json() );

server.use( "/css", express.static( path.join( __dirname, "assets/css" ) ) );
server.use( "/js", express.static( path.join( __dirname, "assets/scripts" ) ) );
server.use( "/", express.static( path.join( __dirname, "assets/favicon" ) ) );

server.listen( port, () => 
{
    console.log( `server running at http://${ hostname }:${ port }` );
} );

// set routes
routes.define( server );