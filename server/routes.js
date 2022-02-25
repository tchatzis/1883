const fs = require( "fs" );
const queries = require( "./utilities/queries" );
const utils = require( "./utilities/functions" );
const nav = {};

const Menu = function( name )
{
    const links = [];

    const Link = function( label, endpoint )
    {
        this.index = links.length;
        this.id = label + this.index;
        this.label = label;
        this.url = endpoint;
    };

    this.append = function( label, endpoint, variables )
    {
        var vars = variables || {};
            vars.nav = nav;
            vars.title = label || variables.title;
        
        links.push( new Link( label, endpoint ) );

        return vars;
    };

    nav[ name ] = links; 
};

const main = new Menu( "main" );

const Route =
{
    Data: function()
    {
        this.label = null;
        this.template = null;
        this.endpoint = null;
        this.function = "data";
        this.variables = null;
    },
    
    DB: function( label, endpoint, variables )
    {     
        this.label = label;
        this.template = "template";
        this.endpoint = endpoint;
        this.function = "db";
        this.variables = main.append( label, endpoint, Object.assign( variables, { title: label } ) );
    },

    Directory: function( label, endpoint, variables )
    {
        this.label = label;
        this.template = "directory";
        this.endpoint = endpoint;
        this.function = "directory";
        this.variables = main.append( label, endpoint, Object.assign( variables, { title: label, path: endpoint } ) );  
    },

    Download: function( label, endpoint, variables )
    {
        this.label = label;
        this.template = "downloads";
        this.endpoint = endpoint;
        this.function = "download";
        this.variables = main.append( label, endpoint, Object.assign( variables, { title: label, path: endpoint } ) );  
    },

    File: function( label, endpoint, variables )
    {   
        this.label = label;
        this.template = "directory";
        this.endpoint = endpoint;
        this.function = "file";
        this.variables = main.append( label, endpoint, Object.assign( variables, { title: label } ) );  
    },

    Logout: function( label, endpoint )
    {
        this.label = label;
        this.template = null;
        this.endpoint = endpoint;
        this.function = "logout";
        this.variables = main.append( label, endpoint, {} );  
    },

    ID: function( label, endpoint, variables )
    {
        this.label = null;
        this.template = null;
        this.endpoint = endpoint;
        this.function = "id";
        this.variables = main.append( label, endpoint, variables );  
    },

    Submenu: function( label, endpoint, variables )
    {   
        this.label = label;
        this.endpoint = endpoint;
        this.template = "submenu";
        this.function = "static";
        this.variables = main.append( label, endpoint, Object.assign( variables, { title: label, path: endpoint } ) );  
    },

    Static: function( label, endpoint, variables )
    {
        this.label = label;
        this.endpoint = endpoint;
        this.template = "static";
        this.function = "static";
        this.variables = main.append( label, endpoint, variables );
    }
};

// routing
// "label", "/endpoint/", { variables }
var routes =
[
    new Route.Static( "Home", "/", {} ),
    
    new Route.Data(),
    new Route.DB( "Tests", "/db/test", { content: "table", sub: null, sort: "name" } ),
    new Route.DB( "Venues", "/db/venue", { content: "table", sub: null, sort: "name" } ),
    new Route.DB( "Stock", "/db/stock", { content: "table", sub: null, tab: "storage", sort: "label" } ),
    new Route.DB( "Items", "/db/item", { content: "table", sub: null, tab: "group", sort: "label" } ),
    new Route.DB( "Events", "/db/event", { content: "calendar", sub: null, tab: "date", sort: "date" } ),

    /*new Route.DB( "Brand", "/db/brand", { content: "table", sub: "label", sort: "label" } ),
    new Route.DB( "Allergen", "/db/allergen", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Group", "/db/group", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Kitchen", "/db/kitchen", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Plating", "/db/plating", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Process", "/db/process", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Status", "/db/status", { content: "table", sub: "sequence", sort: "sequence" } ),
    new Route.DB( "Temp", "/db/temp", { content: "table", sub: "sequence", sort: "sequence" } ),*/

    new Route.File( "", "/documents/:id", { directory: "assets/documents" } ),
    new Route.Directory( "Documents", "/documents", { directory: "assets/documents" } ),
    new Route.Download( "", "/downloads/:id", { directory: "assets/documents" } ),
    new Route.Directory( "Downloads", "/downloads", { directory: "assets/documents" } ),
    new Route.Logout( "Log Out", "/logout" ),
];

