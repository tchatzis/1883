import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Radios( config )
{
    Common.call( this, config );
    Config.call( config, config );

    config.doc = config.scope.getDoc();
    config.default = [];
    
    var data = config.doc.data[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];

    function check( input, value )
    {
        let predicate = false;
        let values = ( config.value ) ? config.value : data;

        //console.log( values );

        if ( Array.isArray( values ) )
            predicate = values.some( val => val == value );
        else
            predicate = values == value;

        if ( predicate )
            input.setAttribute( "checked", "" );

        return predicate;
    }

    this.block( config );
    
    this.populate = () =>
    {
        if ( this.data )
        {
            this.label.innerText = this.data.name || "\n";

            var array = this.normalize( this.data.values, config );
                array.forEach( ( value, i ) =>
                {   
                    value = value[ config.model.field ];
                    
                    let input = docs.ce( "input" );
                        input.type = "radio";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                    if ( config.Form )
                        input.setAttribute( "Form", config.Form );
                    docs.ac( this.parent, input );

                    check( input, value );

                    this.listeners( input, config );

                    let label = docs.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    docs.ac( this.parent, label );
                    
                    if ( !config.nobreak )
                    {
                        let br = docs.ce( "br" );
                        docs.ac( this.parent, br );
                    }
                } );
            }
    };

    config.model.data.load.call( this, config );
}