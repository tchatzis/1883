import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Popup( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var div = docs.ce( "div" );
        div.classList.add( "popup" );
        div.style.height = config.height || "10vh";
        div.style.width = config.width || "10vw";
    docs.ac( document.body, div );

    div.style.left = ( window.innerWidth - div.offsetWidth ) * 0.5 + "px";
    div.style.top = ( window.innerHeight - div.offsetHeight ) * 0.5 + "px";

    var bar = docs.ce( "div" );
        bar.classList.add( "column" );
        bar.classList.add( "flex" );
    docs.ac( div, bar );

    var title = docs.ce( "span" );
        title.innerText = config.name;
    docs.ac( bar, title );

    var close = docs.ce( "span" );
        close.innerText = "\u274c";
        close.style.cursor = "pointer";
        close.style.marginLeft = "auto";
        close.onclick = () => div.remove();
    docs.ac( bar, close );

    var content = docs.ce( "div" );
        content.style.height = div.offsetHeight - bar.offsetHeight + "px";
        content.style.overflowY = "auto";
        content.style.width = "100%";
    docs.ac( div, content );

    this.element = content;

    console.log( this );
}