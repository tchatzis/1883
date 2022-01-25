import doc from "./doc.js";
import Widgets from "./widgets.js";
import parse from "./forms.js";

var Templates = function()
{
    var scope = this;
    var widgets = new Widgets();
    var delay = 1000;

    // open add form
    function add()
    {   
        var target = document.querySelector( "tbody" );
            doc.clear( target, "active" );
        
        var args = view( { display: "insert" } );

        templates[ args.display ]( args );
    }

    function filter( data, key, value )
    {
        var result = [];
        
        [ ...data ].map( row => Object.values( row ).find( data => 
        {
            if ( !value || data[ key ] == value )
                result.push( row );        
        } ) );

        return result;
    }

    // insert inline data into other collection
    function grow( el, params, data )
    {
        var field = params.field;
        var value = { [ field ]: el.value };
        var existing = data.values.findIndex( value => value[ field ] == el.value ) > -1;

        console.warn( existing, field, value );
        
        if ( !existing )
        {
            let params = {};
                params.action = "insert";
                params.url = `/db/${ data.name }/${ params.action }`;
                params.body = value;

            scope.grow( params );
        }
    }

    function insert( e, params )
    {
        e.preventDefault();

        params.url = `/db/${ scope.from }/${ params.action }`;
        params.body = parse( e );
        params.display = "tbody";
        params.target = document.getElementById( "data" );
        
        scope.insert( params );
    }

    function remove( e, params )
    {
        e.preventDefault();
        
        const id = Object.keys( params.data );
        
        params.url = `/db/${ scope.from }/delete/${ id }`;
        params.action = "delete";
        params.display = "tbody";

        scope.delete( params );
    }

    function select( e, data )
    {
        var target = doc.bubble( e.target, "tr" );
            doc.clear( target, "active" );
            target.classList.add( "active" );

        var params = Object.assign( view( { display: "update" } ),
        {
            data: data,
            target: target
        } );

        templates[ params.display ]( params );
    }

    function transition( el, cls, callback )
    {
        el.classList.remove( "active" );
        el.classList.add( cls );

        setTimeout( callback, delay );
    }

    function update( e, params )
    {
        e.preventDefault();

        if ( params.data )
        {
            const id = Object.keys( params.data );

            params.url = `/db/${ scope.from }/${ params.action }/${ id }`;
            params.body = parse( e );
            params.display = "tbody";

            scope.update( params );
        }
    }

    function tab( el, params, filter )
    {
        doc.clear( el, "active" );
        el.classList.add( "active" );
        scope.filter = filter;
        
        params.display = "tbody";
        params.target = document.getElementById( "data" );
 
        templates[ params.display ]( params );
    }

    function text( field )
    {
        var text = Array.isArray( field ) ? ( typeof field[ 0 ] == "object" ) ? field.length : field : field;
            text = text == undefined ? "" : text;
        
        return text;
    }

    function view( params )
    {   
        var modes = 
        {
            table: { element: document.getElementById( "content" ), action: "select", display: params.display },
            delete: { element: document.getElementById( "content" ), action: "delete", display: params.display },
            insert: { element: document.getElementById( "sub" ),    action: "insert", display: scope.sub },
            update: { element: document.getElementById( "sub" ),    action: "update", display: scope.sub }
        };

        return modes[ params.display ];
    };

    const templates =
    {
        _insert: ( params ) =>
        {
            params.element.innerHTML = null;

            var id = scope.from;
            var data = {};
            scope.fields.forEach( field => data[ field ] = "" );

            var div = doc.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            doc.ac( params.element, div );

            var back = new widgets.Input( { type: "image", src: "/images/back.png", title: "Back", element: div, width: 32, height: 32 } );
                back.addEventListener( "click", ( e ) => { params.element.innerHTML = null }, false );
                back.classList.add( "right" );

            var form = doc.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => insert( e, params ), false );
            doc.ac( div, form );

            return { id, data, div };
        },
        _update: ( params ) =>
        {
            params.element.innerHTML = null;

            var id = Object.keys( params.data )[ 0 ];
            var data = params.data[ id ];

            var div = doc.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            doc.ac( params.element, div );

            var button = new widgets.Input( { type: "image", Form: id, src: "/images/delete.jpg", title: "Delete", element: div, width: 36, height: 36 } );
                button.addEventListener( "click", ( e ) => remove( e, params ), false );
                button.classList.add( "right" );

            var form = doc.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => update( e, params ), false );
                form.id = id;
            doc.ac( div, form );

            return { id, data, div };
        },
        item: ( params ) =>
        {
            var { id, data, div } = templates[ `_${ params.action }` ]( params );
            var config = 
            {
                id: id,
                data: data,
                element: div,
                name: "item",
                widgets:
                [
                    { class: "Datalist", params: { query: `select * from stock`, sort: "label", action: "select", name: "stock", field: "label", listeners: [ { event: "blur", handler: grow } ] } },
                    { class: "Input", params: { type: "number", name: "quantity", size: "2", required: true, min: 0 } },
                    { class: "Datalist", params: { query: `select * from plating`, sort: "sequence", action: "select", name: "plating", field: "label", required: true, listeners: [ { event: "blur", handler: grow } ] } },
                    { class: "Input", params: { type: "text", name: "notes" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: data[ "label" ], element: div } );
            new widgets.Datalist( { query: `select * from group`, sort: "sequence", action: "select", element: div, Form: id, name: "group", field: "label", value: data[ "group" ], listeners: [ { event: "blur", handler: grow } ] } );
            new widgets.Array( config );
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        sequence: ( params ) =>
        {
            var { id, data, div } = templates[ `_${ params.action }` ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: data[ "label" ], element: div } );
            new widgets.Input( { type: "number", Form: id, name: "sequence", required: true, value: data[ "sequence" ] || scope.data.length + 1, element: div, size: 2 } );
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        stock: ( params ) => 
        { 
            var { id, data, div } = templates[ `_${ params.action }` ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: data[ "label" ], element: div } );
            new widgets.Input( { type: "input", Form: id, name: "description", value: data[ "description" ], element: div } );
            new widgets.Datalist( { query: `select * from group`, sort: "sequence", action: "select", element: div, Form: id, name: "group", field: "label", value: data[ "group" ], listeners: [ { event: "blur", handler: grow } ] } );
            new widgets.Checkboxes( { query: `select * from allergen`, sort: "sequence", action: "select", element: div, Form: id, name: "allergen", field: "label", value: data[ "allergen" ] } );
            new widgets.Input( { type: "input", Form: id, name: "size", value: data[ "size" ], element: div } );
            new widgets.Input( { type: "number", Form: id, name: "order number", value: data[ "order number" ], element: div, pattern: "[0-9]{7}", maxlength: 7, size: 7, title: "Must be 7 digits", min: 0 } );
            new widgets.Select( { path: `/kitchens/erwin/storage`, action: "select", Form: id, element: div, required: true, value: data[ "storage" ] } );
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        tabs: function( params )
        {
            if ( params.tab )
            {        
                var tabs = doc.ce( "div" );
                    tabs.innerHTML = null;
                doc.ac( params.element, tabs );

                new widgets.Tabs( { tab: scope.tab, data: scope.data, listeners: [ { event: "click", handler: tab } ], element: tabs } );

                return tabs;
            }
        }, 
        thead: function( params )
        {  
            var button = new widgets.Input( { type: "image", src: "/images/add.png", title: "Add", element: params.element, width: 36, height: 36 } );
                button.addEventListener( "click", ( e ) => add( e ), false );

            var table = doc.ce( "table" );
            doc.ac( params.element, table );

            var thead = doc.ce( "thead" );
            doc.ac( table, thead );

            // column headings
            var tr = doc.ce( "tr" );
            scope.fields.forEach( field =>
                {
                    let td = doc.ce( "td" );
                        td.classList.add( "column" );
                        td.innerText = field;
        
                    doc.ac( tr, td );
                } );
            doc.ac( thead, tr );

            var tbody = doc.ce( "tbody" );
                tbody.id = "data";
            doc.ac( table, tbody );

            return tbody;
        },
        tbody: function( params )
        {   
            // data rows
            var tbody = document.getElementById( "data" );
                tbody.innerHTML = null;

            filter( scope.data, scope.tab, scope.filter ).forEach( data =>
            {       
                let id = Object.keys( data );

                let tr = doc.ce( "tr" );
                    tr.addEventListener( "click", ( e ) => select( e, data ), false );
                    tr.classList.add( "row" );
    
                scope.fields.forEach( field =>
                {   
                    let td = doc.ce( "td" );
                        td.dataset.field = field;
                        td.classList.add( "cell" );
                        td.innerText = text( data[ id ][ field ] );
        
                    doc.ac( tr, td );
                } );
    
                doc.ac( tbody, tr );
            } );

            return tbody;
        },
        table: function( params )
        {
            templates.tabs( params );
            templates.thead( params );
            templates.tbody( params );
        }
    };

    this.change = function( params, result )
    {
        var id = Object.keys( result.data[ 0 ] );

        var changes = {};
            changes.delete = () =>
            {
                var callback = () => params.target.remove();

                params.element.innerHTML = null;

                scope.data.forEach( row =>
                {   
                    if( row == params.data )
                        Array.from( params.target.children ).forEach( child => child.innerText = "\n" );
                } );

                transition( params.target, params.action, callback );
            },
            changes.insert = () =>
            {
                var callback = () => el.classList.remove( params.action );
                var el;

                params.target.innerHTML = null;
                params.element.innerHTML = null;

                templates[ params.display ]( params );

                scope.data.forEach( ( row, r ) =>
                {
                    if ( row.hasOwnProperty( id ) )
                    {
                        el = params.target.children[ r ];
                    }
                } );

                transition( el, params.action, callback );
            },
            changes.update = () => 
            {
                var callback = () => 
                {
                    params.target.classList.remove( params.action );
                    templates[ params.display ]( params );
                };

                params.element.innerHTML = null;

                scope.data.forEach( row =>
                {
                    var id = Object.keys( result.data[ 0 ] )
                    var data = result.data[ 0 ][ id ];
                    
                    if( row == params.data )
                        Array.from( params.target.children ).forEach( child => child.innerText = data[ child.dataset.field ] );
                } );

                transition( params.target, params.action, callback );
            };

            changes[ params.action ]();
    };

    this.init = function( params )
    {
        scope = Object.assign( scope, this );

        scope.sub = params.sub || scope.from;
        scope.mode = Object.assign( view( params ), params );

        templates[ scope.mode.display ]( scope.mode );
    };
};

export default Templates;