import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Editor( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;

    this.block( config );
    console.log( this )
    this.label.innerText = config.name || "\n";
    this.parent.classList.remove( "input" );
    this.parent.classList.add( "quill" );

    var container = docs.ce( "div" );
        docs.ac( this.parent, container );

    var value = config.value || "";

    this.input = docs.ce( "input" );
    this.attributes( config, this.input );
    this.input.value = value;
    this.input.type = "hidden";
    docs.ac( this.parent, this.input );

    this.listeners( this.input, config );

    var setup = 
    {
        modules:
        {
            toolbar: [ 
                [ 'bold', 'italic', 'underline', 'strike' ],
                [ { 'list': 'ordered'}, { 'list': 'bullet' } ], 
                [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
                [ { 'color': [] }, { 'background': [] } ],
                [ { 'font': [] } ],
                [ { 'align': [] } ],
                [ 'clean' ] 
            ],           
        },
        theme: "snow"
    };

    var editor = new Quill( container, setup );
        editor.setHTML = ( html ) => editor.root.innerHTML = html;
        editor.getHTML = () => editor.root.innerHTML;
        editor.on( "text-change", () => 
        { 
            var value = editor.getHTML();

            config.value = value;
            scope.input.value = value;
        } );
        editor.setHTML( value );
}