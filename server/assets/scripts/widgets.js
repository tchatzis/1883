import Data from "./data.js";
import doc from "./doc.js";
import parse from "./forms.js";

var Widgets = function()
{   
    var scope = this;
    
    async function load( params )
    {
        var d = new Data();

        if ( params.path )
        {
            await d.path( params );

            let values = [];
            let data = {};
            
            d.data.forEach( row =>
            {
                data.name = Object.keys( row )[ 0 ];
                data.values = row[ data.name ];
            } );

            this.data = data;
        }

        if ( params.query )
        {
            await d.query( { url: `/query`, sort: params.sort, query: params.query } );

            let values = [];
            
            d.data.forEach( row =>
            {
                values.push( row[ Object.keys( row ) ] );
            } );

            this.data = { name: params.name, values: values };
        }

        this.populate();
    }

    function block( params )
    {   
        var wrapper = doc.ce( "div" );
            wrapper.classList.add( "field" );
        doc.ac( params.element, wrapper );
        
        var label = doc.ce( "div" );
            label.classList.add( "column" );
        doc.ac( wrapper, label );

        var div = doc.ce( "div" );
            div.classList.add( "input" );
        doc.ac( wrapper, div );

        return { label: label, div: div, wrapper: wrapper };
    }

    function listeners( el, params, data )
    {
        if ( params.listeners )
            params.listeners.forEach( listener => el.addEventListener( listener.event, () => listener.handler( el, params, data ), false ) );
    }

    this.Array = function( params )
    {
        var widgets = new Widgets();

        function wrapper( d )
        {
            d++;
            
            var el = block( params );
                el.label.innerText = params.name || "\n";

            var id = `${ params.name }${ d }`;

            var div = doc.ce( "div" );
                div.classList.add( "flex" );
                div.dataset.row = id;
            doc.ac( el.div, div );

            var form = doc.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => this.add( e ), false );
                form.id = id;
            doc.ac( div, form );

            return { id, div };
        }

        this.add = function( e )
        {
            e.preventDefault();

            console.log( parse( e ) );
            console.log( params );
            console.log( e );
        };

        this.delete = function( e )
        {
            e.preventDefault();

            console.log( e );
        };

        this.reset = function( e )
        {
            e.preventDefault();

            console.log( e );
        };

        // run once
        this.init = function()
        {
            this.row( -1, {} );
            this.populate();
        };

        // create the row of controls
        this.row = function( d, data )
        {
            var { id, div } = wrapper( d );

            console.log( d, id, data )

            params.widgets.forEach( widget => 
            {
                widget.params.Form = id;
                widget.params.element = div;
                widget.params.value = data[ widget.params.name ] || "";
                new widgets[ widget.class ]( widget.params );
            } );

            new widgets.Input( { type: "submit", Form: id, value: "+", element: div } );
            new widgets.Input( { type: "button", Form: id, value: "-", element: div } );
        };

        // loop through data
        this.populate = () => params.data[ params.name ].forEach( ( data, d ) => this.row( d, data ) );

        this.init();
    };

    this.Checkboxes = function( params )
    {
        var el = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                el.label.innerText = this.data.name

                this.data.values.forEach( ( value, i ) =>
                {
                    let predicate = false;
                    let input = doc.ce( "input" );
                        input.type = "checkbox";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value[ params.field ];
                    if ( Array.isArray( params.value ) )
                        predicate = params.value.some( val => val == value[ params.field ] );
                    else
                        predicate = params.value == value[ params.field ]
                    if ( predicate )
                        input.setAttribute( "checked", "" );
                    doc.ac( el.div, input );

                    let label = doc.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value[ params.field ] + " ";
                    doc.ac( el.div, label );
                    
                    if ( !params.nobreak )
                    {
                        let br = doc.ce( "br" );
                        doc.ac( el.div, br );
                    }
                } ); 
            }
        };

        load.call( this, params );
    };

    this.Datalist = function( params )
    {
        var el = block( params );
            el.label.innerText = "\n";

        var input = doc.ce( "input" );      
            input.value = params.value || "";
            input.setAttribute( "required", "" );
        if ( params.Form )
            input.setAttribute( "Form", params.Form );
        
        doc.ac( el.div, input );

        this.populate = function()
        {   
            if ( this.data )
            {
                el.label.innerText = this.data.name   
                
                input.setAttribute( "list", this.data.name );
                input.name = this.data.name;
                listeners( input, params, this.data );

                var datalist = doc.ce( "datalist" );
                    datalist.id = this.data.name;
                doc.ac( el.div, datalist );
                
                this.data.values.forEach( ( value, i ) =>
                {
                    let option = doc.ce( "option" );
                        option.value = value[ params.field ];
                    doc.ac( datalist, option );
                } ); 
            }
        };

        load.call( this, params );
    };

    this.Input = function( params )
    {
        var el = block( params );
            el.label.innerText = params.name || "\n";

        var input = doc.ce( "input" );

        for ( let att in params )
            if ( att !== "element" )
                input.setAttribute( att, params[ att ] );

        doc.ac( el.div, input );

        return input;
    };
    
    this.Radio = function( params )
    {
        var el = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                el.label.innerText = this.data.name
                
                this.data.values.forEach( ( value, i ) =>
                {
                    let input = doc.ce( "input" );
                        input.type = "radio";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                    if ( params.value && params.value == value )
                        input.setAttribute( "checked", "" );
                    if ( params.required )
                        input.setAttribute( "required", "" );
                    doc.ac( el.div, input );

                    let label = doc.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    doc.ac( el.div, label );
                    
                    if ( !params.nobreak )
                    {
                        let br = doc.ce( "br" );
                        doc.ac( el.div, br );
                    }
                } ); 
            }
        };

        load.call( this, params );
    };
    
    this.Select = function( params )
    {
        var el = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                el.label.innerText = this.data.name

                let input = doc.ce( "select" );
                    input.name = this.data.name;
                    input.id = this.data.name;
                if ( params.required )
                    input.setAttribute( "required", params.required );
                doc.ac( el.div, input );

                this.data.values.forEach( ( value ) =>
                {
                    let option = doc.ce( "option" );
                        option.text = value;
                        option.value = value;
                    if ( params.value && params.value == option.value )
                        option.setAttribute( "selected", "");
                    doc.ac( input, option );
                } ); 
            }
        };

        load.call( this, params );
    };

    this.Tabs = function( params )
    {   
        var tabs = [];
        var data = [ ...params.data ];
            data.forEach( row => 
            {
                Object.values( row ).forEach( data => 
                {              
                    if ( !tabs.find( field => field == data[ params.tab ] ) )
                        if ( data[ params.tab ] )
                            tabs.push( data[ params.tab ] );
                } );
            } );

        if ( tabs.length )
        {
            let div = doc.ce( "div" );
                div.classList.add( "flex" );
            doc.ac( params.element, div );

            let label = doc.ce( "div" );
                label.innerText = params.tab;
                label.classList.add( "tabs" );
            doc.ac( div, label );

            tabs.forEach( text =>
            {
                var tab = doc.ce( "div" );
                    tab.innerText = text;
                    tab.classList.add( "tab" );
                listeners( tab, params, text );
                doc.ac( div, tab );
            } );

            let underline = doc.ce( "div" );
                underline.classList.add( "underline" );
            doc.ac( div, underline );
        }
    };
};

export default Widgets;