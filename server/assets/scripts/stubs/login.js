export async function load()
{
    var scope = this;
    var id = "login";
    var parent = scope.getParent();
    var widgets = scope.imports.widgets;

    var form = docs.ce( "form" );
        form.setAttribute( "method", "post" );
        form.addEventListener( "submit", scope.on.login, false );
        form.id = id;
    docs.ac( div, form );

    widgets.add( { active: true, class: "Input", config: { name: "email", required: true, type: "email", value: "tito.chatzis@gmail.com" } } );

    widgets.add( { active: true, class: "Input", config: { name: "password", required: true, type: "password",  value: "x" } } );

    widgets.add( { active: true, class: "Control", config: { src: "/images/login.png", title: "Log In", type: "image" } } );
};