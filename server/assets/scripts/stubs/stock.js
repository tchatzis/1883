export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );

    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Datalist", config: { name: "brand", value: doc.getField( "brand" ), 
        model:
        {
            data: scope.imports.data, 
            field: "label", 
            query: `select * from brand`, 
            sort: "label"
        },
        listeners: [ { event: "dblclick", handler: scope.on.grow } ] } } );

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true, type: "text", value: doc.getField( "label" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "description", type: "text", value: doc.getField( "description" ) } } );

    widgets.add( { active: true, class: "Drilldown", config: { name: "category",
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
        ] } } );

    widgets.add( { active: true, class: "Checkboxes", config: { name: "allergen",
        model:
        {
            data: scope.imports.data,
            field: "label",
            query: "select * from allergen",
            sort: "label"
        }, 
        headless: false, nobreak: true } } );

    widgets.add( { active: true, class: "Input", config: { name: "size", required: false, type: "text", value: doc.getField( "size" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "order number", required: false, type: "text", value: doc.getField( "order number" ) } } );
}