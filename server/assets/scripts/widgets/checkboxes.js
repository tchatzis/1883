import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";
import DND from "../dnd.js";

export default function Checkboxes( config )
{
    config.multi = true;
    config.default = [];
    
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;
    var data = this.getData( config );
    var array;
    var dnd = new DND();

    async function callback( el )
    {
        await Array.from( el.parentNode.children ).forEach( span => 
        {
            var input = span.firstChild;

            if ( !input.checked )
                span.classList.remove( "selected" );
        } );

        el.classList.add( "selected" );
    }

    function check( input, value )
    {        
        array = scope.setArray( data, input.name );

        let predicate = array.some( val => val == value );

        toggle( input, predicate );

        return predicate;
    }

    function reorder( values )
    {
        var array = scope.setArray( data, config.name );
            array = config.model.field ? array.map( item => { return { [ config.model.field ]: item } } ) : array;
        var ordered = [ ...array ];

        values.forEach( value =>
        {
            if ( !array.find( existing => config.model.field ? existing.findObject( value ) : existing == value ) )
                ordered.push( value );
        } );

        return ordered;
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

            var array = reorder( this.data.values );
                array = this.normalize( array, config );
                array.forEach( ( value, i ) =>
                {
                    let option = docs.ce( "span" );
                        option.classList.add( "option" );
                        option.setAttribute( "draggable", "true" );
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

            dnd.init( this.parent, ( e ) => docs.find( e.target, "[draggable='true']" ), array, callback );
        }
    };

    config.model.data.load.call( this, config );
}