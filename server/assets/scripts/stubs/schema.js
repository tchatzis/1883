export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true, type: "text", value: doc.getField( "label" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "collection", type: "text", value: doc.getField( "collection" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "endpoint", required: true, type: "text", value: doc.getField( "endpoint" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "sequence", required: true, type: "number", value: doc.getField( "sequence" ) || scope.imports.data.store[ scope.settings.collection ].length + 1, min: 0 } } );

    widgets.add( { active: true, class: "Select", config: { name: "class", required: true, value: doc.getField( "class" ), 
        model:
        {
            array: [ "Custom", "DB", "Static", "Download", "File", "Directory" ], 
            data: scope.imports.data 
        } } } );

    widgets.add( { active: true, class: "Select", config: { name: "role", required: true, value: doc.getField( "role" ), 
        model:
        {
            array: [ "public", "user", "admin", "developer" ], 
            data: scope.imports.data 
        } } } );

    var collection = doc.getField( "collection" );

    if ( collection )
    {
        widgets.add( { active: true, class: "Model", config: { name: "fields",
            model: 
            {
                callback: next,
                data: scope.imports.data,
                query: `select * from ${ collection }`,
                sort: null
            } } } );

        function next()
        {
            widgets.add( { active: true, class: "Objects", config: { name: "parameters",
                widgets:
                [ 
                    { class: "Select", config: { name: "content", required: true,
                        model:
                        {
                            array: [ "table", "calendar", "offline" ],
                            data: scope.imports.data,
                        } 
                    } },
                    { class: "Input", config: { name: "sub" } }, 
                    { class: "Checkboxes", config: { name: "fields",
                        model:
                        {
                            array: scope.imports.data.fields[ collection ],
                            data: scope.imports.data
                        },
                        nobreak: true 
                    } },
                    { class: "Input", config: { name: "sort" } }, 
                    { class: "Input", config: { name: "tab"} }, 
                ] } } );
        }
    }
}