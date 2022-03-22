import Common from "./common.js";
import docs from "../docs.js";

export default function Control( config )
{
    Common.call( this, config );
    
    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.attributes( config, this.input );
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

    docs.ac( this.parent, this.input );
};