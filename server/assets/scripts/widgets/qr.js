import Common from "./common.js";
import Config from "./config.js";
//import docs from "../docs.js";

export default function QR( config )
{
    Common.call( this, config );
    Config.call( config, config );

    //var scope = this;
    //var data = this.getData( config );
    var params =
    {
        height: config.size,
        width: config.size,
        text: config.value
    };

    var qrcode = new QRCode( config.parent, params );
}