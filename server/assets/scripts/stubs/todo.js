export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Date( { scope: scope, name: "date", required: true, value: doc.getField( "date" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "type", required: true, type: "input", value: doc.getField( "type" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true, type: "input", value: doc.getField( "label" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "script", type: "input", value: doc.getField( "script" ) } );
    new scope.imports.widgets.Input( { scope: scope, name: "line", required: true, type: "number", value: doc.getField( "line" ), min: 0 } );
    new scope.imports.widgets.Text( { scope: scope, name: "description", value: doc.getField( "description" ) } );
    new scope.imports.widgets.Date( { scope: scope, name: "completed", value: doc.getField( "completed" ) } );
}