export async function load()
{
    var scope = this;
    var id = "login";
    var parent = scope.getParent();

    var form = docs.ce( "form" );
        form.setAttribute( "method", "post" );
        form.addEventListener( "submit", scope.on.login, false );
        form.id = id;
    docs.ac( div, form );

    new scope.imports.widgets.Input( { type: "email", Form: id, name: "email", required: true, value: "tito.chatzis@gmail.com", parent: parent } );
    new scope.imports.widgets.Input( { type: "password", Form: id, name: "password", required: true, value: "x", parent: parent } );
    new scope.imports.widgets.Input( { type: "image", Form: id, src: "/images/login.png", title: "Log In", parent: parent, width: 48 } );

    console.warn( scope );
};