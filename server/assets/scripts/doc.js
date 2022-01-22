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

function clear( tag )
{
    var el = document.querySelector( tag );
    
    Array.from( el.children ).forEach( child =>
    {
        child.classList.remove( "active" );
    } );
}

var doc = 
{
    ac: ac,
    ce: ce,
    bubble: bubble,
    clear: clear
};

export default doc;