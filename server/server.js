// node_modules
const path = require( "path" );
const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const bodyParser = require( "body-parser" );
const https = require( "https" );
const fs = require( "fs" );
// ssl
const key = fs.readFileSync( './cert/CA/localhost/localhost.decrypted.key' );
const cert = fs.readFileSync( './cert/CA/localhost/localhost.crt' );
// local
const authorize = require( "./auth" );
const routes = require( "./routes" );
const rtc = require( "./rtc.server" );

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.set( "documents", path.join( __dirname, "assets/documents" ) );
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "pug" );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( cookieParser() );

app.use( "/css", express.static( path.join( __dirname, "assets/css" ) ) );
app.use( "/js", express.static( path.join( __dirname, "assets/scripts" ) ) );
app.use( "/", express.static( path.join( __dirname, "assets/favicon" ) ) );
app.use( "/images", express.static( path.join( __dirname, "assets/images" ) ) );
//app.use( authorize );

// set routes
( async () =>
{
    await routes.test( app );

    var server = https.createServer( { key, cert }, app );
        server.listen( port, () => 
        {
            console.log( `app running at ${ hostname }:${ port }` );
        } );

    rtc.start( server );
} )();
