import docs from "../docs.js";

export async function load()
{
    var payload = 
    {
        grant_type: "authorization_code",
        access_type: "offline",
        client_id: "MIYN2GKBASJXE1MGLQI3ABC4NPXUCPLX@AMER.OAUTHAP",
        redirect_uri: window.location.href.split( "?" )[ 0 ]
    };
    
    const params = new Proxy( new URLSearchParams( window.location.search ), { get: ( params, prop ) => params.get( prop ) } );
        params.code ? token() : authorize();

    function authorize()
    {
        var link = document.createElement( "a" );
            link.href = `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${ encodeURIComponent( window.location.href ) }&client_id=${ payload.client_id }`;
            link.innerText = "Authorize";
            link.target = "_self";

        docs.ac( content, link );
    }

    function token()
    {
        payload.code = decodeURIComponent( params.code );

        var link = docs.ce( "a" );
            link.href = "https://developer.tdameritrade.com/authentication/apis/post/token-0";
            link.innerText = "Get Token";
            link.target = "_blank";

        docs.ac( content, link );

        var code = document.createElement( "pre" );
            code.style.whiteSpace = "pre-wrap";
            code.style.wordWrap = "break-word";
            populate( code );

        docs.ac( content, code );
    }

    function populate( parent )
    {
        for ( let prop in payload )
        {
            if ( payload.hasOwnProperty( prop ) )
            {
                let row = docs.ce( "div" );
                    row.classList.add( "row" );
                docs.ac( parent, row );

                let label = docs.ce( "div" );
                    label.classList.add( "label" );
                    label.innerText = prop;
                docs.ac( row, label );

                let value = docs.ce( "div" );
                    value.classList.add( "cell" );
                    value.style.cursor = "pointer";
                    value.style.userSelect = "text";
                    value.innerText = payload[ prop ];
                    value.addEventListener( "mouseup", copy );
                docs.ac( row, value );
            }
        }
    }

    function copy( e )
    {
        var el = e.target;
        var selection = window.getSelection();
            selection.removeAllRanges();

        var range = document.createRange();
            range.selectNodeContents( el );
                
        selection.addRange( range );

        navigator.clipboard.writeText( el.innerText );
    }
}