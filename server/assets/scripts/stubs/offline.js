export function load( widgets, parameters, templates )
{
    //var tuple = new widgets.Config( "tuples", null, parameters, {} );
    
    //new widgets.Tuple( tuple );

    /*
    var assign = new widgets.Config( "assign", parameters, {} );

    //new widgets.Tuple( assign );*/
    console.warn( parameters.parent );

    var array = new widgets.Config( "arrays", null, parameters, [] );
        array.widgets =
        [
            { class: "Input", config: new widgets.Config( "name", null, array, array.default ) },
            { class: "Input", config: new widgets.Config( "value", null, array, array.default ) }
        ];

    new widgets.Array( array );

    //var list = new widgets.Config( "lists", parameters, [] );

    //new widgets.List( list );

    /*var matrix = 
    {
        //id: id,
        doc: parameters.doc,
        parent: parameters.parent,
        name: "assign",
        field: "name",
        query: `select * from venue`,
        //collection: scope.collection,
        widgets:
        [
            { class: "Select", config: { name: "storage", field: "label" } },
            { class: "Select", config: { name: "rooms", field: "label" } }
        ]
    };

    //new widgets.Matrix( matrix );
    */
};