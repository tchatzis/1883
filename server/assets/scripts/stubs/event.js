export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "name", required: true, type: "text", value: doc.getField( "name" ) } } );
    
    widgets.add( { active: true, class: "Input", config: { name: "BEO", required: true, type: "number", value: doc.getField( "BEO" ) } } );

    widgets.add( { active: true, class: "Date", config: { name: "date", required: true, value: doc.getField( "date" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "time", required: true, type: "time", value: doc.getField( "time" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "guests", required: true, type: "number", value: doc.getField( "guests" ) } } );

    widgets.add( { active: true, class: "Drilldown", config: { name: "location",
        widgets: 
        [ 
            { class: "Select", config: { name: "venue", required: true, value: doc.getField( "venue" ),
            model:
            {
                data: scope.imports.data,
                field: "name",
                query: `select * from venue`, 
                sort: "name"  
            } } }, 
            { class: "Select", config: { name: "rooms", required: true, value: doc.getField( "room" ), 
            model:
            {
                array: [],
                data: scope.imports.data,
                field: "label"
            } } }, 
        ] } } );
}