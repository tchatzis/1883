import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";
import Multi from "./multi.js";

export default function Matrix( config )
{
    Common.call( this );
    Multi.call( this, config );
    
    config.doc = config.scope.getDoc();
    config.default = {};

    var data = config.doc.data?.[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];
    var scope = this;

    this.block( config );
    this.label.innerText = config.name || "\n";

    var table = docs.ce( "table" );
    docs.ac( div, table );

    function change( e )
    {
        var input = e.target;
        var form = input.form;
        var forms = Array.from( form.parentNode.children );

        scope.update( forms );
    }

    this.update = function( forms )
    {   
        var doc = config.doc[ config.name ];

        if ( typeof doc !== "object" )
            doc = Object.assign( config.doc, { [ config.name ]: {} } );

        forms.forEach( form =>
        {
            for ( let element of form.elements ) 
            {    
                if ( doc[ element.id ] )
                    Object.assign( doc[ element.id ], { [ element.name ]: element.value } );
                else if ( object[ config.name ] )
                    Object.assign( doc[ config.name ], { [ element.id ]: { [ element.name ]: element.value } } );
                else
                    Object.assign( config.values[ config.name ], { [ element.id ]: { [ element.name ]: element.value } } );    
            }
        } );
    }; 
    
    this.populate = function() 
    {     
        if ( this.data )
        {   
            // header row
            var tr = docs.ce( "tr" );
            docs.ac( table, tr );

            var td = docs.ce( "td" );
            docs.ac( tr, td );

            // add forms
            scope.data.docs.forEach( doc =>
            {
                var id = Object.keys( doc )[ 0 ];
                var form = docs.ce( "form" );
                    form.setAttribute( "method", "post" );
                    form.id = id;
                docs.ac( td, form );
            } );

            var forms = Array.from( td.children );

            // column headers
            var columns = this.data.values;
                columns.forEach( doc => 
                {    
                    var td = docs.ce( "td" );
                        td.classList.add( "cell" );
                        td.innerText = doc[ config.field ];
                    docs.ac( tr, td );
                } );

            // widget rows
            config.widgets.forEach( function( widget )
            {  
                var tr = docs.ce( "tr" );
                docs.ac( table, tr );
                
                // cell header
                var td = docs.ce( "td" );
                    td.classList.add( "cell" );
                    td.innerText = widget.config.name;
                docs.ac( tr, td );

                // select data for each cell
                scope.data.docs.forEach( async ( _doc ) => 
                {
                    var id = _doc.getKey();
                    var doc = _doc[ id ];
                    var array = doc[ widget.config.name ] || [];

                    var td = docs.ce( "td" );
                        td.classList.add( "cell" );
                    docs.ac( tr, td );

                    widget.config.parent = td;
                    widget.config.Form = id;
                    widget.config.id = doc[ config.field ];
                    widget.config.headless = true;
                    widget.config.array = array;
                    widget.config.listeners = [ { event: "change", handler: ( e ) => change( e ) } ];
                    widget.config.value = config.doc.getPath( [ config.name, doc[ config.field ], widget.config.name ] ).value;

                    new widgets[ widget.class ]( widget.config ); 
                } );
            } );

            scope.update( forms );
        }
    };

    config.data.load.call( scope, config );
}