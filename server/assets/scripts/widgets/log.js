import docs from "../docs.js";

export default function Log( config )
{   
    var log = docs.ce( "div" );
        log.classList.add( "row" );
        log.classList.add( "flex" );
    docs.ac( config.parent, log );

    if ( config.color )
    {
        let color = docs.ce( "div" );
            color.classList.add( "mark" );
            color.style.backgroundColor = config.color;
        docs.ac( log, color );
    }

    this.label = docs.ce( "div" );
    this.label.classList.add( "label" );
    this.label.innerText = config.value || "\n";
    docs.ac( log, this.label );
}