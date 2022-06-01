export default function Widgets( scope )
{       
    var widgets = this;
    
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

    this.add = async function( parameters )
    {
        parameters.config.scope = scope;

        if ( !parameters.hasOwnProperty( "active" ) || parameters.active )
        {   
            scope.widgets[ parameters.config.name ] = await new widgets[ parameters.class ]( parameters.config );

            return scope.widgets[ parameters.config.name ];
        }
    };

    async function load( script )
    {
        let widget = await import( `./widgets/${ script.toLowerCase() }.js` );

        widgets[ script ] = widget.default;
    };

    [ 
        "Arrays", 
        "Broadcaster", 
        "Calendar", 
        "Checkboxes", 
        "Color", 
        "Control", 
        "Datalist", 
        "Date", 
        "Draw", 
        "Drilldown", 
        "Editor", 
        "Input", 
        "Label", 
        "Matrix", 
        "Model", 
        "Objects", 
        "Popup",
        "QR", 
        "Radios", 
        "Select", 
        "Tabs", 
        "Text", 
        "Toolbar", 
        "Tuple", 
        "UPC",
        "Watcher"
    ].forEach( async ( script ) => await load( script ) );
};