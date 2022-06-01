export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true, type: "input", value: doc.getField( "label" ) } } );
    widgets.add( { active: true, class: "Input", config: { type: "number", name: "sequence", required: true, value: doc.getField( "sequence" ) || scope.imports.data.store[ scope.settings.collection ].length + 1 } } );
}