module.exports.define = function( server )
{
    var functions = {};

        functions[ "data" ] = async function( params )
        {
            server.post( `/path`, async function( req, res )
            {                    
                var path = new queries.Path( req.body );

                await path.exec( req.body );

                res.json( path.data );
            } );

            server.post( `/query`, async function( req, res )
            {                                   
                var query = new queries.Query( { query: req.body.query } );

                await query.exec();

                res.json( query.data );
            } );
        };
    
        functions[ "db" ] = async function( params )
        {     
            server.get( `${ params.endpoint }`, ( req, res ) =>
            {   
                res.locals.path = req.path;

                res.render( `db/${ params.template }`, params.variables );
            } );

            // CRUD
            server.post( `/db/:from/delete/:id`, async function( req, res )
            {    
                var query = new queries.Query( { query: `delete from ${ req.params.from } where id = ${ req.params.id }` } );

                await query.exec();

                res.json( query.data );
            } );

            server.post( `/db/:from/insert`, async function( req, res )
            {      
                var query = new queries.Query( { query: `insert into ${ req.params.from }` } );

                await query.exec( req.body );

                res.json( query.data );
            } );
            
            server.post( `/db/:from/select`, async function( req, res )
            {    
                var query = new queries.Query( { query: `select * from ${ req.params.from }` } );

                await query.exec();

                res.json( query.data );
            } );

            server.post( `/db/:from/update/:id`, async function( req, res )
            {      
                var query = new queries.Query( { query: `update ${ req.params.from } where id = ${ req.params.id }` } );

                await query.exec( req.body );

                res.json( query.data );
            } );
        };  
    
        functions[ "directory" ] = function( params )
        {   
            server.get( params.endpoint, ( req, res ) =>
            {   
                utils.directoryInfo( params.variables.directory, callback );

                function callback( info )
                {   
                    params.variables.files = info.files;
                    
                    res.render( params.template, params.variables );
                };
            } );
        };   

        functions[ "download" ] = function( params )
        {
            server.get( params.endpoint, ( req, res ) => 
            { 
                var info = utils.fileInfo( params.variables.directory, req.params.id );
            
                res.setHeader( 'Content-Length', info.stat.size );
                res.setHeader( 'Content-Type', info.type );
                res.setHeader( 'Content-Disposition', 'attachment; filename=' + info.filename );
            
                info.stream.pipe( res );

                res.status( 200 );
            } );
        };

        functions[ "file" ] = function( params )
        {   
            server.get( params.endpoint, ( req, res ) => 
            {   
                var info = utils.fileInfo( params.variables.directory, req.params.id );
                
                fs.readFile( info.file, ( err, data ) =>
                {
                    res.contentType( info.type );
                    res.send( data );
                } );
            } );
        };

        functions[ "logout" ] = function( params )
        {
            server.get( params.endpoint, ( req, res ) => 
            { 
                res.clearCookie( "auth" );
                
                res.redirect( "/" );
            } );
        };
        
        functions[ "id" ] = function( params )
        {
            server.get( params.endpoint, ( req, res ) =>
            {   
                params.variables.id = req.params.id;
                
                res.render( params.template, params.variables );
            } );
        };
    
        functions[ "static" ] = function( params )
        {
            server.get( params.endpoint, ( req, res ) => 
            { 
                res.render( params.template, params.variables );
            } );   
        };    

    routes.forEach( params => functions[ params.function ].call( null, params ) );
};

module.exports.nav = nav;

/*function extract( body )
{
    var data = {};

    if ( body )
    {
        var collections = new Map();

        for ( let field in body )
            data[ collection( field ).collection ] = {};

        for( let col of collections )
        {    
            let object = {};
            
            for ( let field in body )
            {
                let c = collection( field );

                if ( col[ 0 ] == c.collection )
                    object[ c.field ] = body[ field ];
            }

            data[ col[ 0 ] ] = object;

            collections.set( col[ 0 ], data[ col[ 0 ] ] );
        };

        function collection( name )
        {
            var s = name.split( "." );
            
            collections.set( s[ 0 ], {} );
            
            return { collection: s[ 0 ], field: s[ 1 ] };
        }
    }

    return data;
}*/