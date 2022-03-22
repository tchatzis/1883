export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );

    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "name", required: true, type: "text", value: doc.getField( "name" ) } );
    new scope.imports.widgets.Array( { scope: scope, name: "rooms", value: doc.getField( "rooms" ),
    widgets:
    [
        { class: "Input", config: { name: "label" } },
        { class: "Input", config: { name: "type" } },
        { class: "Input", config: { name: "description" } }
    ] } );
    new scope.imports.widgets.Array( { scope: scope, name: "storage", value: doc.getField( "storage" ),
    widgets:
    [
        { class: "Input", config: { name: "label" } }
    ] } );
}