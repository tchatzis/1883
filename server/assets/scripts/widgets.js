import dates from "./dates.js";
import DND from "./dnd.js";
import docs from "./docs.js";
import parse from "./forms.js";

var Widgets = function( data )
{   
    var widgets = this;

    function block( params, css )
    {   
        var wrapper = docs.ce( "div" );
            wrapper.classList.add( "field" );
        docs.ac( params.element, wrapper );
        
        var label = docs.ce( "div" );
            label.classList.add( css || "label" );
        if ( params.headless )
            label.style.display = "none";
        docs.ac( wrapper, label );

        var div = docs.ce( "div" );
            div.classList.add( "input" );
        docs.ac( wrapper, div );

        return { label, div, wrapper };
    }

    function listeners( el, params, object )
    {
        if ( params.listeners )
            params.listeners.forEach( listener => el.addEventListener( listener.event, ( e ) => { e.preventDefault(); listener.handler( e, params, object ) }, false ) );

        var values = ( params.values && params.object ) ? params.values[ params.object ] : params.values;

        if ( params.values )
            el.addEventListener( "input", () => values[ el.name ] = el.value );
    }

    function normalize( array, params )
    {
        while( Array.isArray( array[ 0 ] ) )
            array = array[ 0 ];

        if ( !params.hasOwnProperty( "field" ) )
        {
            params.field = "option";

            array = array.map( value => 
            { 
                var obj = {}; 
                    obj[ params.field ] = value;

                return obj;
            } );
        }

        return array;
    }

    // widgets
    this.Array = function( params )
    {   
        var scope = this;
        var section = docs.ce( "section" );
            section.title = params.name;
        var dnd = new DND(); 
        var object = params.object ? params.values[ params.object ] : params.values;
        var values = object[ params.name ] || [];

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
            var value = params.tuple ? row.tuple() : row;
            
            values.push( value );

            e.target.reset();

            scope.populate();
        };

        this.delete = function( e )
        {
            values.splice( e.target.dataset.index, 1 );

            scope.populate();
        };

        this.update = function( e )
        {
            e.preventDefault();
            
            var row = parse( e );
            values[ e.submitter.dataset.index ] = params.tuple ? row.tuple() : row;
        }; 

        // run once
        this.init = function()
        {
            var { id, row } = wrapper( -1, params.element );
            var headless = [];
            
            params.widgets.forEach( widget => 
            {
                var params = { ...widget.params  };
                    params.Form = id;
                    params.element = row;
                    params.placeholder = widget.params.name;

                if ( params.headless )
                    headless.push( params.headless );

                new widgets[ widget.class ]( params );
            } );

            new widgets.Input( { type: "submit", Form: id, value: "\u002b", element: row, headless: headless.some( h => h ) } );

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

            var display_values;

            if ( params.tuple )
            {
                display_values = [ ...values ].map( tuple => tuple.untuple() );
                display_values.forEach( ( data, d ) => this.row( d, data ) );
            }
            else
            {   
                display_values = [ ...values ];
                display_values.forEach( ( data, d ) => this.row( d, data ) );
            }

            object[ params.name ] = values;
        };

        this.init();

        dnd.init( section, ( e ) => docs.find( e, "[draggable='true']" ), values );
    };

    this.Calendar = function( params )
    {
        var calendar = this;
        var today = new Date();
        var step = 1000 * 60 * 60 * 24;
        var table, th, tbody, tr;

        this.data = params.data;

        function init()
        {
            if ( !calendar.initialized )
            {    
                table = docs.ce( "table" );
                table.classList.add( "calendar" );
                table.id = "calendar";
                docs.ac( params.element, table );

                var thead = docs.ce( "thead" );
                docs.ac( table, thead );

                tbody = docs.ce( "tbody" );
                tbody.id = "data";      
                docs.ac( table, tbody );

                var { begin, end } = range( params.value );

                for ( let day = begin, index = 0; day <= end; day += step, index++ )
                {
                    let current = new Date( day );

                    // add day column headers
                    if ( index < 7 )
                    {
                        if ( !( index % 7 ) )
                        {
                            th = docs.ce( "tr" );
                            docs.ac( thead, th );
                        }

                        let td = docs.ce( "td" );
                            td.classList.add( "column" );
                            td.innerText = dates.parse( current ).Day;
                        docs.ac( th, td );
                    }
                }

                calendar.initialized = true;
            }

            calendar.render( params.value );
            calendar.populate()
        };        

        function range( date )
        {
            var data = dates.parse( date );
            var begin = data.begin.getTime();
            var end = data.end.getTime();

            return { begin, end };
        }

        
        this.render = ( date ) =>
        {
            var { begin, end } = range( date );
            var selected = date;
            
            for ( let day = begin, index = 0; day <= end; day += step, index++ )
            {
                // add row
                if ( !( index % 7 ) )
                {
                    tr = docs.ce( "tr" );
                    docs.ac( tbody, tr );
                }

                let current = new Date( day );
                let css = current.getMonth() == selected.getMonth() ? "inside" : "outside";

                let value = dates.format( current );

                

                // add cell
                let td = docs.ce( "td" );
                    td.classList.add( "day" );
                    td.classList.add( css );
                if ( dates.equals( current, today ) )
                    td.classList.add( "today" );
                if ( dates.equals( current, selected ) )
                    td.classList.add( "current" );
                    td.innerText = current.getDate();
                    td.dataset.date = value;
                    td.dataset.day = dates.parse( current ).Day;
                    td.dataset.month = dates.parse( current ).Month;
                    listeners( td, params, value );

                docs.ac( tr, td );
            }
        };

        this.parent = function() { return params.element };

        this.populate = function()
        {
            if ( this.data )
            {
                this.data.forEach( doc =>
                {
                    var id = Object.keys( doc );
                    var value = doc[ id ];
                    var td = tbody.querySelector( `[ data-date = "${ value.date }" ]` );
                    var div = docs.ce( "div" );
                        div.dataset.id = id;
                        div.innerText = value[ params.field ];
                        div.classList.add( "event" );
                        div.style.backgroundColor = value.color;
                        div.addEventListener( "click", ( e ) => calendar.on.select( e, doc ), false );

                    if ( td )
                        docs.ac( td, div );
                } );
            }
        };

        init();
    };

    this.Checkboxes = function( params )
    {
        var { label, div, wrapper } = block( params );

        this.populate = function()
        {   
            if ( this.data )
            {
                label.innerText = this.data.name

                var array = normalize( this.data.values, params );
                    array.forEach( ( value, i ) =>
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

                        listeners( input, params );

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

    this.Color = function( params )
    {   
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";

        var input = docs.ce( "input" );
            input.type = "hidden";
            for ( let att in params )
        if ( ![ "element", "headless", "listeners", "values" ].some( hidden => hidden == att ) )
            input.setAttribute( att, params[ att ] );

        listeners( input, params );

        var table = docs.ce( "table" );
            table.style.borderCollapse = "separate";

        var step = 15;

        var border = [ "1px solid transparent", "1px solid white" ];

        var over = ( e ) => e.target.style.border = border[ 1 ];
        var out = ( e ) => e.target.style.border = border[ 0 ];
        var reset = () => Array.from( table.querySelectorAll( "[ data-color ]" ) ).forEach( td => 
        { 
            td.style.border = border[ 0 ]; 
            td.addEventListener( "mouseout", out );
        } );

        for ( let l = 10; l <= 70; l += step )
        {
            let tr = docs.ce( "tr" );
            
            for ( let h = 0; h < 360; h += step * 2 )
            {
                let hsl = `hsl( ${ h }, 100%, ${ l }% )`;
                let b = 1 - ( input.value !== hsl );   
                let td = docs.ce( "td" );
                    td.dataset.color = hsl;
                    td.style.backgroundColor = hsl;
                    td.style.border = border[ b ];
                    td.style.height = "0.75em";
                    td.style.padding = 0;
                    td.style.width = "1em";
                    td.addEventListener( "mouseover", over );
                    td.addEventListener( "mouseout", out );
                    td.addEventListener( "click", () => 
                    {
                        reset();
                        input.value = td.dataset.color;
                        td.style.border = border[ 1 ];
                        td.removeEventListener( "mouseout", out );
                    } );

                docs.ac( tr, td );
            }

            docs.ac( table, tr );
        }

        docs.ac( div, table );
        docs.ac( div, input );

        return input;
    };

    this.Datalist = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = "\n";

        var input = docs.ce( "input" );      
            input.setAttribute( "value", params.value || "" );
        if ( params.required )
            input.setAttribute( "required", "" );
        if ( params.Form )
            input.setAttribute( "Form", params.Form );
        if ( params.placeholder )
            input.setAttribute( "placeholder", params.placeholder );
        
        docs.ac( div, input );

        listeners( input, params );

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
                
                var array = normalize( this.data.values, params );
                    array.forEach( ( value, i ) =>
                    {
                        var val;
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
                                        array.push( `${ value[ field ] }` );
                                        option.setAttribute( `data-${ field }`, value[ field ] );
                                    }
                                }
                                else
                                {
                                    val = value[ field ];
                                    option.setAttribute( `data-${ field }`, value[ field ] );
                                }
                            } );

                            text = array.join( " " );
                        }
                        else
                        {
                            val = value[ params.field ];
                            option.setAttribute( `data-${ params.field }`, value[ params.field ] );
                        }

                        option.value = val;
                        option.innerText = text;
                        docs.ac( datalist, option );
                    } ); 
            }
        };

        data.load.call( this, params );
    };

    this.Date = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";

        var input = docs.ce( "input" );
            input.type = "date";

        listeners( input, params );

        for ( let att in params )
            if ( ![ "element", "headless", "listeners" ].some( hidden => hidden == att ) )
                input.setAttribute( att, params[ att ] );

        input.setAttribute( "value", dates.format( params.value, "-" ) );
        input.setAttribute( "data-date", params.value );

        docs.ac( div, input );

        return input;
    };

    this.Drilldown = function( params )
    {   
        var div = docs.ce( "div" );
        docs.ac( params.element, div );
        
        this.populate = () => {};

        function change( e, params )
        {   
            var select = e.target;
            var value = select.options[ select.selectedIndex ].value;
            var selected = params.array.find( option => option[ params.field ] == value );

            if ( selected )
            {
                let options = selected[ select.dataset.name ];
                let child = document.querySelector( `[ form="${ select.form.id }" ][ name="${ select.dataset.name }" ]` );

                if ( child )
                {
                    child.innerHTML = null;

                    if ( options )
                        options.forEach( item =>
                        {
                            var option = docs.ce( "option" );
                                option.text = item[ select.dataset.field ];
                                option.value = item[ select.dataset.field ];
                            docs.ac( child, option );
                        } );
                }
            }
        }

        ( async () =>
        {
            var next;
            
            for ( let i = 0; i < params.config.length; i++ )
            {
                let config = params.config[ i ];
                    config.element = div;

                next = params.config[ i + 1 ];

                // get the data
                await data.load.call( this, config );

                // switch data to array from query
                config.array = this.data.values;
                delete config.query;

                // invoke the select widget
                let select = new widgets.Select( config );
                    select.element.addEventListener( "change", ( e ) => change( e, config ) );
                let selected = select.data.values.find( option => option[ config.field ] == config.value );

                // set next config
                if ( next )
                {
                    select.element.dataset.name = next.name;
                    select.element.dataset.field = next.field;

                    if ( selected )
                        next.array = selected[ next.name ];
                }
            }
        } )();
    };

    this.Input = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";

        var input = docs.ce( "input" );

        listeners( input, params );

        for ( let att in params )
            if ( ![ "element", "headless", "listeners", "values" ].some( hidden => hidden == att ) )
                input.setAttribute( att, params[ att ] );

        docs.ac( div, input );

        return input;
    };

    this.Matrix = function( params )
    {
        //var map = extract( params.values, [] );
        
        var scope = this;
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";

        var table = docs.ce( "table" );
        docs.ac( div, table );

        function change( e )
        {
            var input = e.target;
            var form = input.form;
            var forms = Array.from( form.parentNode.children );

            scope.update( forms );
        }

        this.update = function( forms )
        {   
            var object = params.values[ params.name ];

            if ( typeof object !== "object" )
                object = Object.assign( params.values, { [ params.name ]: {} } );

            forms.forEach( form =>
            {
                for ( let element of form.elements ) 
                {    
                    if ( object[ element.id ] )
                        Object.assign( object[ element.id ], { [ element.name ]: element.value } );
                    else if ( object[ params.name ] )
                        Object.assign( object[ params.name ], { [ element.id ]: { [ element.name ]: element.value } } );
                    else
                        Object.assign( params.values[ params.name ], { [ element.id ]: { [ element.name ]: element.value } } );    
                }
            } );
        }; 
        
        this.populate = function() 
        {     
            if ( this.data )
            {   
                // header row
                var tr = docs.ce( "tr" );
                docs.ac( table, tr );

                var td = docs.ce( "td" );
                docs.ac( tr, td );

                // add forms
                scope.data.docs.forEach( doc =>
                {
                    var id = Object.keys( doc )[ 0 ];
                    var form = docs.ce( "form" );
                        form.setAttribute( "method", "post" );
                        form.id = id;
                    docs.ac( td, form );
                } );

                var forms = Array.from( td.children );

                // column headers
                var columns = this.data.values;
                    columns.forEach( doc => 
                    {    
                        var td = docs.ce( "td" );
                            td.classList.add( "cell" );
                            td.innerText = doc[ params.field ];
                        docs.ac( tr, td );
                    } );

                // widget rows
                params.widgets.forEach( function( widget )
                {  
                    var tr = docs.ce( "tr" );
                    docs.ac( table, tr );
                    
                    // cell header
                    var td = docs.ce( "td" );
                        td.classList.add( "cell" );
                        td.innerText = widget.params.name;
                    docs.ac( tr, td );

                    // select data for each cell
                    scope.data.docs.forEach( async ( _doc ) => 
                    {
                        var id = _doc.getKey();
                        var doc = _doc[ id ];
                        var array = doc[ widget.params.name ] || [];

                        var td = docs.ce( "td" );
                            td.classList.add( "cell" );
                        docs.ac( tr, td );
                        
                        let config = { ...widget.params  };
                            config.element = td;
                            config.Form = id;
                            config.id = doc[ params.field ];
                            config.headless = true;
                            config.array = array;
                            config.listeners = [ { event: "change", handler: ( e ) => change( e ) } ];
                            config.value = params.values.getPath( [ params.name, doc[ params.field ], widget.params.name ] ).value;
 
                        new widgets[ widget.class ]( config ); 
                    } );
                } );

                scope.update( forms );
            }
        };

        data.load.call( scope, params );
    };

    this.Object = function( params )
    {
        var { label, div, wrapper } = block( params, "column" );
            label.innerText = params.name || "\n";

        div.classList.add( "object" );

        var values = data.default( params.values, params.name, {} );
  
        params.widgets.forEach( widget => 
        {
            var object = data.default( values[ params.name ], widget.params.name, "" );
            var value = object[ widget.params.name ]; 
            var config = { ...widget.params  };
                config.debug = true;
                config.element = div;
                config.object = params.name;
                config.value = value;
                config.values = values;

            new widgets[ widget.class ]( config );
        } );
    };
    
    this.Radio = function( params )
    {
        var { label, div, wrapper } = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                label.innerText = this.data.name
                
                var array = normalize( this.data.values, params );
                    array.forEach( ( value, i ) =>
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

                        listeners( input, params );

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
        var array = [];
        var input = docs.ce( "select" );
        docs.ac( div, input );

        listeners( input, params );

        this.element = input;

        this.populate = function()
        {   
            if ( this.data )
            {
                label.innerText = this.data.name

                // input 
                    input.name = this.data.name;
                    input.id = params.id ? params.id : this.data.name;
                    input.value = params.value;
                if ( params.Form )
                    input.setAttribute( "Form", params.Form );
                if ( params.required )
                    input.setAttribute( "required", params.required );
                
                // options
                array = normalize( this.data.values, params );
                array.forEach( ( value ) =>
                {             
                    let option = docs.ce( "option" );
                        option.text = value[ params.field ];
                        option.value = value[ params.field ];
                    if ( params.value && params.value == option.value )
                    { 
                        option.setAttribute( "selected", "");
                    }
                    docs.ac( input, option );
                } ); 

                this.data.values = array;   
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
            docs.ac( params.element, div );

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

    this.Text = function( params )
    {
        var { label, div, wrapper } = block( params );
            label.innerText = params.name || "\n";
            div.classList.remove( "input" );
            div.classList.add( "quill" );

        var container = docs.ce( "div" );
        docs.ac( div, container );

        var value = params.value || "";
        
        var input = docs.ce( "input" );
            input.setAttribute( "Form", params.Form );
            input.name = params.name;
            input.value = value;
            input.type = "hidden";
        docs.ac( div, input );

        listeners( input, params );

        var config = 
        {
            modules:
            {
                toolbar: [ 
                    [ 'bold', 'italic', 'underline', 'strike' ],
                    [ { 'list': 'ordered'}, { 'list': 'bullet' } ], 
                    [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
                    [ { 'color': [] }, { 'background': [] } ],
                    [ { 'font': [] } ],
                    [ { 'align': [] } ],
                    [ 'clean' ] 
                ],           
            },
            theme: "snow"
        };
        
        var editor = new Quill( container, config );
            editor.setHTML = ( html ) => editor.root.innerHTML = html;
            editor.getHTML = () => editor.root.innerHTML;
            editor.on( "text-change", () => 
            { 
                var value = editor.getHTML();

                params.value = value;
                input.value = value;
            } );
            editor.setHTML( value );
    };

    this.Toolbar = function( params )
    {
        var toolbar = docs.ce( "div" );
            toolbar.classList.add( "flex" );
            toolbar.classList.add( "right" );
        docs.ac( params.element, toolbar );
        
        params.controls.forEach( control =>
        {
            var button = new widgets.Input( { type: "image", src: `/images/${ control.title }.png`, title: control.title, element: toolbar, width: 32, height: 32, headless: true } );
                button.classList.add( "noprint" );
            if ( control.event && control.handler )
                button.addEventListener( control.event, control.handler, false );
            if ( control.Form )
                button.setAttribute( "Form", control.Form );
            if ( control.hasOwnProperty( "visible" ) && !control.visible )
                button.style.display = "none";
        } );   
    };

    this.Tuple = function( params )
    {
        params.element.classList.add( "object" );
        
        var config = 
        {
            id: params.values.getKey(),
            values: params.values,
            element: params.element,
            name: params.name,
            tuple: true,
            widgets:
            [
                { class: "Input", params: { type: "text", name: "name", required: true, object: params.name } },
                { class: "Input", params: { type: "text", name: "value", object: params.name } }
            ]
        };

        new widgets.Array( config );
    };
};

export default Widgets;