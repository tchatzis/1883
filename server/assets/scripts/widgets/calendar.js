import Common from "./common.js";
import dates from "../dates.js";
import docs from "../docs.js";

export default function( config )
{
    Common.call( this, config );
    
    var scope = this;
    var today = new Date();
    var step = 1000 * 60 * 60 * 24;
    var table, th, tbody, tr;
    var parent = config.scope.form.parent || config.scope.getParent();

    this.data = config.model.data.store[ "event" ];

    function init()
    {
        if ( !scope.initialized )
        {    
            table = docs.ce( "table" );
            table.classList.add( "scope" );
            table.id = "scope";
            docs.ac( parent, table );

            var thead = docs.ce( "thead" );
            docs.ac( table, thead );

            tbody = docs.ce( "tbody" );
            tbody.id = "data";      
            docs.ac( table, tbody );

            var { begin, end } = range( config.value );

            for ( let day = begin, index = 0; day <= end; day += step, index++ )
            {
                let current = new Date( day );

                // add day column headers
                if ( index < 7 )
                {
                    if ( !( index % 7 ) )
                    {
                        th = docs.ce( "tr" );
                        docs.ac( thead, th );
                    }

                    let td = docs.ce( "td" );
                        td.classList.add( "column" );
                        td.innerText = dates.parse( current ).Day;
                    docs.ac( th, td );
                }
            }

            scope.initialized = true;
        }

        scope.render( config.value );
        scope.populate()
    };        

    function range( date )
    {
        var data = dates.parse( date );
        var begin = data.begin.getTime();
        var end = data.end.getTime();

        return { begin, end };
    }

    // draw calendar
    this.render = ( date ) =>
    {
        var { begin, end } = range( date );
        var selected = date;
        
        for ( let day = begin, index = 0; day <= end; day += step, index++ )
        {
            // add row
            if ( !( index % 7 ) )
            {
                tr = docs.ce( "tr" );
                docs.ac( tbody, tr );
            }

            let current = new Date( day );
            let css = current.getMonth() == selected.getMonth() ? "inside" : "outside";
            let value = dates.format( current );

            // add cell
            let td = docs.ce( "td" );
                td.classList.add( "day" );
                td.classList.add( css );
            if ( dates.equals( current, today ) )
                td.classList.add( "today" );
            if ( dates.equals( current, selected ) )
                td.classList.add( "current" );
                td.innerText = current.getDate();
                td.dataset.date = value;
                td.dataset.day = dates.parse( current ).Day;
                td.dataset.month = dates.parse( current ).Month;
                this.listeners( td, config, value );

            docs.ac( tr, td );
        }
    };

    // add events
    this.populate = function()
    {
        if ( this.data )
        {
            this.data.forEach( doc =>
            {
                var id = Object.keys( doc );
                var value = doc[ id ];
                var td = tbody.querySelector( `[ data-date = "${ value.date }" ]` );
                var div = docs.ce( "div" );
                    div.dataset.id = id;
                    div.innerText = value[ config.model.field ];
                    div.classList.add( "event" );
                    div.style.backgroundColor = value.color;
                    div.addEventListener( "click", ( e ) => config.scope.on.select( e, new config.scope.Doc( doc ) ), false );

                if ( td )
                    docs.ac( td, div );
            } );
        }
    };

    init();
}