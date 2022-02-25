function parse( e )
{
    const fields = new FormData( e.target );

    var body = {};
    var temp = {};
    var entries = fields.entries();

    for ( let field of entries )
    {
        if ( temp.hasOwnProperty( field[ 0 ] ) )
            temp[ field[ 0 ] ].push( field[ 1 ] )
        else
            temp[ field[ 0 ] ] = [ field[ 1 ] ];
    }

    for ( let prop in temp )
    {
        if ( temp.hasOwnProperty( prop ) )
        {
            let value = ( temp[ prop ].length == 1 ) ? temp[ prop ][ 0 ] : temp[ prop ];
                value = value.trim();
                value = Date.parse( value ) ? value.replace( /-/g, "/" ) : value;
            
            body[ prop ] = +value || value;       
        }
    }

    return body;
}

export default parse;