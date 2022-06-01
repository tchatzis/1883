import docs from "../docs.js";

export default function Toolbar( config )
{
    var toolbar = docs.ce( "div" );
        toolbar.classList.add( "flex" );
        toolbar.classList.add( "right" );
        toolbar.classList.add( "noprint" );
        toolbar.title = "toolbar";
    docs.ac( config.parent, toolbar );

    config.controls.forEach( async ( control ) =>
    {
        config.scope.controls[ control.title ] = await config.scope.imports.widgets.add( { active: true, class: "Control", config: { type: "image", src: `/images/${ control.title }.png`, title: control.title, width: 32, height: 32, 
        Form: control.Form,
        headless: true,
        listeners: control.listeners,
        parent: toolbar } } );
    } );  
}