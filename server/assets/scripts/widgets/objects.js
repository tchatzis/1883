import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";
import parse from "../forms.js";

export default function Objects( config )
{
    // add handle
    config.scope.form.widgets[ config.name ] = this;
    
    Common.call( this, config );
    Config.call( config, config );

    var data = this.getData( config );
    var scope = this;
    var rows = [];

    var form = docs.ce( "form" );
        form.setAttribute( "method", "post" );
        form.addEventListener( "submit", scope.update );
        form.id = config.name;
    docs.ac( config.parent, form );

    this.name = config.name;

    this.label = docs.ce( "div" );
    this.label.classList.add( "label" );
    this.label.innerText = config.name || "\n";
    if ( config.headless )
        this.label.style.display = "none";
    docs.ac( config.parent, this.label );

    this.multi = true;
    this.section = docs.ce( "section" );
    this.section.title = config.name;
    docs.ac( config.parent, this.section );

    function change( e )
    {
        e.preventDefault();

        var value = data[ e.target.name ] || e.target.value;

        data[ e.target.name ] = value;
    }

    this.init = ( config ) =>
    {   
        config.widgets.forEach( widget =>
        {   
            var row = [];
                row.push(
                    { class: "Label", config: { parent: widget.config.parent, value: widget.config.name } },
                    { class: widget.class, config: Object.assign( widget.config, { name: widget.config.name, value: config.doc.getField( config.name )[ widget.config.name ], listeners: [ { event: "input", handler: change } ] } ) }
                    // TODO: add delete button
                );

            rows.push( row );
        } );

        //TODO: dnd labels to reorder fields

        

        this.populate();
    };

    /*this.add = function( e )
    {
        e.preventDefault();

        var row = parse( e );
        var value = row.tuple();

        Object.assign( data, value );

        scope.populate();

        e.target.reset();
    };

    this.delete = function( e )
    {
        e.preventDefault();

        var name = Array.from( e.target.form.elements ).find( el => el.name == "name" );

        delete data[ name.dataset.value ];

        scope.populate();
    };

    this.update = function( e )
    {
        e.preventDefault();
        
        var row = parse( e );
        var name = Array.from( e.target.form.elements ).find( el => el.name == "name" );

        data[ name.dataset.value ] = row.value;
    };*/

    this.populate = () => 
    {
        this.section.innerHTML = null; 

        rows.forEach( row =>
        {
            var parent = docs.ce( "div" );
                parent.classList.add( "flex" );
            
            row.forEach( async ( widget ) =>
            {
                var _config = new config.scope.imports.widgets.Config( widget.config.name, this, config );
                    _config.Form = scope.name;
                    _config.headless = true;
                    _config.parent = parent;
                docs.ac( scope.section, parent );

                Object.assign( widget.config, _config );

                await new config.scope.imports.widgets[ widget.class ]( widget.config );
            } );
        } );

        scope.broadcast( config );
    };

    this.init( config ); 
}