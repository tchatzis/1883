const queries = require( "./utilities/queries" );
const checklists = require( "./data/checklists" );
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
            vars.title = label;
        
        links.push( new Link( label, endpoint ) );

        return vars;
    };

    nav[ name ] = links; 
};

const main = new Menu( "main" );

const Route = {};

Route.DB = function( label, endpoint, template, variables, query )
{
    this.label = label;
    this.template = template;
    this.endpoint = endpoint;
    this.function = "db";
    this.variables = main.append( label, endpoint, Object.assign( variables, { title: label } ) ); 
    this.query = query;
};

Route.Directory = function( label, endpoint, template, variables )
{
    this.label = label;
    this.template = template || "directory";
    this.endpoint = endpoint;
    this.function = "directory";
    this.variables = main.append( label, endpoint, Object.assign( variables, { title: label } ) );  
};

Route.Download = function( label, endpoint, template, variables )
{
    this.label = label;
    this.template = template || "downloads";
    this.endpoint = endpoint;
    this.function = "download";
    this.variables = main.append( label, endpoint, Object.assign( variables, { title: label } ) );  
};

Route.File = function( label, endpoint, template, variables )
{   
    this.label = label;
    this.endpoint = endpoint;
    this.template = null;
    this.function = "file";
    this.variables = main.append( label, endpoint, Object.assign( variables, { title: label, path: endpoint } ) );  
};

Route.ID = function( label, endpoint, template, variables )
{
    this.label = null;
    this.template = template;
    this.endpoint = endpoint;
    this.function = "id";
    this.variables = main.append( label, endpoint, variables );  
};

Route.Submenu = function( label, endpoint, template, variables )
{   
    this.label = label;
    this.endpoint = endpoint;
    this.template = template || "submenu";
    this.function = "static";
    this.variables = main.append( label, endpoint, Object.assign( variables, { title: label, path: endpoint } ) );  
};

Route.Static = function( label, endpoint, template, variables )
{
    this.label = label;
    this.endpoint = endpoint;
    this.template = template;
    this.function = "static";
    this.variables = main.append( label, endpoint, variables );
};

// routing
// "label", "endpoint", "template", { variables }
var routes =
[
    new Route.Static( "Home", "/", "nosubmenu" ),
    new Route.DB( "", "/db/create/:data", "data", {}, "select * from stock order by label desc" ),// , { action: "select", from: "/stock", where: [ [ "born", ">=", 1815 ] ], orderby: [ "first", "desc" ], limit: 2 }, "select * from users where first >= A order by first desc limit 1"*/
    new Route.Static( "Events", "/events", "submenu" ),
    new Route.Static( "Menus", "/menus", "submenu" ),
    new Route.ID( "", "/checklists/:id", "partials/checklist", checklists ),
    new Route.Submenu( "Checklists", "/checklists", null, checklists ),
    new Route.File( "", "/documents/:id", null, { directory: "assets/documents" } ),
    new Route.Directory( "Documents", "/documents", null, { directory: "assets/documents" } ),
    new Route.Download( "", "/downloads/:id", null, { directory: "assets/documents" } ),
    new Route.Directory( "Downloads", "/downloads", "downloads", { directory: "assets/documents" } ),
];

module.exports.nav = nav;

module.exports.get = function( server )
{
    var functions = {};

        functions[ "db" ] = function( params )
        {   
            if ( params.query )
                new queries.Query( params, get );

            function get( params )
            { 
                server.get( params.endpoint, ( req, res ) =>
                {   
                    render( res, res, params );
                } );

                post( params );
            }

            function post( params )
            {
                server.post( params.endpoint, ( req, res ) =>
                {   
                    var data = extract( req.body );

                    for ( let col in data )
                    {       
                        params.query = `INSERT INTO ${ col } }`;
                        params.payload = data[ col ];
                        
                        new queries.Query( params, ( params ) => render( res, req, params ) );
                    }
                } );
            }

            function render( res, req, params )
            {
                res.render( req.url.substring( 1 ), params.variables ); 
            }
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
                var info = utils.fileInfo( params.variables.directory, req.params.filename );

                fs.readFile( info.file, ( err, data ) =>
                {
                    res.contentType( info.type );
                    res.send( data );
                } ); 
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

function extract( body )
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
}