import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";
import Multi from "./multi.js";

export default function Matrix( config )
{
    Common.call( this, config );
    Config.call( config, config );
    Multi.call( this, config );

    config.default = {};
    
    var data = this.getData( config );
    var scope = this;
    var widgets = config.scope.imports.widgets;

    this.block( config );
    this.label.innerText = config.name || "\n";

    var table = docs.ce( "table" );
    docs.ac( this.parent, table );

    function change( e )
    {
        var input = e.target;
        var form = input.form;
        var forms = Array.from( form.parentNode.children );

        scope.update( forms );
    }

    this.update = function( forms )
    {   
        forms.forEach( form =>
        {
            var column = form.dataset.column;

            data[ column ] = data[ column ] || {};
            
            for ( let element of form.elements ) 
                data[ column ][ element.name ] = element.value;
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

            var forms = [];

            // add forms
            scope.data.docs.forEach( doc =>
            {
                var id = doc.getKey();
                var column = doc.getValue()[ config.model.field ];
                var form = docs.ce( "form" );
                    form.setAttribute( "method", "post" );
                    form.id = id;
                    form.dataset.column = column;
                docs.ac( td, form );

                forms.push( form );
            } );

            // column headers
            var columns = this.data.values;
                columns.forEach( doc => 
                {    
                    var td = docs.ce( "td" );
                        td.classList.add( "cell" );
                        td.innerText = doc[ config.model.field ];
                    docs.ac( tr, td );
                } );

            // widget rows
            config.widgets.forEach( ( widget ) =>
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
                    var td = docs.ce( "td" );
                        td.classList.add( "cell" );
                    docs.ac( tr, td );
                    var id = _doc.getKey();
                    var doc = _doc[ id ];
                    var array = doc[ widget.config.name ] || [];
                    var _config = new widgets.Config( widget.config.name, this, config );
                        _config.parent = td;
                        _config.Form = id;
                        _config[ "data-column" ] = doc[ config.model.field ];
                        _config.headless = true;
                        _config.model = Object.assign( widget.config.model, { array: array, data: config.model.data } );
                        _config.listeners = [ { event: "input", handler: change } ];
                        _config.value = config.doc.getPath( [ config.name, doc[ config.field ], widget.config.name ] ).value;

                    Object.assign( widget.config, _config );

                    widgets.add( { active: true, class: widget.class, config: widget.config } ); 
                } );
            } );

            scope.update( forms );
        }
    };

    config.data.load.call( scope, config );
}