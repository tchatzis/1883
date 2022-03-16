export async function load()
{
    var scope = this;
    var parent = scope.getParent();
    var tabs = scope.imports.docs.ce( "div" );
        tabs.id = "tabs";
    scope.imports.docs.ac( parent, tabs );

    scope.setClear( tabs );

    new scope.imports.widgets.Tabs( { field: scope.settings.tab, values: scope.getData( scope.settings.collection ), listeners: [ { event: "click", handler: scope.on.tab } ], parent: tabs } );
};