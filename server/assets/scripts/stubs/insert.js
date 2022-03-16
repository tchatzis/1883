export async function load()
{
    let scope = this;
    
    let doc = scope.getDoc();
        doc.id = scope.settings.collection;
    let id = doc.id;
    let parent = scope.getParent();

    let h1 = scope.imports.docs.ce( "h1" );
        h1.innerText = "Add";
    scope.imports.docs.ac( parent, h1 );

    let form = scope.imports.docs.ce( "form" );
        form.setAttribute( "method", "post" );
        form.addEventListener( "submit", scope.on.insert, false );
        form.id = id;
    scope.imports.docs.ac( parent, form );

    scope.form =
    {
        id: id,
        element: form,
        parent: parent,
        widgets: {}
    };

    new scope.imports.widgets.Toolbar( { scope: scope, controls:
    [
        { title: "back", listeners: [ { event: "click", handler: () => scope.setClear( parent ) } ] },
        { title: "save", Form: id }
    ] } );
};