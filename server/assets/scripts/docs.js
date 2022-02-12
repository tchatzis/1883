function ac( parent, child )
{   
    parent.appendChild( child );
};

function bubble( el, tag )
{
    var current = el;

    while ( current.tagName != tag.toUpperCase() )
        current = current.parentNode;

    return current;
}

function ce( tag )
{
    return document.createElement( tag );
}

function clear( el, css )
{   
    Array.from( el.parentNode.children ).forEach( child =>
    {
        child.classList.remove( css );
    } );
}

const cookie =
{
    data: [],
    delim: "; ",
    delete: ( name ) => 
    { 
        cookie.data = [];
        document.cookie = `${ name }=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;` 
    },
    read: ( name ) => 
    {
        var object = {};
        
        cookie.data = decodeURIComponent( document.cookie );
        cookie.data = cookie.data.split( cookie.delim );
        cookie.data.forEach( pair =>
        {
            let tuple = pair.split( "=" );
            let name = tuple[ 0 ];
            let value = tuple[ 1 ];

            object[ name ] = value;
        } );
        
        return object[ name ];
    },
    write: ( name, value ) => 
    {
        cookie.delete( name );
        
        cookie.data.push( `${ name }=${ value }` );
        cookie.data.join( cookie.delim );

        document.cookie = cookie.data;
    }
};

function fe( parent, tag )
{
    return parent.querySelector( tag );
}

var docs = 
{
    ac: ac,
    ce: ce,
    bubble: bubble,
    clear: clear,
    cookie: cookie,
    fe: fe
};

export default docs;