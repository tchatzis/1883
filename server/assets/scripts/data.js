const Data = function()
{
    var scope = this;

    function sort( data, field )
    { 
        var sorted = [];
        var values = [];

        if ( !field )
            return data;
        
        else
        {
            data.forEach( obj =>
            {   
                for ( let key in obj )
                { 
                    if ( obj.hasOwnProperty( key ) )
                    {                
                        let value = isNaN( obj[ key ][ field ] ) ? obj[ key ][ field ].toLowerCase() : obj[ key ][ field ];
                        let index = values.findIndex( val => val >= value );

                        if ( index < 0 )
                        {
                            values.push( value );
                            sorted.push( obj );
                        }
                        else
                        {
                            values.splice( index, 0, value );  
                            sorted.splice( index, 0, obj ); 
                        }
                    }
                }
            } );

            return sorted;
        }
    }

    this.append = function( result )
    {
        var doc = result.data[ 0 ][ result.docs ];

        scope.store[ scope.collection ].push( { [ result.docs ]: doc } );    
    };

    this.delete = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();
    };

    this.insert = async function( params )
    {   
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.id = result.docs[ 0 ];
        scope.append( result );
        scope.store[ scope.collection ] = sort( scope.store[ scope.collection ], scope.schema[ scope.collection ].sort );
    };

    this.filter = function( data, params )
    {   
        if( !params )
            return data;
        
        let result = [];

        [ ...data ].map( row => Object.values( row ).find( doc => 
        {
            if ( doc[ params.name ] == params.value )
                result.push( row );        
        } ) );

        return result;
    };

    this.grow = async function( params )
    {   
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
    };

    this.load = async function( params )
    {
        /*if ( params.path )
        {
            console.trace();
            await d.path( params );

            let values = [];
            let data = {};
            
            d.data.forEach( row =>
            {
                data.name = Object.keys( row )[ 0 ];
                data.values = row[ data.name ];
            } );

            this.data = data;
        }*/

        if ( params.query )
        {   
            var split = params.query.split( " " );
            var from = split.indexOf( "from" );
            var collection = split[ from + 1 ];
            
            if ( !scope.store[ collection ] )
                await scope.query( { url: `/query`, sort: params.sort, query: params.query } );

            let values = [];

            scope.store[ collection ] = sort( scope.store[ collection ], params.sort );
            
            scope.store[ collection ].forEach( row =>
            {
                values.push( row[ Object.keys( row ) ] );
            } );

            this.data = { name: params.name, values: values, collection: collection };
        }

        this.populate();
    };

    this.modify = function( result )
    {   
        scope.store[ scope.collection ].forEach( docs => 
        { 
            if ( Object.keys( docs ).every( id => id == result.docs ) )
                docs = result.data[ 0 ];
        } );
    };

    /*this.path = async function( params )
    {
        var response = await fetch( "/path", { method: "post", body: JSON.stringify( params ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
        var path = params.path.split( "/" );

        scope.collection = params.path; 
        scope.fields = path.pop();
        scope.store[ scope.collection ] = result.data;
    };*/

    this.remove = function( doc )
    {
        var index = scope.store[ scope.collection ].findIndex( row => row == doc );

        if ( index > -1 )
            scope.store[ scope.collection ].splice( index, 1 );
    };

    this.query = async function( params )
    {   
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
        var collection = result.collection.substring( 1 );

        scope.fields[ collection ] = result.fields;
        scope.store[ collection ] = result.data;
    };

    this.select = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();

        scope.collection = params.url.split( "/" )[ 2 ];
        scope.fields[ scope.collection ] = result.fields; 
        scope.store[ scope.collection ] = sort( result.data, scope.schema[ scope.collection ].sort );
    };

    this.fields = {};
    this.schema = {};
    this.store = {};

    this.update = async function( params )
    {         
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.modify( result );

        scope.collection = params.url.split( "/" )[ 2 ];
        scope.store[ scope.collection ] = sort( scope.store[ scope.collection ], scope.schema[ scope.collection ].sort );
    };
};

export default Data;