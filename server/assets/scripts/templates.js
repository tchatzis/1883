import Data from "./data.js";
import docs from "./docs.js";
import Widgets from "./widgets.js";
import parse from "./forms.js";

var Templates = function()
{
    var scope = this;
    var data = new Data();
    var widgets = new Widgets( data ); 
    var delay = 3000;

    function Schema( schema )
    {
        Object.assign( this, schema );

        this.get = ( parent, action ) =>
        {
            this.existing = data.store.hasOwnProperty( scope.collection );
            this.parent = parent;
            this.url = `${ schema.path }/${ action }`;
            
            return Object.assign( this, { action: action } );
        };
    }

    function View()
    {
        Object.defineProperty( this, "_clear", { value: function( name )
        {
            var element = this._el( name );
                element.innerHTML = null;
        } } );
        
        Object.defineProperty( this, "_el", { value: function( name )
        {
            return document.getElementById( name );
        } } );

        Object.defineProperty( this, "_get", { value: function( name )
        {
            return this[ name ];
        } } );

        Object.defineProperty( this, "_parent", { value: function( element )
        {  
            this[ element.id ].parent = element;
        } } );

        Object.defineProperty( this, "_populate", { value: async function( parent, callback )
        {   
            var schema = data.schema[ scope.collection ].get( parent, "select" );

            if ( !schema.existing )
                await data.select( schema );

            callback();
        } } ); 

        this.init = function( params )
        {
            scope.collection = params.path.split( "/" )[ params.path.split.length ];
            
            this[ "columns" ] = 
            {
                display: "columns",
                parent: document.getElementById( "columns" )
            };
            
            this[ "content" ] = 
            {
                collection: scope.collection,
                display: params.content,
                parent: document.getElementById( "content" )
            };

            this[ "data" ] = 
            {
                display: "tbody",
                parent: document.getElementById( "data" ),
            };

            this[ "sub" ] = 
            {
                display: params.sub,
                parent: document.getElementById( "sub" )
            };

            this[ "tabs" ] = 
            {
                display: "tabs",
                parent: document.getElementById( "tabs" ),
            };

            data.schema[ scope.collection ] = new Schema( { collection: scope.collection, path: params.path, sort: params.sort, filter: { name: params.tab, value: null } } );

            templates._exec( this[ "content" ] ); 
        };
    }

    const tx = 
    {
        delete: async function( e, params )
        {
            e.preventDefault();
            
            const id = Object.keys( params.doc );
            const previous = scope.view._get( "data" );
    
            let schema = { ...data.schema[ scope.collection ] };
                schema.action = "delete";
                schema.doc = null;
                schema.url = `${ schema.path }/${ schema.action }/${ id }`;
    
            await data.delete( schema );
            scope.view._clear( params.parent.id );
            await templates[ previous.display ]( previous );
            
            let tbody = scope.view._get( "data" );
                tbody.action = schema.action;
                tbody.child = tbody.parent.querySelector( `tr[ data-id = "${ id }" ]` )
                tbody.doc = params.doc;
            templates._change( tbody );
        },

        grow: function( el, params, object )
        {
            var collection = params.name;
            var datalist = el.list;
            var option = datalist.querySelector( `[ value = "${ params.value }" ]` );
            var existing = Array.isArray( params.field ) ? match() : object.values.findIndex( value => value[ params.field ] == el.value ) > -1;
            var doc = {};

            function match()
            {
                if ( !option )
                    return false;
                
                return params.field.every( field => params.value.includes( option.dataset[ field ] ) );
            }

            if ( !existing && el.value )
            {
                let fields = data.fields[ collection ];
                    fields.forEach( field => doc[ field ] = "" );
                    doc[ params.field[ 0 ] ] = params.value;

                let schema = { ...data.schema[ scope.collection ] };
                    schema.action = "insert";
                    schema.collection = collection;
                    schema.doc = doc;
                    schema.existing = data.schema.hasOwnProperty( collection );
                    schema.path = `/db/${ collection }`;
                    schema.url = `${ schema.path }/${ schema.action }`;

                    data.grow( schema );
            }
        },
        
        insert: async function insert( e, params )
        {
            e.preventDefault();
            
            const id = Object.keys( params.doc );
            const values = parse( e );
            const previous = scope.view._get( "data" );
    
            let schema = { ...data.schema[ scope.collection ] };
                schema.action = "insert";
                schema.doc = Object.assign( params.doc[ id ], values );
                schema.url = `${ schema.path }/${ schema.action }`;
    
            await data.insert( schema );
            scope.view._clear( params.parent.id );
            await templates[ previous.display ]( previous );
    
            let tbody = scope.view._get( "data" );
                tbody.action = schema.action;
                tbody.child = tbody.parent.querySelector( `tr[ data-id = "${ data.id }" ]` );
                tbody.doc = params.doc;
            templates._change( tbody );
        },

        login: async function( e, params )
        {
            e.preventDefault();

            const values = parse( e );

            let schema = { ...data.schema[ scope.collection ] };
                schema.query = `select * from ${ scope.collection } where email = ${ values.email } and password = ${ values.password }`;
                schema.url = "/query";

            await data.query( schema );

            if ( data.store[ scope.collection ].length )
            {
                docs.cookie.write( "auth", Object.keys( data.store[ scope.collection ][ 0 ] ) );
                window.location.href = "/";
            }
            else
                e.target.reset();
        },

        post: ( e, params ) => 
        {
            e.preventDefault();

            

            console.log( e, params, values );
        },

        select: function( e, doc )
        {
            var tbody = scope.view._get( "data" );
                tbody.action = "select";
                tbody.child = docs.bubble( e.target, "tr" );
                tbody.doc = doc;
            templates._change( tbody );
    
            var sub = scope.view._get( "sub" );
                sub.action = "update";
                sub.display = sub.display || scope.collection;
                sub.doc = doc;
            templates._exec( sub )
        },

        update: async function( e, params )
        {
            e.preventDefault();
    
            if ( params.doc )
            {
                const id = Object.keys( params.doc );
                const values = parse( e );
                const previous = scope.view._get( "data" );
                
                let schema = { ...data.schema[ scope.collection ] };
                    schema.action = "update";
                    schema.doc = Object.assign( params.doc[ id ], values );
                    schema.url = `${ schema.path }/${ schema.action }/${ id }`;
    
                await data.update( schema );
                scope.view._clear( params.parent.id );
                await templates[ previous.display ]( previous );
                
                let tbody = scope.view._get( "data" );
                    tbody.action = schema.action;
                    tbody.child = tbody.parent.querySelector( `tr[ data-id = "${ id }" ]` );
                    tbody.doc = params.doc;
                templates._change( tbody );
            }
        }
    };

    const ui =
    {
        add: function()
        {   
            var sub = scope.view._get( "sub" );
                sub.action = "insert";
                sub.display = scope.collection;
                sub.doc = {};
            templates._exec( sub )
        },

        tab: function( el, params, value )
        {
            data.schema[ scope.collection ].filter.value = value;
            
            var tabs = scope.view._get( "tabs" );
                tabs.action = "tab";
                tabs.child = el;
            templates._change( tabs );

            var tbody = scope.view._get( "data" );
            templates._exec( tbody );
        },

        text: function( field )
        {
            var text = Array.isArray( field ) ? ( typeof field[ 0 ] == "object" ) ? field.length : field : field;
                text = text == undefined ? "" : text;
            
            return text;
        },

        transition: function( el, cls, callback )
        {
            el.classList.remove( "active" );
            el.classList.add( cls );
    
            setTimeout( callback, delay );
        }
    };

    const templates =
    {
        _change: ( params ) =>
        {   
            var changes = {};
                changes.delete = () =>
                {
                    var callback = () => params.child.remove();

                    data.store[ scope.collection ].forEach( row =>
                    {   
                        if( row == params.doc )
                        {
                            Array.from( params.child.children ).forEach( child => child.innerText = "\n" );
                            data.remove( params.doc );
                        }
                    } );

                    ui.transition( params.child, params.action, callback );
                },
                changes.insert = () =>
                {   
                    var callback = () => 
                    {
                        data.store[ scope.collection ].forEach( row =>
                        {
                            var id = Object.keys( params.doc )
                            var values = params.doc[ id ];

                            docs.clear( params.child, params.action );
                        } );
                        
                        params.child.classList.remove( params.action );
                    };

                    console.log( params );
                    
                    if ( params.child )
                    {
                        params.child.classList.add( params.action );

                        ui.transition( params.child, params.action, callback );
                    }
                };    
                changes.select = () =>
                {   
                    docs.clear( params.child, params.action );
                    params.child.classList.add( params.action );
                };
                changes.tab = () =>
                {   
                    scope.view._clear( "sub" );

                    docs.clear( params.child, "active" );
                    params.child.classList.add( "active" );
                };
                changes.update = () => 
                {   
                    var callback = () => 
                    {
                        params.child.classList.remove( params.action );
                    };

                    var id = Object.keys( params.doc );
                    var values = params.doc[ id ];

                    if ( params.child )
                    {
                        Array.from( params.child.children ).forEach( child => child.innerText = ui.text( values[ child.dataset.field ] ) );

                        ui.transition( params.child, params.action, callback );
                    }
                };
                
            changes[ params.action ]();
        },
        _exec: ( params ) => 
        {
            templates[ params.display ]( params );
        },
        // includes
        _login: ( params ) =>
        {
            scope.view._clear( params.parent.id );

            var id = "login";
            var values = {};
            var div = params.parent;

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => tx.login( e, params ), false );
                form.id = id;
            docs.ac( div, form );

            return { id, values, div };
        },
        _insert: ( params ) =>
        {
            scope.view._clear( params.parent.id );

            var id = scope.collection;
            var values = {};

            data.fields[ scope.collection ].forEach( field => values[ field ] = "" );

            var div = docs.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            docs.ac( params.parent, div );

            var back = new widgets.Input( { type: "image", src: "/images/back.png", title: "Back", element: div, width: 32, height: 32 } );
                back.addEventListener( "click", () => scope.view._clear( parent.id ), false );
                back.classList.add( "right" );

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => tx.insert( e, params ), false );
                form.id = id;
            docs.ac( div, form );

            return { id, values, div };
        },
        _update: ( params ) =>
        {   
            scope.view._clear( params.parent.id );

            var id = Object.keys( params.doc )[ 0 ];
            var values = params.doc[ id ];

            var div = docs.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            docs.ac( params.parent, div );

            var button = new widgets.Input( { type: "image", Form: id, src: "/images/delete.jpg", title: "Delete", element: div, width: 36, height: 36 } );
                button.addEventListener( "click", ( e ) => tx.delete( e, params ), false );
                button.classList.add( "right" );

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => tx.update( e, params ), false );
                form.id = id;
            docs.ac( div, form );

            return { id, values, div };
        },
        // elements
        item: ( params ) =>
        {  
            var { id, values, div } = templates[ `_${ params.action }` ]( params );
            var config = 
            {
                id: id,
                values: values,
                element: div,
                name: "item",
                widgets:
                [
                    { class: "Datalist", params: { query: `select * from stock`, sort: "label", action: "select", name: "stock", field: [ "label", "description" ], listeners: [ { event: "dblclick", handler: tx.grow } ] } },
                    { class: "Input", params: { type: "number", name: "quantity", size: "2", required: true, min: 0 } },
                    { class: "Datalist", params: { query: `select * from plating`, sort: "sequence", action: "select", name: "plating", field: "label", required: true, listeners: [ { event: "dblclick", handler: tx.grow } ] } },
                    { class: "Input", params: { type: "text", name: "notes" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], element: div } );
            new widgets.Datalist( { query: `select * from group`, sort: "sequence", action: "select", element: div, Form: id, name: "group", field: "label", value: values[ "group" ], listeners: [ { event: "dblclick", handler: tx.grow } ] } );
            var array = new widgets.Array( config );
            params.doc[ id ] = array.values;
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        login: ( params ) =>
        {
            params.action = "login";

            var { id, values, div } = templates[ `_${ params.action }` ]( params );

            new widgets.Input( { type: "email", Form: id, name: "email", required: true, value: "tito.chatzis@gmail.com", element: div } );
            new widgets.Input( { type: "password", Form: id, name: "password", required: true, value: "x", element: div } );
            new widgets.Input( { type: "image", Form: id, src: "/images/login.png", title: "Log In", element: div, width: 48 } );
        },
        sequence: ( params ) =>
        {
            
            console.error( params )
            var { id, values, div } = templates[ `_${ params.action }` ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], element: div } );
            new widgets.Input( { type: "number", Form: id, name: "sequence", required: true, value: values[ "sequence" ] || data.store[ scope.collection ].length + 1, element: div, size: 2 } );
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        stock: ( params ) => 
        { 
            var { id, values, div } = templates[ `_${ params.action }` ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], element: div } );
            new widgets.Input( { type: "input", Form: id, name: "description", value: values[ "description" ], element: div } );
            new widgets.Datalist( { query: `select * from group`, sort: "sequence", action: "select", element: div, Form: id, name: "group", field: "label", value: values[ "group" ], listeners: [ { event: "dblclick", handler: tx.grow } ] } );
            new widgets.Checkboxes( { query: `select * from allergen`, sort: "sequence", action: "select", element: div, Form: id, name: "allergen", field: "label", value: values[ "allergen" ] } );
            new widgets.Input( { type: "input", Form: id, name: "size", value: values[ "size" ], element: div } );
            new widgets.Input( { type: "number", Form: id, name: "order number", value: values[ "order number" ], element: div, pattern: "[0-9]{7}", maxlength: 7, size: 7, title: "Must be 7 digits", min: 0 } );
            new widgets.Select( { query: `select storage from kitchen where label = erwin`, name: "storage", action: "select", Form: id, element: div, required: true, value: values[ "storage" ] } );
            new widgets.Input( { type: "image", Form: id, src: "/images/save.jpg", title: "Save", element: div, width: 48 } );
        },
        tabs: async function( params )
        {
            var field = data.schema[ scope.collection ].filter.name;

            var tabs = docs.ce( "div" );
                tabs.id = "tabs";
                scope.view._parent( tabs );
                docs.ac( params.parent, tabs );

            scope.view._clear( tabs.id );

            await scope.view._populate( tabs, () =>
            {
                new widgets.Tabs( { field: field, values: data.store[ scope.collection ], listeners: [ { event: "click", handler: ui.tab } ], parent: tabs } );
            } );

            return tabs;
        }, 
        thead: async function( params )
        {  
            var button = new widgets.Input( { type: "image", src: "/images/add.png", title: "Add", element: params.parent, width: 36, height: 36 } );
                button.addEventListener( "click", ( e ) => ui.add( e ), false );

            var table = docs.ce( "table" );
            docs.ac( params.parent, table );

            var thead = docs.ce( "thead" );
            docs.ac( table, thead );

            // column headings
            var tr = docs.ce( "tr" );
                tr.id = "columns";
            scope.view._parent( tr );
            docs.ac( thead, tr );

            // populate headings
            scope.view._clear( tr.id );

            await scope.view._populate( tr, () =>
                data.fields[ scope.collection ].forEach( field =>
                {
                    let td = docs.ce( "td" );
                        td.classList.add( "column" );
                        td.innerText = field;
        
                    docs.ac( tr, td );
                } )
            );

            var tbody = docs.ce( "tbody" );
                tbody.id = "data";
            scope.view._parent( tbody );
            docs.ac( table, tbody );

            return tbody;
        },
        tbody: async function()
        {   
            // data rows
            var tbody = scope.view._el( "data" );
            var filter = data.schema[ scope.collection ].filter;

            scope.view._clear( tbody.id );

            await scope.view._populate( tbody, () => 
                data.filter( data.store[ scope.collection ], filter ).forEach( row =>
                {       
                    let id = Object.keys( row );
    
                    let tr = docs.ce( "tr" );
                        tr.dataset.id = id;
                        tr.addEventListener( "click", ( e ) => tx.select( e, row ), false );
                        tr.classList.add( "row" );
        
                    data.fields[ scope.collection ].forEach( field =>
                    {   
                        let td = docs.ce( "td" );
                            td.dataset.field = field;
                            td.classList.add( "cell" );
                            td.innerText = ui.text( row[ id ][ field ] );
            
                        docs.ac( tr, td );
                    } );
        
                    docs.ac( tbody, tr );
                } )  
            );

            return tbody;
        },
        table: async function( params )
        {
            await templates.tabs( params );
            await templates.thead( params );
            await templates.tbody();
        }
    };

    this.init = function( params )
    { 
        scope.view = new View();
        scope.view.init( params ); 
    };
};

export default Templates;