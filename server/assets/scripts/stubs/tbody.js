export function load()
{
    var scope = this;
    var filter = scope.imports.data.schema[ scope.settings.collection ].filter;
    var tbody = scope.getElement( "data" ).el;
    var fields = scope.settings.fields || scope.imports.data.fields[ scope.settings.collection ];

    scope.setClear( tbody );

    scope.imports.data.filter( scope.imports.data.store[ scope.settings.collection ], filter ).forEach( d =>
    {       
        let doc = new scope.Doc( d );

        let tr = scope.imports.docs.ce( "tr" );
            tr.dataset.id = doc.id;
            tr.addEventListener( "click", ( e ) => scope.on.select( e, doc ), false );
            tr.addEventListener( "contextmenu", scope.on.prevent, false );
            tr.classList.add( "row" );

        fields.forEach( field =>
        {                         
            let td = scope.imports.docs.ce( "td" );
                td.dataset.field = field;
                td.classList.add( "cell" );
                td.innerText = scope.getText( doc.data[ field ] );

            scope.imports.docs.ac( tr, td );
        } );

        scope.imports.docs.ac( tbody, tr );
    } );
}