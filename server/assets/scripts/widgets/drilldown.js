import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Drilldown( config )
{   
    Common.call( this, config );
    Config.call( config, config );

    config.doc = config.scope.getDoc();
    config.default = {};

    console.log( config.doc );

    var data = config.doc.data?.[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];
    var scope = this;
    var imports = config.scope.imports;
    var index = 0;
    var names = [];
    var next;

    this.block( config );
    this.label.innerText = config.name || "\n";
    this.name = config.name;
    this.path = [];
    this.widgets = config.widgets;

    function increment()
    {
        index++;
        next = names[ index ];
    }

    async function load( config )
    {        
        let widget = scope.widgets[ index ];
        let _config = new config.scope.imports.widgets.Config( widget.config.name, scope, config );
            _config.Form = scope.name;

        Object.assign( widget.config, _config );

        await widget.config.model.data.load.call( scope, widget.config );
    }

    this.populate = ( config ) =>
    {
        // switch data to array from query
        config.model.array = config.model.array || this.data.values;
        delete config.model.query;

        this.render( config );
    };

    this.render = ( config ) => 
    {        
        if ( index < scope.widgets.length )
        {
            // change listener
            config.listeners = [ { event: "change", handler: () => 
            {
                scope.path.push( config.name );
                data[ config.name ] = select.input.value;

                let selected = select.data.values.find( option => option[ config.model.field ] == select.input.value );

                let _config = new config.scope.imports.widgets.Config( config.name, scope, config );
                    _config.Form = scope.name;
                    _config.model = Object.assign( config.model, { array: selected[ next ] } );
                    _config.name = next;

                    delete config.doc.data[ config.name ];

                this.render( _config );
            } } ];
            // invoke the select widget
            let select = new imports.widgets.Select( config );

            // get selected
            let container = docs.find( select.parent, ".field" ); 
            let value = data[ config.model.field ] || config.value;
            let selected = select.data.values.find( option => option[ config.model.field ] == value );

            if ( selected )
                container.classList.remove( "hidden" );

            increment();    
        }
    };

    this.init = async () =>
    {
        load( config );

        config.widgets.forEach( widget => names.push( widget.config.name ) );
    };

    this.init();
}