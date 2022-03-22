export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true,type: "text", value: doc.getField( "label" ) } );
    /*new scope.imports.widgets.Datalist( { scope: scope, name: "group", value: doc.getField( "group" ), 
        model:
        {
            data: scope.imports.data, 
            field: "label",
            query: `select * from group`, 
            sort: "label"
        }, 
        listeners: [ { event: "dblclick", handler: scope.on.grow } ] } );*/
    new scope.imports.widgets.Text( { scope: scope, name: "description", required: true, value: doc.getField( "description" ) } );
    new scope.imports.widgets.Array( { scope: scope, name: "item", value: doc.getField( "item" ),
    widgets:
    [
        { class: "Datalist", config: { name: "stock", 
            model:
            {
                data: scope.imports.data,
                field: [ "label", "brand", "description" ],
                query: `select * from stock`, 
                sort: "label", 
            }, 
            listeners: [ { event: "dblclick", handler: scope.on.grow } ]
        } } ,
        { class: "Input", config: { name: "quantity", type: "number", required: true, min: 0 } },
        { class: "Datalist", config: { name: "plating", required: true, 
            model:
            {
                data: scope.imports.data,
                field: "label",
                query: `select * from plating`, 
                sort: "sequence"
            },  
            listeners: [ { event: "dblclick", handler: scope.on.grow } ] 
        } },
        { class: "Input", config: { name: "notes", type: "text" } }
    ] } );
};