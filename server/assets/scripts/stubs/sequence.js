export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true, type: "input", value: doc.getField( "label" ) } );
    new scope.imports.widgets.Input( { scope: scope, type: "number", name: "sequence", required: true, value: doc.getField( "sequence" ) || scope.imports.data.store[ scope.settings.collection ].length + 1 } );
}