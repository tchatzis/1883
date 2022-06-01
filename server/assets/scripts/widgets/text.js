import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Text( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;

    this.block( config );
    this.label.innerText = config.name || "\n";

    this.input = docs.ce( "textarea" );
    this.attributes( config, this.input );
    this.input.placeholder = config.name;
    this.input.innerText = config.value || "";

    docs.ac( this.parent, this.input );

    this.listeners( this.input, config );
}