
import docs from "./docs.js";

import Arrays from "./widgets/array.js";
import Calendar from "./widgets/calendar.js";
import Checkboxes from "./widgets/checkboxes.js";
import Color from "./widgets/color.js";
import Control from "./widgets/control.js";
import Date from "./widgets/date.js";
import Datalist from "./widgets/datalist.js";
import Drilldown from "./widgets/drilldown.js";
import Editor from "./widgets/editor.js";
import Input from "./widgets/input.js";
import Label from "./widgets/label.js";
import Matrix from "./widgets/matrix.js";
import Objects from "./widgets/object.js";
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

    this.Editor = Editor;

    this.Input = Input;

    this.Label = Label;

    /*this.List = function( config )
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

    this.Matrix = Matrix;

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
    };*/

    this.Object = Objects;

    this.Radios = Radios;
    
    this.Select = Select;

    this.Tabs = Tabs;

    this.Text = Text;

    this.Toolbar = Toolbar;

    this.Tuple = Tuple;
};

export default Widgets;