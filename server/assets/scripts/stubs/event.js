export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    new scope.imports.widgets.Input( { scope: scope, name: "name", required: true, type: "text", value: doc.getField( "name" ) } );
    
    new scope.imports.widgets.Input( { scope: scope, name: "BEO", required: true, type: "number", value: doc.getField( "BEO" ) } );

    new scope.imports.widgets.Date( { scope: scope, name: "date", required: true, value: doc.getField( "date" ) } );

    new scope.imports.widgets.Input( { scope: scope, name: "time", required: true, type: "time", value: doc.getField( "time" ) } );

    new scope.imports.widgets.Input( { scope: scope, name: "guests", required: true, type: "number", value: doc.getField( "guests" ) } );

    new scope.imports.widgets.Drilldown( { scope: scope, name: "location",
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
        { class: "Select", config: { name: "room", required: true, value: doc.getField( "room" ), 
        model:
        {
            array: [],
            data: scope.imports.data,
            field: "label"
        } } }, 
    ] } );
}