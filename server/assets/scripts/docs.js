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

function fe( parent, tag )
{
    return parent.querySelector( tag );
}

var doc = 
{
    ac: ac,
    ce: ce,
    bubble: bubble,
    clear: clear,
    fe: fe
};

export default doc;