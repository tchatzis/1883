export async function load()
{
    var scope = this;
    var parent = scope.getParent();
    var tabs = scope.imports.docs.ce( "div" );
        tabs.id = `${ scope.settings.collection }.tabs`;
    scope.imports.docs.ac( parent, tabs );

    scope.imports.widgets.add( { class: "Tabs", config: { field: scope.settings.tab, name: tabs.id, values: scope.getCollection(), listeners: [ { event: "click", handler: scope.on.tab } ], parent: tabs } } );
};