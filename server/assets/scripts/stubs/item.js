export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true,type: "text", value: doc.getField( "label" ) } } );

    widgets.add( { active: true, class: "Datalist", config: { name: "group", value: doc.getField( "group" ), 
        model:
        {
            data: scope.imports.data, 
            field: "label",
            query: `select * from group`, 
            sort: "label"
        }, 
        listeners: [ { event: "dblclick", handler: scope.on.grow } ] } } );

    widgets.add( { active: true, class: "Text", config: { name: "description", required: true, value: doc.getField( "description" ) } } );
    
    widgets.add( { active: true, class: "Array", config: { name: "item", value: doc.getField( "item" ),
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
        ] } } );
};