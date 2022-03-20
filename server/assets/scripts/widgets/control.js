import Common from "./common.js";
import docs from "../docs.js";

export default function Control( config )
{
    Common.call( this, config );
    
    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.input.placeholder = config.name;
    this.input.dataset.name = config.name;

    this.listeners( this.input, config );

    this.enable = ( bool ) =>
    {
        if ( bool )
            this.input.removeAttribute( "disabled" );
        else
            this.input.setAttribute( "disabled", "" );
    };

    for ( let att in config )
        if ( !this.hidden.concat( [ "name", "placeholder" ] ).some( hidden => hidden == att ) )
            if ( config[ att ] )
                this.input.setAttribute( att, config[ att ] );

    docs.ac( this.parent, this.input );
};