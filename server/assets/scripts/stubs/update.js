export async function load()
{
    let scope = this;
    
    let doc = scope.getDoc();
    let id = doc.id;
    let sub = scope.getParent();

    let h1 = scope.imports.docs.ce( "h1" );
        h1.innerText = "Edit";
    scope.imports.docs.ac( sub, h1 );

    let form = scope.imports.docs.ce( "form" );
        form.setAttribute( "method", "post" );
        form.addEventListener( "submit", scope.on.update, false );
        form.id = id;
    scope.imports.docs.ac( sub, form );

    let parent = scope.imports.docs.ce( "div" );
        parent.classList.add( "scroll" );
        parent.dataset.section = "widgets";

    scope.form =
    {
        id: id,
        element: form,
        parent: parent,
        widgets: {}
    };

    scope.imports.widgets.add( { class: "Toolbar", config: { controls:
    [
        { title: "back", listeners: [ { event: "click", handler: () => scope.setClear( sub ) } ] },
        { title: "save", Form: id },
        //{ title: "checklist", event: "click", handler: ( e ) => events.checklist( e, params ), visible: parameters.display == scope.collection },
        { title: "delete", listeners: [ { event: "click", handler: scope.on.delete } ] },
    ],
    parent: sub } } );

    scope.imports.docs.ac( sub, parent );
}