// node_modules
const path = require( "path" );
const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const bodyParser = require( "body-parser" );
// local
const authorize = require( "./auth" );
const routes = require( "./routes" );

const server = express();
const hostname = "127.0.0.1";
const port = 3000;

server.set( "documents", path.join( __dirname, "assets/documents" ) );
server.set( "views", path.join( __dirname, "views" ) );
server.set( "view engine", "pug" );
server.use( bodyParser.urlencoded( { extended: false } ) );
server.use( bodyParser.json() );
server.use( cookieParser() );

server.use( "/css", express.static( path.join( __dirname, "assets/css" ) ) );
server.use( "/js", express.static( path.join( __dirname, "assets/scripts" ) ) );
server.use( "/", express.static( path.join( __dirname, "assets/favicon" ) ) );
server.use( "/images", express.static( path.join( __dirname, "assets/images" ) ) );
//server.use( authorize );

// set routes
( async () =>
{
    await routes.test( server );

    server.listen( port, () => 
    {
        console.log( `server running at http://${ hostname }:${ port }` );
    } );
} )();
