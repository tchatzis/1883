import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Drilldown( config )
{   
    Common.call( this, config );
    Config.call( config, config );

    config.doc = config.scope.getDoc();
    config.default = {};

    var data = config.doc.data?.[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];
    var scope = this;
    var imports = config.scope.imports;
    var index = 0;
    var names = [];

    this.select = {};
    this.name = config.name;
    this.widgets = config.widgets;
    this.block( config );
    this.label.innerText = config.name || "\n";

    this.section = docs.ce( "div" );
    this.section.style.paddingLeft = "10px";
    this.section.title = config.name;
    if ( config.nobreak )
        this.section.classList.add( "flex" );
    docs.ac( config.parent, this.section );

    function init()
    {   
        config.parent = scope.section;
        
        config.widgets.forEach( ( widget, index ) => 
        {
            names.push( widget.config.name ); 
        } );
        
        load( config );
    };   

    async function load( config )
    {       
        if ( !config.model.array )
        {
            let widget = scope.widgets[ index ];
            let _config = new config.scope.imports.widgets.Config( widget.config.name, scope, config );
    
            Object.assign( widget.config, _config );

            await config.data.load.call( scope, widget.config );
        }
        else
            scope.populate( config ); 
    }   

    this.populate = ( config ) =>
    {
        if ( config.model.query )
            delete config.model.query;

        if ( !config.model.array )
            config.model.array = this.data.values;

        render( config );
    };

    async function render( config )
    {        
        if ( index < scope.widgets.length )
        {
            // change listener
            config.listeners = [ { event: "change", handler: handler } ];

            // invoke the select widget
            config.Form = scope.name; 
            config.value = config.value || data[ config.name ];

            scope.select[ index ] = await new imports.widgets.Select( config );
            scope.select[ index ].input.dataset.index = index;
            scope.select[ index ].config = config;

            next.call( scope.select[ index ] );  
        }
    };

    function next()
    {    
        let selected = this.data.values.find( option => option[ this.config.model.field ] == this.input.value );

        if ( selected )
        {
            index++;
            
            let name = names[ index ];
            let widget = scope.widgets[ index ];

            let _config = { ...this.config }; 
                if ( widget )
                    _config.model = { ...widget.config.model };    
                _config.model.array = selected[ name ];
                _config.mother.name = scope.name;
                _config.name = name;
                _config.value = data[ name ] || "";

            if ( name )
                load( _config );
        }
    }
    
    function handler( e )
    {
        e.preventDefault();

        index = Number( e.target.dataset.index );
        
        if ( e.target.value )
            data[ scope.select[ index ].name ] = e.target.value;
        else
            delete data[ scope.select[ index ].name ];

        clear();

        config.scope.controls[ "save" ].enable( Object.values( data ).length == scope.widgets.length );

        next.call( scope.select[ index ] );
    }

    function clear()
    {
        // remove children
        for ( let i = index + 1; i < scope.widgets.length; i++ )
        {
            if ( scope.select[ i ] )
            {
                scope.select[ i ].parent.parentNode.remove();

                delete data[ scope.select[ i ].name ];
            }
        }
    }

    init();
}