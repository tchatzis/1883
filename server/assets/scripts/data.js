import Templates from "./templates.js";

const Data = function()
{
    var scope = this;
    var templates = new Templates();

    function sort( data, field )
    { 
        var sorted = [];
        var values = [];

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

    this.delete = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();

        templates.change.call( scope, params, result );
    };

    this.modify = function( result )
    {
        scope.data.forEach( record => 
        { 
            if ( Object.keys( record ).every( doc => doc == result.docs ) )
            {
                Object.assign( record, result.data[ 0 ] );
            }
        } );
    };

    this.path = async function( params )
    {
        var response = await fetch( "/path", { method: "post", body: JSON.stringify( params ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();
        var path = params.path.split( "/" );

        scope.from = params.path; 
        scope.fields = path.pop();
        scope.data = result.data;
    };

    this.query = async function( params )
    {
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.from = params.url.split( "/" )[ 2 ];
        scope.fields = result.fields;
        scope.sort = params.sort;
        scope.data = sort( result.data, scope.sort );
    };

    this.render = function( params )
    {
        templates.init.call( scope, params );
    };

    this.select = async function( params )
    {
        var response = await fetch( params.url, { method: "post" } );
        var result = await response.json();

        scope.from = params.url.split( "/" )[ 2 ];
        scope.fields = result.fields;
        scope.sort = params.sort;   
        scope.data = sort( result.data, scope.sort );
    };

    this.sorter = function( field )
    {
        scope.sort = field;
        scope.data = sort( scope.data, field );   
    };

    this.update = async function( params )
    {
        var response = await fetch( params.url, { method: "post", body: JSON.stringify( params.body ), headers: { "Accept": "application/json", "Content-Type": "application/json" } } );
        var result = await response.json();

        scope.modify( result );
        scope.sorter( scope.sort );
        templates.data = [ ...scope.data ];

        templates.change.call( scope, params, result );
    };
};

export default Data;