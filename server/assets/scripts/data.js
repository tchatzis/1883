const Data = function()
{
    var scope = this;

    // defaults
    this.docs = {};
    this.fields = {};
    this.schema = {};
    this.store = {};

    // methods
    this.append = function( result )
    {       
        var id = result.ids.flatten();
        var data = result.data.flatten();
        var doc = data[ id ];

        scope.store[ scope.collection ].push( { [ id ]: doc } );    
    };

    this.default = function( object, key, value )
    {
        return Object.assign( object, { [ key ]: object[ key ] || value } );
    };

    this.delete = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();
    };

    this.filter = function( data, params )
    {   
        if( !params )
            return data;
        
        let result = [];

        [ ...data ].map( row => Object.values( row ).find( doc => 
        {
            if ( doc[ params.name ] == params.value || !doc[ params.name ] )
                result.push( row );        
        } ) );

        return result;
    };

    this.grow = async function( params )
    {   
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
    };

    this.insert = async function( params )
    {   
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.append( result );
        scope.store[ scope.collection ] = scope.store[ scope.collection ].sortKey( scope.schema[ scope.collection ].sort );
    };

    this.load = async function( params )
    {
        function values( collection )
        {
            let values = [];

            scope.store[ collection ] = scope.store[ collection ].sortKey( params.sort );
            
            scope.store[ collection ].forEach( row =>
            {
                values.push( row[ Object.keys( row ) ] );
            } );

            return values;
        }
        
        if ( params.path )
        {
            let collection = params.collection;
            
            if ( !scope.store[ collection ] )
                await scope.path( params );

            this.data = { name: params.name, values: values( collection ), collection: collection, docs: scope.docs[ collection ] };
            this.populate( params );

            return this.data;
        }

        if ( params.array )
        {
            this.data = { name: params.name, values: params.array };
            this.populate();

            return this.data;
        }

        if ( params.query )
        {   
            var split = params.query.split( " " );
            var from = split.indexOf( "from" );
            let collection = split[ from + 1 ];
            
            if ( !scope.store[ collection ] )
                await scope.query( { url: `/query`, sort: params.sort, query: params.query } );

            this.data = { name: params.name, values: values( collection ), collection: collection, docs: scope.docs[ collection ] };
            this.populate();

            return this.data;
        } 
    };

    this.modify = function( result )
    {   
        scope.store[ scope.collection ].forEach( docs => 
        { 
            if ( Object.keys( docs ).every( id => id == result.docs ) )
                docs = result.data[ 0 ];
        } );
    };

    this.path = async function( params )
    {
        var response = await fetch( "/path", { method: "post", body: JSON.stringify( params ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
        var collection = result.collection;

        scope.docs[ collection ] = result.data;
        scope.fields[ collection ] = result.fields;
        scope.store[ collection ] = result.data.sortKey( scope.schema[ scope.collection ].sort ); 
    };

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

        scope.docs[ collection ] = result.data;
        scope.fields[ collection ] = result.fields;
        scope.store[ collection ] = result.data.sortKey( params.sort );
    };

    this.select = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();
        var collection = result.collection.substring( 1 );

        scope.collection = collection;
        scope.docs[ scope.collection ] = result.data;
        scope.fields[ scope.collection ] = result.fields; 
        scope.store[ scope.collection ] = result.data.sortKey( scope.schema[ scope.collection ].sort );
    };

    this.update = async function( params )
    {         
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.doc ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.modify( result );

        scope.store[ scope.collection ] = scope.store[ scope.collection ].sortKey( scope.schema[ scope.collection ].sort );
    };
};

export default Data;