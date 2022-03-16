export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();

    /*new scope.imports.widgets.Array( { scope: scope, name: "array", value: doc.getField( "array" ),
    widgets:
    [
        { class: "Input", config: { name: "col0" } },
        { class: "Input", config: { name: "col1" } },
        { class: "Input", config: { name: "col2" } }
    ] } );*/

    /*new scope.imports.widgets.Calendar( { scope: scope, name: "calendar", value: new Date(), 
    model:
    {
        data: scope.imports.data,
        field: "name"
    },
    listeners: 
    [ 
        { event: "click", handler: ( e ) => scope.on.date( e, config ) }, 
        { event: "select", handler: scope.on.select }
    ] } );*/

    /*new scope.imports.widgets.Checkboxes( { scope: scope, name: "checkboxes",
    model:
    {
        array: doc.getField( "assign" ), 
        data: scope.imports.data
    }, 
    headless: false, nobreak: true } );*/

    //new scope.imports.widgets.Color( { scope: scope, name: "color", required: true, value: "#666666" } );

    /*new scope.imports.widgets.Datalist( { scope: scope, name: "datalist", value: doc.getField( "group" ), 
    model:
    {
        data: scope.imports.data, 
        field: "label", 
        query: `select * from group`, 
        sort: "label"
    },
    listeners: [ { event: "dblclick", handler: scope.on.grow } ] } );*/

    //new scope.imports.widgets.Date( { scope: scope, name: "date", required: true, value: new Date() } );

    new scope.imports.widgets.Drilldown( { scope: scope, name: "drilldown",
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
    
    //new scope.imports.widgets.Input( { scope: scope, name: "input", required: true, type: "text", value: doc.getField( "name" ) } );

    /*new scope.imports.widgets.Radios( { scope: scope, name: "radios",
    model:
    { 
        data: scope.imports.data,
        field: "label", 
        query: "select * from group", 
        sort: "label"
    }, 
    headless: false } );*/

    /*new scope.imports.widgets.Select( { scope: scope, name: "select", required: true, value: doc.getField( "label" ), 
    model:
    {
        data: scope.imports.data,
        field: "label",
        query: `select * from group`, 
        sort: "label"  
    } } );*/

    //new scope.imports.widgets.Text( { scope: scope, name: "text", required: true, value: "Tito" } );

    //new scope.imports.widgets.Tuple( { scope: scope, name: "Tuple" } );

    //console.dir( this );
};