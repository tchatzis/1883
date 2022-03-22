export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true, type: "text", value: doc.getField( "label" ) } );
    new scope.imports.widgets.Array( { scope: scope, name: "subgroup", value: doc.getField( "subgroup" ),
    widgets:
    [
        { class: "Input", config: { name: "label", type: "text" } }
    ] } );
}