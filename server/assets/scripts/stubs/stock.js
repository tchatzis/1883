export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );

    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Datalist( { scope: scope, name: "brand", value: doc.getField( "brand" ), 
    model:
    {
        data: scope.imports.data, 
        field: "label", 
        query: `select * from brand`, 
        sort: "label"
    },
    listeners: [ { event: "dblclick", handler: scope.on.grow } ] } );

    new scope.imports.widgets.Input( { scope: scope, name: "label", required: true, type: "text", value: doc.getField( "label" ) } );

    new scope.imports.widgets.Input( { scope: scope, name: "description", type: "text", value: doc.getField( "description" ) } );

    await new scope.imports.widgets.Drilldown( { scope: scope, name: "category",
    nobreak: true,
    widgets: 
    [ 
        { class: "Select", config: { name: "group", required: true, value: doc.getField( "group" ),
        model:
        {
            data: scope.imports.data,
            field: "label",
            query: `select * from group`, 
            sort: "label"  
        } } }, 
        { class: "Select", config: { name: "subgroup", required: true, value: doc.getField( "subgroup" ), 
        model:
        {
            array: [],
            data: scope.imports.data,
            field: "label"
        } } }, 
    ] } );

    new scope.imports.widgets.Checkboxes( { scope: scope, name: "allergen",
    model:
    {
        data: scope.imports.data,
        field: "label",
        query: "select * from allergen",
        sort: "label"
    }, 
    headless: false, nobreak: true } );

    new scope.imports.widgets.Input( { scope: scope, name: "size", required: false, type: "text", value: doc.getField( "size" ) } );

    new scope.imports.widgets.Input( { scope: scope, name: "order number", required: false, type: "text", value: doc.getField( "order number" ) } );
}