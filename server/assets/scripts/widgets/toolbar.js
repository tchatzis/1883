import docs from "../docs.js";

export default function Toolbar( config )
{
    var toolbar = docs.ce( "div" );
        toolbar.classList.add( "flex" );
        toolbar.classList.add( "right" );
        toolbar.classList.add( "noprint" );
    docs.ac( config.scope.form.parent, toolbar );

    config.scope.controls = {};

    config.controls.forEach( control =>
    {
        config.scope.controls[ control.title ] = new config.scope.imports.widgets.Control( { type: "image", src: `/images/${ control.title }.png`, title: control.title, width: 32, height: 32, 
        Form: control.Form,
        headless: true,
        listeners: control.listeners,
        parent: toolbar } );
    } );  
}