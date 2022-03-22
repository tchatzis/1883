export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true, type: "text", value: doc.getField( "label" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "endpoint", required: true, type: "text", value: doc.getField( "endpoint" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "sequence", required: true, type: "number", value: doc.getField( "sequence" ) || data.store[ scope.collection ].length + 1, min: 0 } );
    new scope.imports.widgets.Select( { scope: scope, name: "class", required: true, value: doc.getField( "class" ), 
    model:
    {
        array: [ "DB", "Static", "Download", "File", "Directory" ], 
        data: scope.imports.data 
    } } );
    new scope.imports.widgets.Select( { scope: scope, name: "role", required: true, value: doc.getField( "role" ), 
    model:
    {
        array: [ "public", "user", "admin", "developer" ], 
        data: scope.imports.data 
    } } );
}