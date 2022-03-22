export async function load()
{
    var scope = this;
    var parent = scope.getParent();
    var tabs = scope.imports.docs.ce( "div" );
        tabs.id = `${ scope.settings.collection }.tabs`;
    scope.imports.docs.ac( parent, tabs );

    new scope.imports.widgets.Tabs( { scope: scope, field: scope.settings.tab, name: tabs.id, values: scope.getData( scope.settings.collection ), listeners: [ { event: "click", handler: scope.on.tab } ], parent: tabs } );
};