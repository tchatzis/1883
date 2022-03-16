export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { type: "input", Form: scope.form.id, name: "label", required: true, value: doc.getField( "label" ), parent: scope.form.parent } );
    new scope.imports.widgets.Datalist( { data: data, query: `select * from group`, sort: "label", parent: scope.form.parent, Form: scope.form.id, name: "group", field: "label", value: doc.getField( "group" ), 
        listeners: [ { event: "dblclick", handler: scope.on.grow } ] } );
    new scope.imports.widgets.Text( { Form: scope.form.id, name: "description", required: true, value: doc.getField( "description" ), parent: scope.form.parent } );
    
    let array = 
    {
        id: scope.form.id,
        data: doc.data,
        parent: scope.form.parent,
        name: "item",
        widgets:
        [
            { class: "Datalist", config: { query: `select * from stock`, sort: "label", name: "stock", field: [ "label", "brand", "description" ], listeners: [ { event: "dblclick", handler: scope.on.grow } ] } },
            { class: "Input", config: { type: "number", name: "quantity", size: "2", required: true, min: 0 } },
            { class: "Datalist", config: { query: `select * from plating`, sort: "sequence", name: "plating", field: "label", required: true, listeners: [ { event: "dblclick", handler: scope.on.grow } ] } },
            { class: "Input", config: { type: "text", name: "notes" } }
        ]
    };

    //new scope.imports.widgets.Array( array );
};