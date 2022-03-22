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
    this.attributes( config, this.input );

    this.listeners( this.input, config );
    
    docs.ac( this.parent, this.input );
};