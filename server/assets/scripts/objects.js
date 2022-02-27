Object.defineProperty( Object.prototype, 'tuple', 
{
    value: function()
    {
        return { [ this.name ]: this.value };
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'untuple', 
{
    value: function()
    {
        var tuple = {};
            tuple.name = this.getKey();
            tuple.value = this.getValue();

        return tuple;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'getPath', 
{
    value: function( path )
    {
        var value = { ...this };
        var key, object;

        for ( let prop of path )
        {
            key = prop;
            object = { ...value };
            value = value?.[ prop ];
        }

        return { key: key, object: object, path: path, value: value };
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'setPath', 
{
    value: function( path, value )
    {
        var object = { ...this };
        var last = path.length - 1;
        var key;

        for ( let i = 0; i < last; ++ i ) 
        {
            key = path[ i ];

            if ( !( key in object ) )
                object[ key ] = value;

            object = object[ key ];
        }

        return { key: key, object: object, path: path, value: value };
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'getKey', 
{
    value: function()
    {
        return this.getKeyValue().key;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'getKeyValue', 
{
    value: function()
    {
        var object = { ...this };
        var key = Object.keys( object )[ 0 ];
        var value = object[ key ];

        return { key: key, object: object, path: [], value: value };
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'getValue', 
{
    value: function()
    {
        return this.getKeyValue().value;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'findKey', 
{
    value: function( key )
    {
        var result;

        function search( object, path )
        {
            if ( typeof object !== "object" )
                return result;
    
            for ( let prop in object )
            {
                path.push( prop );
                search( object[ prop ], path );

                if ( prop == key )
                {    
                    result = { key: key, object: object, path: [ ...path ], value: object[ prop ] };
                    return result;
                } 

                path.pop();
            }
            
        }

        search( this, [] );
    
        return result;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'findKeyValue', 
{
    value: function( key, val )
    {
        var result;
        
        function search( object, path )
        {
            if ( typeof object !== "object" )
                return object;
    
            for ( let prop in object )
            {
                path.push( prop );
                search( object[ prop ], path );
                
                if ( prop == key && object[ prop ] == val )
                {
                    result = { key: key, object: object, path: [ ...path ], value: object[ prop ] };
                    return result;
                }

                path.pop();             
            }
        }

        search( this, [] );
    
        return result;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'findValue', 
{
    value: function( key, val )
    {
        var result;
        
        function search( object )
        {
            if ( typeof object !== "object" )
                return object;
    
            for ( let prop in object )
            {
                path.push( prop );
                search( object[ prop ] );  
                
                if ( object[ prop ] == val )
                {
                    result = { key: key, object: object, path: [ ...path ], value: object[ prop ] };
                    return result;
                }
                path.pop();      
            }
        }

        search( this );
    
        return result;
    },

    enumerable: false
} );

Object.defineProperty( Object.prototype, 'sortKey', 
{
    value: function( field )
    {
        var data = this;
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
                    if ( obj?.hasOwnProperty( key ) )
                    {                
                        if ( obj[ key ]?.hasOwnProperty( field ) )
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
                        else
                        {
                            console.info( field, "is not defined in", key, obj, "with value", obj[ key ] );
                        }
                    }
                }
            } );

            return sorted;
        }
    },

    enumerable: false
} );

Object.defineProperty( Array.prototype, 'flatten', 
{
    value: function()
    {
        var string = this;
        
        while ( Array.isArray( string ) )
            string = string[ 0 ];

        return string;
    },

    enumerable: false
} );

export default Object.prototype;