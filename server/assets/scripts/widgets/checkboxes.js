import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Checkboxes( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;
        scope.name = config.mother ? config.mother.name : config.name;

    config.doc = config.scope.getDoc();
    config.default = [];
    config.multi = true;

    var data = config.doc.data[ scope.name ] || Object.assign( config.doc.data, { [ scope.name ]: config.default } )[ scope.name ];
    var array = Array.isArray( data ) ? [...data ] : data;

    function check( input, value )
    {        
        array = array.hasOwnProperty( input.name ) ? array[ input.name ] : array;
        array = Array.isArray( array ) ? array : [ array ];

        let predicate = array.some( val => val == value );

        toggle( input, predicate );

        return predicate;
    }

    function toggle( input, predicate )
    {   
        let span = docs.bubble( input, "span" );
        let index = array.indexOf( input.value );

        if ( predicate )
        {
            input.setAttribute( "checked", "" );
            span.classList.add( "selected" );

            if ( index == -1 )
                array.push( input.value );
        }
        else
        {
            input.removeAttribute( "checked" );
            span.classList.remove( "selected" );  
            
            if ( index > -1 )
                array.splice( index, 1 );
        }

        if ( data.hasOwnProperty( input.name ) )
            data[ input.name ] = array;
        else
            data = array;
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
                        input.type = "checkbox";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                        input.addEventListener( "input", ( e ) => toggle( input, input.checked ) );
                    docs.ac( option, input );

                    check( input, value );

                    this.listeners( input, config );

                    let label = docs.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    docs.ac( option, label );
                    
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