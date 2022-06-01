export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );
    
    let scope = this;
    let doc = scope.getDoc();
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "Date", config: { name: "date", required: true, value: doc.getField( "date" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "type", required: true, type: "input", value: doc.getField( "type" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "label", required: true, type: "input", value: doc.getField( "label" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "script", type: "input", value: doc.getField( "script" ) } } );

    widgets.add( { active: true, class: "Input", config: { name: "line", required: true, type: "number", value: doc.getField( "line" ), min: 0 } } );

    widgets.add( { active: true, class: "Text", config: { name: "description", value: doc.getField( "description" ) } } );

    widgets.add( { active: true, class: "Date", config: { name: "completed", value: doc.getField( "completed" ) } } );
}