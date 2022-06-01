export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );

    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Input", config: { name: "name", required: true, type: "text", value: doc.getField( "name" ) } } );

    widgets.add( { active: true, class: "Arrays", config: { name: "rooms", value: doc.getField( "rooms" ),
        widgets:
        [
            { class: "Input", config: { name: "label" } },
            { class: "Input", config: { name: "type" } },
            { class: "Input", config: { name: "description" } }
        ] } } );
    widgets.add( { active: true, class: "Arrays", config: { name: "storage", value: doc.getField( "storage" ),
        widgets:
        [
            { class: "Input", config: { name: "label" } }
        ] } } );
}