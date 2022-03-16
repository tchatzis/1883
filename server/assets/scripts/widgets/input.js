import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Input( config )
{
    Common.call( this, config );
    Config.call( config, config );
    
    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.input.placeholder = config.name;

    this.listeners( this.input, config );

    for ( let att in config )
        if ( !this.hidden.some( hidden => hidden == att ) )
            if ( config[ att ] )
                this.input.setAttribute( att, config[ att ] );

    docs.ac( this.parent, this.input );
};