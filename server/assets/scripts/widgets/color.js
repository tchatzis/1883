import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Color( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;

    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.attributes( config, this.input, [ "type" ] );
    this.input.type = "hidden";

    docs.ac( this.parent, this.input );

    this.listeners( this.input, config );

    var table = docs.ce( "table" );
        table.style.borderCollapse = "separate";
        table.title = "calendar";

    var step = 15;

    var border = [ "1px solid transparent", "1px solid white" ];

    var over = ( e ) => e.target.style.border = border[ 1 ];
    var out = ( e ) => e.target.style.border = border[ 0 ];
    var reset = () => Array.from( table.querySelectorAll( "[ data-color ]" ) ).forEach( td => 
    { 
        td.style.border = border[ 0 ]; 
        td.addEventListener( "mouseout", out );
    } );

    for ( let l = 10; l <= 70; l += step )
    {
        let tr = docs.ce( "tr" );
        
        for ( let h = 0; h < 360; h += step * 2 )
        {
            let hsl = `hsl( ${ h }, 100%, ${ l }% )`;
            let b = 1 - ( scope.input.value !== hsl );   
            let td = docs.ce( "td" );
                td.dataset.color = hsl;
                td.style.backgroundColor = hsl;
                td.style.border = border[ b ];
                td.style.borderRadius = "3px";
                td.style.cursor = "pointer";
                td.style.height = "0.75em";
                td.style.padding = 0;
                td.style.width = "1em";
                td.addEventListener( "mouseover", over );
                td.addEventListener( "mouseout", out );
                td.addEventListener( "click", () => 
                {
                    reset();
                    scope.input.value = td.dataset.color;
                    td.style.border = border[ 1 ];
                    td.removeEventListener( "mouseout", out );
                } );

            docs.ac( tr, td );
        }

        docs.ac( table, tr );
    }

    docs.ac( this.parent, table );
}