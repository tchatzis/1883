export default function( config )
{       
    this.data = config.scope.imports.data;
    this.doc = config.doc;
    this.Form = config.Form || config.scope.form.id;
    this.model = config.model || {};
    this.parent = config.parent || config.scope.form.parent;  
    this.scope = config.scope;

    config.scope.form.widgets[ config.name ] = this;
}