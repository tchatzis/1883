import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";
import CanvasDraw from "../draw.js";

export default function Draw( config )
{
    config.default = "";
    
    Common.call( this, config );
    Config.call( config, config );

    this.block( config );
    this.label.innerText = config.name || "\n";

    var scope = this;
    var data = this.getData( config );
    var canvas  = docs.ce( "canvas" );
        canvas.width = config.width;
        canvas.height = config.height;
    docs.ac( this.parent, canvas );

    var draw = new CanvasDraw( config );
        draw.init( canvas, data );
}