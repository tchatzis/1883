export async function load()
{   
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Calendar( { scope: scope, name: "calendar", value: new Date(), 
    model:
    {
        data: scope.imports.data,
        field: "name"
    },
    listeners: 
    [ 
        { event: "click", handler: scope.on.date }, 
        { event: "select", handler: scope.on.select }
    ] } );
}