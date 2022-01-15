const db = require( "./firebase" );

const Data = function( id, data, object )
{
    this.id = id;
    this.data = data;
    this.object = object;
    this.records = data.length;
};

const SQLParse = function( string )
{
    var split = string.split( " " );
    var object = this;

    this.action = split[ 0 ].toLowerCase();

    var actions = 
    {
        insert: function()
        {
            object.from = `/${ split[ 2 ] }`;

            return object;
        },
        select: function()
        {           
            // columns
            let keys = between( string, "select", "from" ).replace( /\s/g, "" ).split( "," );

            if ( keys != "*" )
                object.keys = keys;

            object.from = `/${ split[ split.indexOf( "from" ) + 1 ] }`;

            // where
            let where = between( string, "where", "and" ) || between( string, "where", "order" ) || between( string, "where", "limit" );

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
                let condition = by.trim().split( " " );

                object.orderby = condition;
            }

            // limit
            let index = split.indexOf( "limit" );
            let limit = index > -1 ? split[ index + 1 ] : null;

            if ( limit )
                object.limit = Number( limit );

            return object;
        }
    }

    actions[ this.action ]();

    function after( str, start )
    {
        return str.match( /by(.*)/ )[ 1 ] || null;
    }
            
    function between( str, start, end ) 
    {
        const result = str.match( new RegExp( `${ start }(.*)${ end }` ) );
    
        return result ? result[ 1 ] : null;
    }
};

const q = 
{
    collection:
    {
        insert: async function( query, params, callback )
        {
            let id = params.payload.label;
            let ref = db.collection( query.from );

            await ref.doc( id ).set( params.payload );

            callback( params );
        },
        select: async function( query, params, callback )
        {
            let ref = db.collection( query.from );
            let result = ref;

            if ( query.where && query.where.length )
                query.where.forEach( where => { result = result.where( ...where ) } );

            if ( query.orderby && query.orderby.length )
                result = result.orderBy( ...query.orderby );

            if ( query.limit )
                result = result.limit( query.limit );  
            
            let snapshot = await result.get();

            if ( !snapshot.empty )
                params.variables.db = new Data( snapshot.docs.map( ( doc ) => doc.id ), snapshot.docs.map( ( doc ) => { return {...doc.data() } } ), snapshot.docs.map( ( doc ) => { return { [ doc.id ]: { ...doc.data() } } } ) );
            else
                params.variables.db = [];

            params.variables.collection = query.from.substring( 1 );

            callback( params );
        }
    }
};

module.exports.Query = function( params, callback )
{
    this.query = new SQLParse( params.query );

    let length = this.query.from.split( "/" ).length;

    this.type = length % 2 ? "doc" : "collection";

    //console.log( "queries: Query", this );

    q[ this.type ][ this.query.action ]( this.query, params, callback ); 
};