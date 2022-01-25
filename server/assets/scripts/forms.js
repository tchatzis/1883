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
            if ( temp[ prop ].length == 1 )
                body[ prop ] = temp[ prop ][ 0 ];
            else
                body[ prop ] = temp[ prop ]          
        }
    }

    return body;
}

export default parse;