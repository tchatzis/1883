export async function load()
{
    let form = await import( `./${ this.settings.action }.js` );
    await form.load.call( this );

    let scope = this;
    let widgets = scope.imports.widgets;

    widgets.add( { active: true, class: "QR", config: { name: "ip", value: scope.settings.ip } } );
}