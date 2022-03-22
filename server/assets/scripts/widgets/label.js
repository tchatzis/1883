import docs from "../docs.js";

export default function Label( config )
{   
    this.label = docs.ce( "span" );
    this.label.innerText = config.value || "\n";
    this.label.classList.add( "label" );
    docs.ac( config.parent, this.label );
}