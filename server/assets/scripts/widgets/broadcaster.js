import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Broadcaster( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var socketjs = docs.ce( "script" );
        socketjs.src = "/socket.io/socket.io.js";
        socketjs.onload = loadScript;
    docs.ac( config.parent, socketjs );

    async function loadScript()
    {   
        var { Broadcaster } = await import( "/js/rtc.broadcaster.js" );

        var broadcaster = new Broadcaster( io );
            broadcaster.initialize( config );
    }
}