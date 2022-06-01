var DND = function()
{
    var scope = this;

    this.drop = ( e ) =>
    {
        e.stopPropagation();

        var el = scope.find( e ); 

        if ( scope.element !== el )  
        {
            scope.element.innerHTML = el.innerHTML;
            el.innerHTML = e.dataTransfer.getData( 'text/html' );
        }

        scope.reorder( el );
        scope.callback( el );

        return false;
    };
    
    this.end = ( e ) =>
    {
        e.target.style.opacity = 1;

        scope.items.forEach( item => item.classList.remove( "over" ) );
    };

    this.enter = ( e ) =>
    {
        var el = scope.find( e );   
            el.classList.add( "over" );
    };

    this.leave = ( e ) =>
    {
        var el = scope.find( e );   
            el.classList.remove( "over" );
    };

    this.init = ( parent, find, values, callback ) =>
    {
        scope.callback = callback || function(){};
        scope.parent = parent;
        scope.find = find;
        scope.items = Array.from( scope.parent.children );
        scope.values = values;

        scope.items.forEach( ( item, index ) => 
        {
            item.setAttribute( "draggable", true ) 
            item.setAttribute( "data-index", index );
            item.addEventListener( 'dragstart', scope.start );
            item.addEventListener( 'dragover', scope.over );
            item.addEventListener( 'dragenter', scope.enter );
            item.addEventListener( 'dragleave', scope.leave );
            item.addEventListener( 'dragend', scope.end );
            item.addEventListener( 'drop', scope.drop );
        } );
    };

    this.over = ( e ) =>
    {
        e.preventDefault();

        return false;
    };

    this.reorder = ( el ) =>
    {        
        var dropIndex = Number( el.dataset.index );
        var dragIndex = Number( scope.element.dataset.index );
        var dragValue = scope.values.splice( dragIndex, 1 )[ 0 ];

        scope.values.splice( dropIndex, 0, dragValue );
    };

    this.start = ( e ) =>
    {
        scope.element = e.target;

        e.target.style.opacity = 0.5;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData( 'text/html', e.target.innerHTML );
    };
};

export default DND;