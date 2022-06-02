module.exports.test = async ( app ) =>
{
    const http = require( "http" );
    
    return new Promise( ( resolve ) => 
    {
        const request =  http.get( "http://www.google.com", () =>
        {
            online( app );
            resolve();
        } );

        request.on( "error", ( err ) => 
        {
            console.log( "offline" )
            offline( app );
            resolve();
        } );
    } );
}

function offline( app )
{
    console.log( "offline" );
    
    app.get( "/strategy", ( req, res ) => 
    { 
        res.render( "static", { title: "Offline", content: "strategy" } );
    } ); 
}

async function online( app )
{
    const fs = require( "fs" );
    const db = require( "./utilities/firebase" );
    const queries = require( "./utilities/queries" );
    const utils = require( "./utilities/functions" );
    const { networkInterfaces } = require( "os" );
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
        Custom: function( label, endpoint)
        {
            var variables = {};
                variables.content = endpoint.replace( "/", "" );
                variables.ip = getIP();
            
            this.label = label;
            this.endpoint = endpoint;
            this.template = "static";
            this.function = "custom";
            this.variables = main.append( label, endpoint, variables );
        },
        
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
    var routes =
    [
        new Route.Data()
    ];

    await db.collection( "schema" ).orderBy( "sequence", "desc" ).get().then( ( querySnapshot ) => 
    {
        querySnapshot.forEach( ( doc ) => 
        {
            var schema = doc.data();

            routes.push( new Route[ schema.class ]( schema.label, schema.endpoint, schema.parameters ) );
        } );

        routes.push( new Route.Logout( "Log Out", "/logout" ) );
    } );

    define( app );

    function getIP()
    {
        const nets = networkInterfaces();
        const results = {};
        
        for ( const name of Object.keys( nets ) ) 
        {
            for ( const net of nets[ name ] ) 
            {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if ( net.family === 'IPv4' && !net.internal ) 
                {
                    if ( !results[ name ] )
                    {
                        results[ name ] = [];
                    }

                    results[ name ].push( net.address );
                }
            }
        }

        return results[ 'eth0' ][ 0 ];
    }

    function define( app )
    {
        var functions = {};

            functions[ "custom" ] = function( params )
            {
                app.get( params.endpoint, ( req, res ) => 
                {
                    res.render( params.template, params.variables );
                } );   
            };  
            
            functions[ "data" ] = async function( params )
            {
                app.post( `/firestore`, async function( req, res )
                {                    
                    var path = new queries.DB( req.body );

                    console.log( req.body );

                    //var label = doc.get( "label" );
                    //doc.ref.delete();
                    //doc.ref.update( { group: FieldValue.delete(), type: [] } );

                    await path.exec( req.body );

                    res.json( path.data );
                } );
                
                app.post( `/path`, async function( req, res )
                {                    
                    var path = new queries.Path( req.body );

                    await path.exec( req.body );

                    res.json( path.data );
                } );

                app.post( `/query`, async function( req, res )
                {                                   
                    var query = new queries.Query( { query: req.body.query } );

                    await query.exec();

                    res.json( query.data );
                } );
            };
        
            functions[ "db" ] = async function( params )
            {     
                app.get( `${ params.endpoint }`, ( req, res ) =>
                {   
                    res.locals.path = req.path;
                    params.variables.ip = getIP();

                    res.render( `db/${ params.template }`, params.variables );
                } );

                // CRUD
                app.post( `/db/:from/delete/:id`, async function( req, res )
                {    
                    var query = new queries.Query( { query: `delete from ${ req.params.from } where id = ${ req.params.id }` } );

                    await query.exec();

                    res.json( query.data );
                } );

                app.post( `/db/:from/insert`, async function( req, res )
                {      
                    var query = new queries.Query( { query: `insert into ${ req.params.from }` } );

                    await query.exec( req.body );

                    res.json( query.data );
                } );
                
                app.post( `/db/:from/select`, async function( req, res )
                {    
                    var query = new queries.Query( { query: `select * from ${ req.params.from }` } );

                    await query.exec();

                    res.json( query.data );
                } );

                app.post( `/db/:from/update/:id`, async function( req, res )
                {      
                    var query = new queries.Query( { query: `update ${ req.params.from } where id = ${ req.params.id }` } );

                    await query.exec( req.body );

                    res.json( query.data );
                } );
            };  
        
            functions[ "directory" ] = function( params )
            {   
                app.get( params.endpoint, ( req, res ) =>
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
                app.get( params.endpoint, ( req, res ) => 
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
                app.get( params.endpoint, ( req, res ) => 
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
                app.get( params.endpoint, ( req, res ) => 
                { 
                    res.clearCookie( "auth" );
                    
                    res.redirect( "/" );
                } );
            };
            
            functions[ "id" ] = function( params )
            {
                app.get( params.endpoint, ( req, res ) =>
                {   
                    params.variables.id = req.params.id;
                    
                    res.render( params.template, params.variables );
                } );
            };
        
            functions[ "static" ] = function( params )
            {
                app.get( params.endpoint, ( req, res ) => 
                { 
                    params.variables.ip = getIP();
                                        
                    res.render( params.template, params.variables );
                } );   
            };    

        routes.forEach( params => functions[ params.function ].call( null, params ) );
    };

    module.exports.nav = nav;
}