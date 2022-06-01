export async function load()
{
    var scope = this;
        scope.form = 
        {
            data: null,
            id: null,
            parent: scope.getParent(),
            widgets: {}
        };

    await scope.imports.widgets.add( { class: "Toolbar", config: { controls:
    [
        { title: "add", listeners: [ { event: "click", handler: scope.on.add } ] },
    ],
    parent: scope.form.parent } } );

    //scope.controls[ "add" ].enable( scope.controls[ `${ scope.settings.collection }.tabs` ].enabled );

    var table = scope.imports.docs.ce( "table" );
    scope.imports.docs.ac( scope.getParent(), table );

    var thead = scope.imports.docs.ce( "thead" );
    scope.imports.docs.ac( table, thead );

    // column headings
    var tr = scope.imports.docs.ce( "tr" );
        tr.id = "columns";
    scope.imports.docs.ac( thead, tr );

    scope.setElement( tr );
    scope.setClear( tr );

    // populate headings
    var fields = scope.settings.fields || scope.imports.data.fields[ scope.settings.collection ];
        fields.forEach( field =>
        {
            let td = scope.imports.docs.ce( "td" );
                td.classList.add( "column" );
                td.innerText = field;

            scope.imports.docs.ac( tr, td );
        } );

    // defined here, so tbody can be called, without adding a new element
    var tbody = scope.imports.docs.ce( "tbody" );
        tbody.id = "data";
    scope.imports.docs.ac( table, tbody );

    scope.setElement( tbody );
}