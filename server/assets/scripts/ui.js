const UI = function()
{
    this.elements = {};
    
    this.setElement = ( el ) =>
    {
        this.elements[ el.id ] = { id: el.id, el: el };
    };

    this.getElement = ( id ) => this.elements[ id ];

    this.getText = ( text ) =>
    {   
        switch ( typeof text )
        {
            case "string":   
                let maxlength = 32;
                let br = text.indexOf( "</p>" );
                let regex = /( |<([^>]+)>)/ig;
                    text = text.replace( regex, " " );
                let period = text.indexOf( "." ) > -1 ? text.indexOf( "." ) : maxlength;
                let index = Math.min.apply( null, [ br, period, maxlength ] );

                return index > -1 ? text.substring( 0, index ) : text;

            case "undefined":
                return "";    

            case "object":
                if ( !text ) 
                    return "";  

                if ( Array.isArray( text ) )
                    return ( typeof text[ 0 ] == "object" ) ? text.length : text;
                else
                    return Object.keys( text );

            default:
                return text;
        }
    };
};

export default UI;