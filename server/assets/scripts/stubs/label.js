export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true, type: "text", value: doc.getField( "label" ) } } );
}