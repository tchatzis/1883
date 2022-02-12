import docs from "./docs.js";
import parse from "./forms.js";

var Widgets = function( data )
{   
    var widgets = this;

    function block( params )
    {   
        var wrapper = docs.ce( "div" );
            wrapper.classList.add( "field" );
        docs.ac( params.element, wrapper );
        
        var label = docs.ce( "div" );
            label.classList.add( "column" );
        if ( params.headless )
            label.style.display = "none";
        docs.ac( wrapper, label );

        var div = docs.ce( "div" );
            div.classList.add( "input" );
        docs.ac( wrapper, div );

        return { label, div, wrapper };
    }

    function listeners( el, params, data )
    {
        if ( params.listeners )
            params.listeners.forEach( listener => el.addEventListener( listener.event, () => listener.handler( el, params, data ), false ) );
    }

    this.Array = function( params )
    {   
        var scope = this;
        var section = docs.ce( "section" );
            section.title = params.name;

        function wrapper( d, parent )
        {
            var id = `${ params.name }${ d }`;
            
            var wrapper = docs.ce( "div" );
                wrapper.classList.add( "field" );
                wrapper.dataset.id = id;
            docs.ac( parent, wrapper );

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", d < 0 ? scope.add : scope.update, false );
                form.id = id;
            docs.ac( wrapper, form );

            // hide field name
            if ( d < 0 )
            {
                let label = docs.ce( "div" );
                    label.classList.add( "column" );
                    label.innerText = params.name || "\n";
                docs.ac( wrapper, label );
            }

            var row = docs.ce( "div" );
                row.classList.add( "flex" );
                row.dataset.row = id;
            docs.ac( wrapper, row );

            d++;

            return { id, row };
        }

        this.add = function( e )
        {
            e.preventDefault();

            var row = parse( e );
            var array = params.values[ params.name ];
                array.push( row );

            e.target.reset();

            scope.populate();
        };

        this.delete = function( e )
        {
            var array = params.values[ params.name ];
                array.splice( e.dataset.index, 1 );

            scope.populate();
        };

        this.update = function( e )
        {
            e.preventDefault();

            var row = parse( e );
            var array = params.values[ params.name ];
                array[ e.submitter.dataset.index ] = row;
        }; 

        // run once
        this.init = function()
        {
            var { id, row } = wrapper( -1, params.element );
            
            params.widgets.forEach( widget => 
            {
                var params = { ...widget.params  };
                    params.Form = id;
                    params.element = row;
                    params.placeholder = widget.params.name;

                new widgets[ widget.class ]( params );
            } );

            new widgets.Input( { type: "submit", Form: id, value: "\u002b", element: row } );

            docs.ac( params.element, section );

            this.populate();
        };

        // create the row of controls
        this.row = function( d, data )
        {
            var { id, row } = wrapper( d, section );
            
            params.widgets.forEach( widget => 
            {
                var params = { ...widget.params  };
                    params.Form = id;
                    params.element = row;
                    params.placeholder = widget.params.name;
                    params.value = data[ widget.params.name ] || "";
                    params.headless = true;

                new widgets[ widget.class ]( params );
            } );

            new widgets.Input( { type: "submit", Form: id, value: "\u2705", element: row, headless: true, "data-index": d } );
            new widgets.Input( { type: "button", Form: id, value: "\u274c", element: row, headless: true, "data-index": d, listeners: [ { event: "click", handler: scope.delete } ] } );
        };

        // loop through data
        this.populate = () => 
        {
            section.innerHTML = null; 

            params.values[ params.name ] = params.values[ params.name ] || [];
            params.values[ params.name ].forEach( ( data, d ) => this.row( d, data ) );

            scope.values = params.values;
        };

        this.init();
    };

    this.Checkboxes = function( params )
    {
        var { label, div, wrapper } = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                label.innerText = this.data.name

                this.data.values.forEach( ( value, i ) =>
                {
                    let predicate = false;
                    let input = docs.ce( "input" );
                        input.type = "checkbox";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value[ params.field ];
                    if ( params.Form )
                        input.setAttribute( "Form", params.Form );
                    if ( Array.isArray( params.value ) )
                        predicate = params.value.some( val => val == value[ params.field ] );
                    else
                        predicate = params.value == value[ params.field ]
                    if ( predicate )
                        input.setAttribute( "checked", "" );
                    docs.ac( div, input );

                    let label = docs.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value[ params.field ] + " ";
                    docs.ac( div, label );
                    
                    if ( !params.nobreak )
                    {
                        let br = docs.ce( "br" );
                        docs.ac( div, br );
                    }
                } ); 
            }
        };

        data.load.call( this, params );
    };

    this.Datalist = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = "\n";

        var input = docs.ce( "input" );      
            input.value = params.value || "";
            input.setAttribute( "required", "" );
        if ( params.Form )
            input.setAttribute( "Form", params.Form );
        if ( params.placeholder )
            input.setAttribute( "placeholder", params.placeholder );
        
        docs.ac( div, input );

        this.populate = function()
        {   
            if ( this.data )
            {
                label.innerText = this.data.name;
                let id = params.Form ? `${ params.Form }_${ this.data.name }` : this.data.name;  
                
                input.setAttribute( "list", id );
                input.name = this.data.name;
                listeners( input, params, this.data );

                var datalist = docs.ce( "datalist" );
                    datalist.id = id;
                docs.ac( div, datalist );
                
                this.data.values.forEach( ( value, i ) =>
                {
                    var text = "";
                    var option = docs.ce( "option" )

                    if ( Array.isArray( params.field ) )
                    {
                        let array = [];

                        params.field.forEach( ( field, index ) =>
                        {
                            if ( index > 0 )
                            {
                                if ( value[ field ] )
                                {
                                    array.push( `( ${ value[ field ] } )` );
                                    option.setAttribute( `data-${ field }`, value[ field ] );
                                }
                            }
                            else
                            {
                                array.push( value[ field ] );
                                option.setAttribute( `data-${ field }`, value[ field ] );
                            }
                        } );

                        text = array.join( " " );
                    }
                    else
                    {
                        text = value[ params.field ];
                        option.setAttribute( `data-${ params.field }`, value[ params.field ] );
                    }

                    option.value = text;
                    option.innerText = text;
                    docs.ac( datalist, option );
                } ); 
            }
        };

        data.load.call( this, params );
    };

    this.Input = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";

        var input = docs.ce( "input" );
        listeners( input, params );

        for ( let att in params )
            if ( ![ "element", "headless", "listeners" ].some( hidden => hidden == att ) )
                input.setAttribute( att, params[ att ] );

        docs.ac( div, input );

        return input;
    };
    
    this.Radio = function( params )
    {
        var { label, div, wrapper } = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                label.innerText = this.data.name
                
                this.data.values.forEach( ( value, i ) =>
                {
                    let input = docs.ce( "input" );
                        input.type = "radio";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                    if ( params.Form )
                        input.setAttribute( "Form", params.Form );
                    if ( params.value && params.value == value )
                        input.setAttribute( "checked", "" );
                    if ( params.required )
                        input.setAttribute( "required", "" );
                    docs.ac( div, input );

                    let label = docs.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    docs.ac( div, label );
                    
                    if ( !params.nobreak )
                    {
                        let br = docs.ce( "br" );
                        docs.ac( div, br );
                    }
                } ); 
            }
        };

        data.load.call( this, params );
    };
    
    this.Select = function( params )
    {
        var { label, div, wrapper } = block( params );

        this.populate = function()
        {   
            if ( this.data )
            {
                label.innerText = this.data.name

                let input = docs.ce( "select" );
                    input.name = this.data.name;
                    input.id = this.data.name;
                    input.value = params.value;
                if ( params.Form )
                    input.setAttribute( "Form", params.Form );
                if ( params.required )
                    input.setAttribute( "required", params.required );
                docs.ac( div, input );

                this.data.values[ 0 ].forEach( ( value ) =>
                {
                    let option = docs.ce( "option" );
                        option.text = value;
                        option.value = value;
                    if ( params.value && params.value == option.value )
                    { 
                        option.setAttribute( "selected", "");
                    }
                    docs.ac( input, option );
                } ); 
            }
        };

        data.load.call( this, params );
    };

    this.Tabs = function( params )
    {   
        var tabs = [];
        var values = [ ...params.values ];
            values.forEach( docs => 
            {
                Object.values( docs ).forEach( doc => 
                {              
                    if ( !tabs.find( field => field == doc[ params.field ] ) )
                        if ( doc[ params.field ] )
                            tabs.push( doc[ params.field ] );
                } );
            } );

        if ( tabs.length )
        {
            let div = docs.ce( "div" );
                div.classList.add( "flex" );
            docs.ac( params.parent, div );

            let label = docs.ce( "div" );
                label.innerText = params.field;
                label.classList.add( "tabs" );
            docs.ac( div, label );

            tabs.forEach( text =>
            {
                var tab = docs.ce( "div" );
                    tab.innerText = text;
                    tab.classList.add( "tab" );
                listeners( tab, params, text );
                docs.ac( div, tab );
            } );

            let underline = docs.ce( "div" );
                underline.classList.add( "underline" );
            docs.ac( div, underline );
        }
    };
};

export default Widgets;