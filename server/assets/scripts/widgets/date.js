import Common from "./common.js";
import Config from "./config.js";
import dates from "../dates.js";
import docs from "../docs.js";

export default function Date( config )
{
    Common.call( this, config );
    Config.call( config, config );
    
    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.attributes( config, this.input, [ "type", "value" ] );
    this.input.type = "date";
    this.input.setAttribute( "data-date", config.value );
    this.input.setAttribute( "value", dates.format( config.value, "-" ) );

    this.listeners( this.input, config );

    docs.ac( this.parent, this.input );
}