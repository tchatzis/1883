import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function UPC ( config )
{
    Common.call( this, config );
    Config.call( config, config );

    this.block( config );
    this.label.innerText = config.name || "\n";

    var scope = this;
    var data = this.getData( config );

    var div = docs.ce( "div" );
        div.id = "qr-reader";
    docs.ac( this.parent, div );

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code scanned = ${decodedText}`, decodedResult);
    }
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
}