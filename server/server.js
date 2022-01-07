const fs = require( "fs" );
const mime = require( "mime-types" );
const path = require( "path" );
const express = require( "express" );
const checklists = require( "./data/checklists" );
const utils = require( "./utilities/functions" );
const server = express();
const hostname = "127.0.0.1";
const port = 3000;

server.set( "documents", path.join( __dirname, "documents" ) );
server.set( "views", path.join( __dirname, "views" ) );
server.set( "view engine", "pug" );

server.use( express.static( path.join( __dirname, "assets" ) ) );

// utilities


// routing
var routes =
[
    {
        endpoint: "/",
        template: "index",
        function: "static",
        variables:
        {
            title: "Kitchen Utilities"
        }
    },
    {
        endpoint: "/checklists",
        template: "checklists",
        function: "checklists",
        variables: checklists
    },
    {
        endpoint: "/checklists/:id",
        template: "partials/checklist",
        function: "checklist",
        variables: checklists
    },
    {
        endpoint: "/documents",
        template: "directory",
        function: "directory"
    },
    {
        directory: "documents",
        function: "documents"
    },
    { 
        directory: "downloads",
        function: "downloads"
    },
    /*{
        directory: "/views/templates",
        template: "templates/checklist",
        function: "templates"
    }*/
];

var route = {};
    route[ "checklists" ] = function( params )
    {
        server.get( params.endpoint, ( req, res ) =>
        {   
            res.render( params.template,
            {
                title: utils.capitalize( params.function ),
                data: params.variables.data,
                menu: params.variables.menu,
                location: params.variables.location,
            } );
        } );
    };

    route[ "checklist" ] = function( params )
    {
        server.get( params.endpoint, ( req, res ) =>
        {   
            res.render( params.template,
            {
                data: params.variables.data,
                menu: params.variables.menu,
                location: params.variables.location,
                item: params.variables.data[ req.params.id ],
                active: req.params.id
            } );
        } );
    };

    route[ "documents" ] = function( params )
    {   
        params.endpoint = `/${ params.directory }/:filename`;
        
        server.get( params.endpoint, ( req, res ) => 
        {
            var info = utils.fileInfo( params.directory, req.params.filename );

            fs.readFile( info.file, ( err, data ) =>
            {
                res.contentType( info.type );
                res.send( data );
            } ); 
        } );
    };

    route[ "downloads" ] = function( params )
    {
        params.endpoint = `/${ params.directory }/:filename`;
        
        server.get( params.endpoint, ( req, res ) => 
        { 
            var info = utils.fileInfo( params.directory + "/:filename", req.params.filename );
        
            res.setHeader( 'Content-Length', info.stat.size );
            res.setHeader( 'Content-Type', 'application/pdf' );
            res.setHeader( 'Content-Disposition', 'attachment; filename=' + info.filename );
        
            file.pipe( res );
        } );
    };

    route[ "directory" ] = function( params )
    {
        server.get( params.endpoint, ( req, res ) =>
        {   
            utils.directoryInfo( req.url, callback );
        
            function callback( info )
            {
                res.render( params.template,
                {
                    title: utils.capitalize( info.directory.substring( 1 ) ),
                    files: info.files,
                    path: req.url
                } );
            };
        } );
    };

    route[ "static" ] = function( params )
    {
        server.get( params.endpoint, ( req, res ) => 
        { 
            res.render( params.template, params.variables );
        } );   
    };

    route[ "templates" ] = function( params )
    {
        params.endpoint = `/templates/:template`;

        server.get( params.endpoint, ( req, res ) =>
        {   
            utils.directoryInfo( params.directory, callback );
        
            function callback( info )
            {
                res.render( params.template,
                {
                    title: "Templates",
                    files: info.files,
                    path: req.url
                } );
            };
        } );
    };

routes.forEach( params => route[ params.function ].call( null, params ) );

// serve
server.listen( port, () => 
{
    console.log( `server running at http://${ hostname }:${ port }` );
} );
