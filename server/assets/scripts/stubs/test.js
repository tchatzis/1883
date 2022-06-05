export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let charts = scope.imports.charts;
    let widgets = scope.imports.widgets;

    // charts
    let chart = charts.init( { parent: sub, width: 400, height: 300, spacing: 20 } );
        //chart.add( { class: "Pie", config: { value: [ 0.55, 0.25 ], size: 10, color: [ "orange", "darkred" ] } } );
        chart.add( { class: "Ring", config: { value: [ 0.55, 0.25, 0.2 ], size: 10, color: [ "green", "red", "blue" ] } } );
        //chart.add( { class: "Dual", config: { value: [ 0.75, 0.25 ], size: 10, color: [ "green", "red" ] } } );
        //chart.add( { class: "Dual", config: { value: [ 0.75, 0.75 ], size: 10, color: [ "orange", "blue" ] } } );
        //chart.add( { class: "Dual", config: { value: [ 0.35, 0.45 ], size: 10, color: [ "purple", "pink" ] } } );
        //chart.add( { class: "Bar", config: { value: 0.55, size: 10, color: "gray" } } );

    // widgets
    widgets.add( { active: false, class: "Arrays", config: { name: "array", value: doc.getField( "array" ),
        widgets:
        [
            { class: "Input", config: { name: "col0" } },
            { class: "Input", config: { name: "col1" } },
            { class: "Input", config: { name: "col2" } }
        ] } } );

    widgets.add( { active: false, class: "Broadcaster", config: { name: "tito", audio: false, video: true } } );

    widgets.add( { active: false, class: "Calendar", config: { name: "calendar", value: new Date( doc.getField( "date" ) ), 
        model:
        {
            data: scope.imports.data,
            field: "name"
        },
        listeners: 
        [ 
            { event: "click", handler: scope.on.date }, 
            { event: "select", handler: scope.on.select }
        ] } } );

    widgets.add( { active: false, class: "Checkboxes", config: { name: "checkboxes",
        model:
        {
            data: scope.imports.data,
            field: "label",
            query: "select * from allergen",
            sort: "label"
        }, 
        headless: false, 
        nobreak: true } } );

    widgets.add( { active: false, class: "Color", config: { name: "color", required: true, value: doc.getField( "color" ) } } );

    widgets.add( { active: false, class: "Datalist", config: { name: "datalist", value: doc.getField( "datalist" ), 
        model:
        {
            data: scope.imports.data, 
            field: "label", 
            query: `select * from group`, 
            sort: "label"
        },
        listeners: [ { event: "dblclick", handler: scope.on.grow } ] } } );

    widgets.add( { active: false, class: "Date", config: { name: "date", required: true, value: new Date( doc.getField( "date" ) ) } } );

    widgets.add( { active: false, class: "Draw", config: { name: "draw", required: true, value: doc.getField( "draw" ), width: 200, height: 100 } } );

    widgets.add( { active: false, class: "Drilldown", config: { name: "drilldown",
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
    
    widgets.add( { active: false, class: "Input", config: { name: "input", required: true, type: "text", value: doc.getField( "name" ) } } );

    widgets.add( { active: false, class: "Matrix", config: { name: "storage", value: doc.getField( "assign" ),
        model:
        {
            data: scope.imports.data,
            field: "name",
            query: `select * from venue`,   
        },
        widgets:
        [
            { class: "Select", config: { name: "storage", 
                model:
                {
                    field: "label" 
                } } },
            { class: "Input", config: { name: "inventory", type: "number", min: 0, 
                model:
                {
                    field: "quantity"
                } } 
            }
        ]
     } } );

    widgets.add( { active: false, class: "Objects", config: { name: "object",
        widgets:
        [ 
            { class: "Select", config: { name: "content", required: true,
                model:
                {
                    array: [ "table", "calendar", "offline" ],
                    data: scope.imports.data,
                } 
            } },
            { class: "Checkboxes", config: { name: "fields", required: true,
                model:
                {
                    array: scope.imports.data.fields[ scope.settings.collection ],
                    data: scope.imports.data,
                },
                nobreak: true 
            } },
            { class: "Input", config: { name: "sort", required: true } }, 
            { class: "Input", config: { name: "tab", required: true } }, 
        ] } } );

    widgets.add( { active: false, class: "Popup", config: { name: "popup", height: "50vh", width: "50vw" } } );

    widgets.add( { active: false, class: "QR", config: { name: "url", required: true, size: 256, value: `${ scope.settings.ip }:3000/rtc` } } );

    widgets.add( { active: false, class: "Radios", config: { name: "radios", value: doc.getField( "radios" ),
        model:
        { 
            data: scope.imports.data,
            field: "label", 
            query: "select * from temp", 
            sort: "label"
        }, 
        headless: false } } );

    widgets.add( { active: false, class: "Select", config: { name: "select", required: true, value: doc.getField( "select" ), 
        model:
        {
            data: scope.imports.data,
            field: "label",
            query: `select * from group`, 
            sort: "label"  
        } } } );

    widgets.add( { active: false, class: "Text", config: { name: "text", required: true, value: doc.getField( "text" ) } } );

    widgets.add( { active: false, class: "Tuple", config: { name: "Tuple", value: doc.getField( "Tuple" ) } } );

    widgets.add( { active: false, class: "UPC", config: { name: "upc", required: false, value: null } } );

    widgets.add( { active: false, class: "Watcher", config: { name: "tito" } } );

    //console.dir( this );
};