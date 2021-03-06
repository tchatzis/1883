import docs from "../docs.js";

export default function()
{   
    this.attributes = ( config, input, more ) =>
    {   
        var keys = more || [];
        
        for ( let att in config )
            if ( !this.hidden.concat( keys ).some( hidden => hidden == att ) )
                if ( config?.hasOwnProperty( att ) )
                    input.setAttribute( att, config[ att ] );
    };
    
    this.block = ( config, css ) =>
    {   
        this.name = config.name;

        var wrapper = docs.ce( "div" );
            wrapper.classList.add( "field" );
        docs.ac( config.parent, wrapper );
        
        this.label = docs.ce( "div" );
        this.label.classList.add( css || "label" );
        if ( config.headless )
            this.label.style.display = "none";
        docs.ac( wrapper, this.label );

        this.parent = docs.ce( "div" );
        this.parent.classList.add( "input" );
        docs.ac( wrapper, this.parent );
    };

    this.broadcast = ( config ) => {};// console.log( config.doc.data );

    this.getData = ( config ) => 
    {   
        config.doc = config.scope.getDoc();

        this.name = config.mother ? config.mother.name : config.name;

        return config.doc.data[ this.name ] || Object.assign( config.doc.data, { [ this.name ]: config.default } )[ this.name ];
    };

    this.setArray = ( data, field ) =>
    {
        var temp = data?.hasOwnProperty( field ) ? data[ field ] : data;

        return Array.isArray( temp ) ? temp : [ temp ];
    };

    this.hidden = [ "data", "default", "doc", "element", "form", "headless", "hide", "listeners", "model", "mother", "multi", "nobreak", "parent", "scope", "values", "widgets" ];

    this.listeners = ( el, config, object ) =>
    {   
        if ( config.listeners )
            config.listeners.forEach( listener => el.addEventListener( listener.event, ( e ) => { e.preventDefault(); listener.handler( e, config, object ) }, false ) );

        if ( config.doc )
            el.addEventListener( "input", () => 
            {   
                this.broadcast( config );
            } );
    };

    this.normalize = ( data, config ) =>
    {        
        function type( data )
        {
            if ( Array.isArray( data ) )
            {
                while( Array.isArray( data[ 0 ] ) )
                    data = data[ 0 ];

                return data 
            }

            if ( typeof data == "object" )
            {
                return Object.keys( data );
            }
        }

        let array = type( data );

        if ( !config?.model?.hasOwnProperty( "field" ) )
        {
            config.model.field = "option";

            array = array.map( value => 
            { 
                var obj = {}; 
                    obj[ config.model.field ] = value;

                return obj;
            } );
        }

        return array;
    };
};