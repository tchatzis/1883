
import docs from "./docs.js";

import Arrays from "./widgets/array.js";
import Calendar from "./widgets/calendar.js";
import Checkboxes from "./widgets/checkboxes.js";
import Color from "./widgets/color.js";
import Common from "./widgets/common.js";
import Control from "./widgets/control.js";
import Date from "./widgets/date.js";
import Datalist from "./widgets/datalist.js";
import Drilldown from "./widgets/drilldown.js";
import Input from "./widgets/input.js";
import Radios from "./widgets/radios.js";
import Select from "./widgets/select.js";
import Tabs from "./widgets/tabs.js";
import Toolbar from "./widgets/toolbar.js";
import Text from "./widgets/text.js";
import Tuple from "./widgets/tuple.js";

var Widgets = function( scope )
{   
    this.Config = function( name, mother, config )
    {   
        this.mother = mother ? { name: config.name, widget: mother } : { name: config.doc.getKey(), widget: null };
        this.default = config.default || "";
        this.doc = config.doc;
        this.data = Object.assign( this.doc.data, { [ this.mother.name ]: config.doc.getField( this.mother.name ) || { ...this.default } } );
        this.name = name;
        this.parent = config.parent;
        this.scope = scope;
    };

    // widgets
    this.Array = Arrays;

    this.Calendar = Calendar;

    this.Checkboxes = Checkboxes;

    this.Color = Color;

    this.Control = Control;

    this.Datalist = Datalist;

    this.Date = Date;

    this.Drilldown = Drilldown;

    this.Input = Input;

    this.List = function( config )
    {   
        Common.call( this );
        
        var scope = this;
        var dnd = new DND(); 
        var item = new widgets.Config( "name", config );
            item.required = true;

        Multi.call( this, config );

        config.widgets =
        [
            { class: "Input", config: item }
        ];

        this.add = function( e )
        {
            e.preventDefault();

            var row = parse( e );
            
            scope.doc.push( row.getValue() );

            e.target.reset();

            scope.populate();
        };

        this.delete = function( e )
        {
            scope.doc.splice( e.target.dataset.index, 1 );

            scope.populate();
        };

        this.update = function( e )
        {
            e.preventDefault();
            
            var row = parse( e );

            scope.doc[ e.submitter.dataset.index ] = row.getValue();
        }; 

        this.populate = () => 
        {
            this.section.innerHTML = null; 

            scope.doc.forEach( ( data, index ) => this.row( index, data ) );

            scope.broadcast( this );
        };

        this.init( config );

        dnd.init( this.section, ( e ) => docs.find( e, "[draggable='true']" ), scope.doc );
    };

    this.Matrix = function ( config )
    {
        Common.call( this );
        Multi.call( this, config );
        
        var scope = this;
        var { label, div, wrapper } = this.block( config );
            label.innerText = config.name || "\n";

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

        data.load.call( scope, config );
    };

    this.Object = function( params )
    {
        var { label, div, wrapper } = this.block( params, "column" );
            label.innerText = params.name || "\n";

        div.classList.add( "object" );

        var values = data.default( params.values, params.name, {} );
  
        params.widgets.forEach( widget => 
        {
            var object = data.default( values[ params.name ], widget.params.name, "" );
            var value = object[ widget.params.name ]; 
            var config = { ...widget.params  };
                config.debug = true;
                config.element = div;
                config.object = params.name;
                config.value = value;
                config.values = values;

            new widgets[ widget.class ]( config );
        } );
    };
    
    this.Radios = Radios;
    
    this.Select = Select;

    this.Tabs = Tabs;

    this.Text = Text;

    this.Toolbar = Toolbar;

    this.Tuple = Tuple;
};

export default Widgets;