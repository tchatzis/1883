import docs from "../docs.js";

export default function( config, widgets )
{ 
        // add handle
        config.scope.form.widgets[ config.name ] = this;

        this.name = config.name;
        this.multi = true;
        this.section = docs.ce( "section" );
        this.section.title = config.name;

        this.init = function( config )
        {
            var { id, parent } = wrapper.call( this, -1, config );

            widgets.forEach( widget => 
            {   
                var _config = new config.scope.imports.widgets.Config( widget.config.name, this, config );
                    _config.Form = id;
                    _config.parent = parent;
                    _config.headless = true;

                Object.assign( widget.config, _config );

                new config.scope.imports.widgets[ widget.class ]( widget.config );
            } );

            new config.scope.imports.widgets.Control( { type: "submit", value: "\u002b",
            headless: true,
            Form: id,
            parent: parent } );

            docs.ac( config.parent, this.section );

            this.populate();
        };

        // create the row of controls
        this.row = function( index, data )
        {
            config.parent = this.section;

            var { id, parent } = wrapper.call( this, index, config );
            var headless = [];
            
            widgets.forEach( widget => 
            {
                headless.push( widget.config.headless );
                
                var value = ( typeof data == "string" ) ? data : data[ widget.config.name ] !== undefined ? data[ widget.config.name ] : "";
                var _config = new config.scope.imports.widgets.Config( widget.config.name, this, config );
                    _config.Form = id;
                    _config.parent = parent;
                    _config.headless = true;
                    _config.value = value;
                    _config[ "data-value" ] = value;

                Object.assign( widget.config, _config );

                new config.scope.imports.widgets[ widget.class ]( widget.config );
            } );

            function hide( button )
            {
                var hidden = [];
                
                widgets.forEach( widget =>
                {
                    hidden.push( !widget.config.hide?.[ button ] );
                } );

                return hidden.every( p => p );
            }

            if ( hide( "update" ) )
                new config.scope.imports.widgets.Input( { scope: config.scope, type: "submit", Form: id, value: "\u2705", parent: parent, headless: true, "data-index": index } );
            
            if ( hide( "delete" ) ) 
                new config.scope.imports.widgets.Input( { scope: config.scope, type: "button", Form: id, value: "\u274c", parent: parent, headless: true, "data-index": index, listeners: [ { event: "click", handler: this.delete } ] } );
        };

        function wrapper( index, config )
        {   
            var id = `${ config.name }${ index }`;
            
            var wrapper = docs.ce( "div" );
                wrapper.classList.add( "field" );
                wrapper.dataset.id = id;
            docs.ac( config.parent, wrapper );
    
            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", index < 0 ? this.add : this.update, false );
                form.id = id;
            docs.ac( wrapper, form );
    
            // hide field name
            if ( index < 0 )
            {
                let label = docs.ce( "div" );
                    label.classList.add( "label" );
                    label.innerText = config.name || "\n";
                docs.ac( wrapper, label );
            }
    
            var parent = docs.ce( "div" );
                parent.classList.add( "flex" );
                parent.dataset.row = id;
            docs.ac( wrapper, parent );
    
            index++;
    
            return { id, parent };
        }
}