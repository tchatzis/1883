function equals( date1, date2, fields )
{
    var d1 = parse( date1 );
    var d2 = parse( date2 );
    var array = [];
    var test = fields || [ "date", "month", "year" ];
        test.forEach( comp => array.push( d1[ comp ] == d2[ comp ] ) );

    return array.every( comp => comp );
}

function format( current, delim )
{
    var regex = /^\d{4}[/.-](0[1-9]|1[0-2])[/.-](0[1-9]|[12][0-9]|3[01])$/;

    if ( regex.test( current ) )
        return current.replace( /\//g, "-" );
    
    if ( !current )
        return null;
    else if ( current.getMonth )
    {
        let delimiter = delim || "/";
        let month = current.getMonth() + 1;
        let mm = month < 10 ? `0${ month }` : month;
        let date = current.getDate()
        let dd = date < 10 ? `0${ date }` : date;
        let value = [ current.getFullYear(), mm, dd ].join( delimiter );

        return value;
    }
    else
        return null;
}

function parse( date )
{
    var data = {};
        data.current = date; 
        data.date = date.getDate();
        data.day = date.getDay();
        data.Day = date.toLocaleDateString( "EN-US", { weekday: "long" } );
        data.month = date.getMonth();
        data.Month = date.toLocaleDateString( "EN-US", { month: "long" } );
        data.year = date.getFullYear();
        data.first = new Date( data.year, data.month, 1 );
        data.begin = new Date( data.year, data.month, 1 - data.first.getDay() );  
        data.last = new Date( data.year, data.month + 1, 0 );
        data.end = new Date( data.year, data.month + 1, 6 - ( data.last.getDay() % 7 ) );

    return data;
}

export default
{
    equals: equals,
    format: format,
    parse: parse
}