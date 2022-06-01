import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Radios( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var data = this.getData( config );
    var scope = this;

    function check( input, value )
    {
        let predicate = false;
        let values = ( config.value ) ? config.value : data[ input.name ];

        if ( Array.isArray( values ) )
            predicate = values.some( val => val == value );
        else
            predicate = value == values;
 
        toggle( input, predicate );

        return predicate;
    }

    async function toggle( input, predicate )
    {
        let span = docs.bubble( input, "span" );
        let parent = docs.find( span, ".input" );

        await Array.from( parent.children ).forEach( span => span.classList.remove( "selected" ) );

        if ( predicate )
        {
            input.setAttribute( "checked", "" );
            span.classList.add( "selected" );
        }
        else
        {
            input.removeAttribute( "checked", "" );
        }

        if ( typeof data == "object" )
            data[ input.name ] = input.value;
        else
            data = input.value;
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
                    let option = docs.ce( "span" );
                        option.classList.add( "option" );
                    docs.ac( this.parent, option );
                    
                    value = value[ config.model.field ];

                    let input = docs.ce( "input" );
                    this.attributes( config, input );
                        input.type = "radio";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                        input.addEventListener( "input", ( e ) => toggle( input, input.checked ) );
                    docs.ac( option, input );

                    this.listeners( input, config );

                    let label = docs.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    docs.ac( option, label );

                    check( input, value );
                    
                    if ( !config.nobreak )
                    {
                        let br = docs.ce( "br" );
                        docs.ac( option, br );
                    }
                } );
            }
    };

    config.model.data.load.call( this, config );
}