const db = require( "./firebase" );

const Data = function( data )
{
    var scope = this;
        scope.data = [];
    var fields = [];
    var ids = [];

    this.append = function( data )
    {
        if ( data )
        {
            scope.data.push( data );
            ids = ids.concat( Object.keys( data ) );
        }

        scope.records = scope.data.length;

        columns();
    };
    
    function columns()
    {
        scope.data.forEach( obj =>
        {           
            Object.keys( obj ).forEach( id =>
            {
                if( Object.keys( obj[ id ] ).length )
                    Object.keys( obj[ id ] ).forEach( field =>
                    {
                        fields.indexOf( field ) < 0 ? fields.push( field ) : null;  
                    } );
                else
                    fields.indexOf( id ) < 0 ? fields.push( id ) : null;
            } );
        } );

        scope.fields = fields.sort();
        scope.ids = ids;
    }

    this.append( data );
};

const SQLParse = function( string )
{
    var object = this;
    var split = string.split( " " );

    this.action = split[ 0 ].toLowerCase();

    var actions = 
    {
        delete: function()
        {
            object.from = `/${ split[ 2 ] }`;
            object.type = type( object );

            // where
            let where = after( string, "where" );

            if ( where )
            {
                let condition = where.trim().split( " " );
                
                object.where = [ condition ];
            }
        },
        insert: function()
        {
            object.from = `/${ split[ 2 ] }`;
            object.type = type( object );
        },
        select: function()
        {           
            // columns
            let fields = between( string, "select", "from" ).replace( /\s/g, "" ).split( "," );

            if ( fields != "*" )
                object.fields = fields;

            object.from = `/${ split[ split.indexOf( "from" ) + 1 ] }`;
            object.type = type( object );

            // where
            let where = between( string, "where", "and" ) || between( string, "where", "order" ) || between( string, "where", "limit" ) || after( string, "where" );

            if ( where )
            {
                let condition = where.trim().split( " " );
                
                object.where = [ condition ];
            }

            // and
            let ands = [];

            split.forEach( ( word, i ) => 
            {     
                if ( word == "and" )
                    ands.push( i ); 
            } );

            ands.forEach( index =>
            {
                let and = between( string, "and", "and" ) || between( string, "and", "order" ) || between( string, "and", "limit" ) || after( string, "and" );
                let condition = and.trim().split( " " );

                object.where.push( condition );
            } );

            // order by
            let orderby = split[ split.indexOf( "by" ) + 1 ];

            if ( orderby )
            {
                let by = between( string, "by", "limit" ) || after( string, "by" );

                if ( by )
                {
                    let condition = by.trim().split( " " );

                    object.orderby = condition;
                }
            }

            // limit
            let index = split.indexOf( "limit" );
            let limit = index > -1 ? split[ index + 1 ] : null;

            if ( limit )
                object.limit = Number( limit );
        },
        update: function()
        {
            object.from = `/${ split[ 1 ] }`;
            object.type = type( object );

            // where
            let where = after( string, "where" );

            if ( where )
            {
                let condition = where.trim().split( " " );
                
                object.where = [ condition ];
            }
        }
    };

    actions[ this.action ]();

    function after( str, start )
    {
        var regex = new RegExp( `${ start }(.*)` );
        var result = str.match( regex );
        
        return result ? result[ 1 ] : null;
    }
            
    function between( str, start, end ) 
    {
        var regex = new RegExp( `${ start }(.*)${ end }` );
        var result = str.match( regex );
    
        return result ? result[ 1 ] : null;
    }

    function type( object )
    {
        return object.from.split( "/" ).length % 2 ? "doc" : "collection";
    }
};

const action =
{
    collection:
    {
        delete: async function( query )
        {
            var id = query.where[ 0 ][ 2 ];
            var doc = db.collection( query.from ).doc( id );
                doc.delete();
            var data = new Data( { [ id ]: {} } );
                data.collection = query.from;

            return data;
        },
        insert: async function( query, data )
        {   
            var ref = await db.collection( query.from ).add( data );
            var data = new Data( { [ ref.id ]: data } );
                data.collection = query.from;

            return data;
        },
        select: async function( query )
        {
            var ref = db.collection( query.from );
            var result = ref;
            var data = new Data();
                data.collection = query.from;

            if ( query.where && query.where.length )
                query.where.forEach( where => { result = result.where( ...where ) } );

            if ( query.orderby && query.orderby.length )
                result = result.orderBy( ...query.orderby );

            if ( query.limit )
                result = result.limit( query.limit ); 
            
            let snapshot = await result.get();

            if ( !snapshot.empty )
            {
                snapshot.docs.forEach( doc =>
                {
                    var d = doc.data();

                    if ( query.fields )
                    {
                        let obj = {};
                        query.fields.forEach( field => obj[ field ] = d[ field ] );

                        data.append( obj );
                    }
                    else
                    {
                        let obj = { [ doc.id ]: d };
                        data.append( obj );
                    }
                } );
            }

            return data;
        },
        update: async function( query, data )
        {
            var id = query.where[ 0 ][ 2 ];
            var doc = db.collection( query.from ).doc( id );
                doc.update( data );
            var data = new Data( { [ id ]: data } );
                data.collection = query.from;

            return data;
        }
    },
    doc:
    {
        select: async function( params )
        {
            var ref = db[ params.type ]( params.path );
            var doc = await ref.get();
            var data = new Data( { [ params.field ]: doc.get( params.field ) || [] } );

            return data;
        },
        update: async function( params )
        {
            var ref = db[ params.type ]( params.path );
            await ref.set( { [ params.field ]: params.value }, { merge: true } );
            let data = new Data( { [ params.field ]: params.value } );

            return data;
        }
    }
};

module.exports.DB = ( collection, callback ) => db.collection( collection ).get().then( snapshot => snapshot.forEach( doc => callback( doc ) ) );

module.exports.Path = function( params )
{
    var scope = this;
    var path = params.path.split( "/" );

    params.type = path.length % 2 ? "collection" : "doc";
    params.field = path.pop();
    params.path = path.join( "/" );
    
    this.exec = async function( data )
    {
        scope.data = await action[ params.type ][ params.action ]( params, data );
        scope.data.collection = params.collection;
    };
};

module.exports.Query = function( params )
{   
    var scope = this;
    
    this.sql = params.query;
    this.query = new SQLParse( this.sql );

    this.exec = async function( data )
    {
        scope.data = await action[ scope.query.type ][ scope.query.action ]( scope.query, data );
    };
};