import dates from "./dates.js";
import Data from "./data.js";
import DND from "./dnd.js";
import docs from "./docs.js";
import Widgets from "./widgets.js";
import parse from "./forms.js";
import objects from "./objects.js";

const Content = function()
{
    var scope = this;
    var data = new Data();
    var dnd = new DND();
    var widgets = new Widgets( data ); 
    var delay = 3000;
    var message = document.getElementById( "message" );

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
        var view = this;
        
        Object.defineProperty( this, "clear", { value: function( element )
        {
            element.innerHTML = null;
        } } );
        
        Object.defineProperty( this, "el", { value: function( name )
        {
            return document.getElementById( name );
        } } );

        Object.defineProperty( this, "get", { value: function( name )
        {
            return view[ name ];
        } } );

        Object.defineProperty( this, "parent", { value: function( element )
        {  
            view[ element.id ].parent = element;
        } } );

        Object.defineProperty( this, "populate", { value: async function( parent, callback )
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

            dom.exec( this[ "content" ] ); 
        };
    }

    // DOM change handlers
    const dom = 
    {
        change: ( params ) =>
        {   
            var actions = {};
                actions.date = () =>
                {
                    var id = params.doc.getKey();
                    var values = params.doc.getValue();
                    var date = values.date;
                    
                    params.title = `${ dates.parse( date ).Month } ${ scope.title }`;

                    if ( !dates.equals( date, scope.date ) )
                    {
                        let tbody = docs.bubble( params.child, "tbody" );
                        let trs = Array.from( tbody.children );
                            trs.forEach( tr => Array.from( tr.children ).forEach( td => td.classList.remove( "current" ) ) );
                    }

                    params.child.classList.add( "current" );

                    if ( !dates.equals( date, scope.date, [ "month" ] ) )
                    {
                        let table = document.querySelector( "#calendar" );
                            table.innerHTML = null;

                        scope.date = date;

                        params.parent = scope.calendar.parent();
                        
                        dom.exec( params );  
                    }

                    actions.title();
                    scope.date = date;
                },
                actions.delete = () =>
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

                    dom.transition( params.child, params.action, callback );
                },
                actions.insert = () =>
                {   
                    var callback = () => 
                    {
                        data.store[ scope.collection ].forEach( row =>
                        {
                            docs.clear( params.child, params.action );
                        } );
                        
                        params.child.classList.remove( params.action );
                    };
                    
                    if ( params.child )
                    {
                        params.child.classList.add( params.action );

                        dom.transition( params.child, params.action, callback );
                    }
                };    
                actions.select = () =>
                {   
                    docs.clear( params.child, params.action );
                    params.child.classList.add( params.action );
                };
                actions.tab = () =>
                {   
                    scope.view.clear( document.getElementById( "sub" ) );

                    docs.clear( params.child, "active" );
                    params.child.classList.add( "active" );
                };
                actions.title = () =>
                {
                    var h1 = document.getElementsByTagName( "h1" )[ 0 ];
                        h1.innerText = params.title;

                    document.title = params.title;
                };
                actions.update = () => 
                {   
                    var callback = () => 
                    {
                        params.child.classList.remove( params.action );
                    };

                    if ( params.child )
                    {
                        Array.from( params.child.children ).forEach( child => child.innerText = ui.text( params.doc[ child.dataset.field ] ) );

                        dom.transition( params.child, params.action, callback );
                    }
                };
                
                actions[ params.action ]();
        },
        exec: ( params ) => 
        {
            templates[ params.display ]( params );
        },
        transition: function( el, cls, callback )
        {
            el.classList.remove( "active" );
            el.classList.add( cls );
    
            setTimeout( callback, delay );
        }
    };

    // form header
    const includes = 
    {
        insert: ( params ) =>
        {
            scope.view.clear( params.parent );

            var id = scope.collection;
            var values = params.doc.getChild( "doc", id, {} );

            data.fields[ scope.collection ].forEach( field => values[ field ] = "" );

            var div = docs.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            docs.ac( params.parent, div );

            new widgets.Toolbar( { parent: div, controls:
            [
                { title: "back", event: "click", handler: () => scope.view.clear( params.parent ) },
                { title: "save", Form: id }
            ] } );

            var form = docs.ce( "form" ); 
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => events.insert( e, params ), false );
                form.id = id;
            docs.ac( div, form );

            return { id, values, div };
        },
        update: function ( parameters )
        {   
            scope.view.clear( parameters.parent );
            
            this.id = parameters.doc.getKey();
            this.data = parameters.doc.getValue();
            
            this.container = docs.ce( "div" );
            this.container.classList.add( "content" );
            this.container.classList.add( "noprint" );
            docs.ac( parameters.parent, this.container );

            new widgets.Toolbar( { parent: this.container, controls:
            [
                { title: "back", event: "click", handler: () => scope.view.clear( parameters.parent ) },
                { title: "save", Form: this.id },
                { title: "checklist", event: "click", handler: ( e ) => events.checklist( e, params ), visible: parameters.display == scope.collection },
                { title: "delete", event: "click", handler: ( e ) => events.delete( e, parameters ) },
            ] } );

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => events.update( e, parameters ), false );
                form.id = this.id;
            docs.ac( this.container, form );
        },
        view: ( params ) =>
        {   
            scope.view.clear( params.parent );

            var id = params.doc.getKey();
            var values = params.doc.getValue();
            var div = params.parent;

            return { id, values, div };
        }
    };

    // event handlers
    const events = 
    {
        add: function( e )
        {   
            e.preventDefault();
            
            var sub = scope.view.get( "sub" );
                sub.action = "insert";
                sub.display = scope.collection;
                sub.doc = {};
            dom.exec( sub )
        },
        
        checklist: function( e, params )
        {
            e.preventDefault();
    
            var sub = scope.view.get( "sub" );
                sub.action = "view";
                sub.display = "checklist";
                sub.doc = params.doc;
            dom.exec( sub );
        },

        date: function( e, params )
        {
            e.preventDefault();
            
            var el = e.target;
            var id = params.doc.getKey();
            var cell = {};
                cell.action = "date";
                cell.child = el;
                cell.display = params.display;
                cell.doc = params.doc;
                cell.doc[ id ].date = new Date( el.dataset.date );

            dom.change( cell );
        },
        
        delete: async function( e, params )
        {
            e.preventDefault();

            var confirmed = confirm( "Confirm delete?" );
            
            if ( confirmed )
            {
                var id = params.doc.getKey();
                var previous = scope.view.get( "data" );
        
                let schema = { ...data.schema[ scope.collection ] };
                    schema.action = "delete";
                    schema.doc = null;
                    schema.url = `${ schema.path }/${ schema.action }/${ id }`;
        
                await data.delete( schema );
                scope.view.clear( params.parent );
                await templates[ previous.display ]( previous );
                
                let tbody = scope.view.get( "data" );
                    tbody.action = schema.action;
                    tbody.child = tbody.parent.querySelector( `tr[ data-id = "${ id }" ]` )
                    tbody.doc = params.doc;
                dom.change( tbody );
            }
        },

        edit: function( e, params )
        {
            e.preventDefault();
            
            var sub = scope.view.get( "sub" );
                sub.action = "update";
                sub.display = scope.collection;
                sub.doc = params.doc;
            dom.exec( sub );
        },

        grow: async function( e, params, object )
        {
            var el = e.target;
            var collection = params.name;
            var datalist = el.list;
            var option = datalist.querySelector( `[ value = "${ params.value }" ]` );
            var doc = {};
            var existing, field; 

            if ( Array.isArray( params.field ) ) 
            {
                existing = option ? params.field.every( field => params.value.includes( option.dataset[ field ] ) ) : false;
                field = params.field[ 0 ];
            }
            else
            {
                existing = object.values.findIndex( value => value[ params.field ] == el.value ) > -1;
                field = params.field;
            }

            if ( !existing && el.value )
            {
                let fields = data.fields[ collection ];
                    fields.forEach( field => doc[ field ] = "" );
                    doc[ field ] = el.value;

                let schema = { ...data.schema[ scope.collection ] };
                    schema.action = "insert";
                    schema.collection = collection;
                    schema.doc = doc;
                    schema.existing = data.schema.hasOwnProperty( collection );
                    schema.path = `/db/${ collection }`;
                    schema.url = `${ schema.path }/${ schema.action }`;

                    await data.grow( schema );

                    ui.message( `${ schema.action } ${ el.value } into ${ schema.collection }` );
            }
        },
        
        insert: async function( e, params )
        {
            e.preventDefault();
            
            const values = parse( e );
            const previous = scope.view.get( "data" );
    
            let schema = { ...data.schema[ scope.collection ] };
                schema.action = "insert";
                schema.doc = Object.assign( params.doc, values );
                schema.url = `${ schema.path }/${ schema.action }`;

            await data.insert( schema );
            scope.view.clear( params.parent );
            await templates[ previous.display ]( previous );
    
            let tbody = scope.view.get( "data" );
                tbody.action = schema.action;
                tbody.child = tbody.parent.querySelector( `tr[ data-id = "${ data.id }" ]` );
                tbody.doc = schema.doc;
            dom.change( tbody );
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
            {
                e.target.reset();
                ui.message( "Login failed" );
            }
        },
        
        prevent: async function( e )
        {
            e.preventDefault();
        },

        select: function( e, parameters )
        {
            e.preventDefault();
            e.stopPropagation();

            var tbody = scope.view.get( "data" );
                tbody.action = "select";
                tbody.child = docs.bubble( e.target, "tr" );
                tbody.doc = parameters.doc;
                tbody.parent = parameters.parent;
            dom.change( tbody );
    
            var sub = scope.view.get( "sub" );
                sub.action = "update";
                sub.display = sub.display || scope.collection;
                sub.doc = parameters.doc;
                sub.parent = parameters.parent;
            dom.exec( sub );
        },

        tab: function( e, params, value )
        {
            var el = e.target;
            
            data.schema[ scope.collection ].filter.value = value;

            var tabs = scope.view.get( "tabs" );
                tabs.action = "tab";
                tabs.child = el;
            dom.change( tabs );

            var tbody = scope.view.get( "data" );
            dom.exec( tbody );
        },

        update: async function( e, params )
        {
            e.preventDefault();

            console.warn( params.doc )
            /*if ( params.doc )
            {
                var id = params.doc.getKey();
                var values = parse( e );

                let schema = { ...data.schema[ scope.collection ] };
                    schema.action = "update";
                    schema.doc = Object.assign( params.doc[ id ], values );
                    schema.url = `${ schema.path }/${ schema.action }/${ id }`;

                await data.update( schema );
                scope.view.clear( params.parent );

                let tbody = scope.view.get( "data" );
                    tbody.action = schema.action;
                    tbody.child = tbody.parent.querySelector( `[ data-id = "${ id }" ]` );
                if ( values.color )
                    tbody.child.style.backgroundColor = values.color;
                    tbody.doc = schema.doc;
                dom.change( tbody );
            }*/
        }
    };

    // ui helpers
    const ui =
    {
        message: function( msg )
        {
            message.innerText = msg;
            message.classList.add( "visible" );

            setTimeout( function()
            {
                message.innerText = null;
                message.classList.remove( "visible" );
            }, delay );
        },

        text: function( text )
        {
            switch ( typeof text )
            {
                case "string":   
                    let maxlength = 32;
                    let br = text.indexOf( "</p>" );
                    let regex = /( |<([^>]+)>)/ig;
                    text = text.replace( regex, " " );
                    let period = text.indexOf( "." ) > -1 ? text.indexOf( "." ) : maxlength;
                    let index = Math.min.apply( null, [ br, period, maxlength ] );

                    return index > -1 ? text.substring( 0, index ) : text;

                case "undefined":
                    return "";    

                case "object":
                    if ( !text ) 
                        return "";  

                    if ( Array.isArray( text ) )
                        return ( typeof text[ 0 ] == "object" ) ? text.length : text;
                    else
                        return Object.keys( text );

                default:
                    return text;
            }

            return text;
        }
    };
    
    // forms
    const templates =
    {
        calendar: async function( params )
        {         
            scope.date = scope.date || new Date(); 
            
            params.action = "view";
            params.doc =
            {
                [ "new" ]: { date: scope.date }
            };

            let { id, values, div } = includes[ params.action ]( params );

            await scope.view.populate( params.parent, () =>
            {
                var title = { action: "title", title: `${ dates.parse( scope.date ).Month } ${ scope.title }` };
                dom.change( title );
                
                scope.calendar = new widgets.Calendar( { name: "calendar", field: "name", Form: id, value: values[ "date" ], data: data.store[ scope.collection ], parent: div, listeners: [ { event: "click", handler: ( e ) => events.date( e, params ) } ] } );  
                scope.calendar.on = { select: events.select }; 
                scope.view.data.parent = document.getElementById( "data" );
            } );
        },
        checklist: ( params ) =>
        {
            scope.view.clear( params.parent );

            var id = params.doc.getKey();
            var values = params.doc.getValue();

            var div = docs.ce( "div" );
                div.classList.add( "content" );
            docs.ac( params.parent, div );

            new widgets.Toolbar( { parent: div, controls:
            [
                { title: "back", event: "click", handler: () => scope.view.clear( params.parent ) },
                { title: "edit", event: "click", handler: ( e ) => events.edit( e, params ) },
                { title: "print", event: "click", handler: ( e ) => window.print() }
            ] } );

            var title = docs.ce( "h1" );
                title.innerText = values[ "label" ];
            docs.ac( div, title );

            if ( values[ "description" ] )
            {
                let description = docs.ce( "div" );
                    description.innerHTML = values[ "description" ];
                docs.ac( div, description );
            }

            new widgets.Checkboxes( { array: values[ "item" ], sort: "stock", parent: div, Form: id, headless: true, name: "stock", field: "stock", value: values[ "stock" ] } );

            return { id, values, div };
        },
        event: ( params ) =>
        {
            var { id, values, div } = includes[ params.action ]( params );

            new widgets.Input( { type: "number", Form: id, name: "BEO", required: true, value: values[ "BEO" ], min: 0, parent: div } );
            new widgets.Input( { type: "text", Form: id, name: "name", required: true, value: values[ "name" ], parent: div } );
            new widgets.Date( { Form: id, name: "date", required: true, value: values[ "date" ], parent: div } );
            new widgets.Input( { type: "time", Form: id, name: "time", required: true, value: values[ "time" ], parent: div } );
            new widgets.Input( { type: "number", Form: id, name: "guests", required: true, value: values[ "guests" ], min: 0, parent: div } );
            new widgets.Drilldown( { parent: div, config:
            [ 
                { Form: id, name: "venue", required: true, value: values[ "venue" ] , query: `select * from venue`, sort: "name", field: "name" }, 
                { Form: id, name: "rooms", required: true, value: null, array: [], sort: "label", field: "label" }, 
            ] } );
            new widgets.Color( { Form: id, name: "color", required: true, value: values[ "color" ], parent: div } );
        },
        group: ( params ) =>
        {
            var { id, values, div } = includes[ params.action ]( params );
            var subgroup = 
            {
                id: id,
                values: values,
                parent: div,
                name: "subgroup",
                widgets:
                [
                    { class: "Input", params: { type: "text", name: "label" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
            new widgets.Array( subgroup );
        },
        item: ( params ) =>
        {  
            var { id, values, div } = includes[ params.action ]( params );
            var config = 
            {
                id: id,
                values: values,
                parent: div,
                name: "item",
                widgets:
                [
                    { class: "Datalist", params: { query: `select * from stock`, sort: "label", name: "stock", field: [ "label", "brand", "description" ], listeners: [ { event: "dblclick", handler: events.grow } ] } },
                    { class: "Input", params: { type: "number", name: "quantity", size: "2", required: true, min: 0 } },
                    { class: "Datalist", params: { query: `select * from plating`, sort: "sequence", name: "plating", field: "label", required: true, listeners: [ { event: "dblclick", handler: events.grow } ] } },
                    { class: "Input", params: { type: "text", name: "notes" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
            new widgets.Datalist( { query: `select * from group`, sort: "label", parent: div, Form: id, name: "group", field: "label", value: values[ "group" ], listeners: [ { event: "dblclick", handler: events.grow } ] } );
            new widgets.Text( { Form: id, name: "description", required: true, value: values[ "description" ], parent: div } );
            new widgets.Array( config );
        },
        label: ( params ) =>
        {
            var { id, values, div } = includes[ params.action ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
        },
        login: ( params ) =>
        {
            scope.view.clear( params.parent );

            var id = "login";
            var values = {};
            var div = params.parent;

            var form = docs.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => events.login( e, params ), false );
                form.id = id;
            docs.ac( div, form );

            new widgets.Input( { type: "email", Form: id, name: "email", required: true, value: "tito.chatzis@gmail.com", parent: div } );
            new widgets.Input( { type: "password", Form: id, name: "password", required: true, value: "x", parent: div } );
            new widgets.Input( { type: "image", Form: id, src: "/images/login.png", title: "Log In", parent: div, width: 48 } );
        },
        offline: async ( parameters ) =>
        {
            parameters.doc = parameters.doc || { [ "new" ]: {} };
            
            let script = await import( "./stubs/offline.js" );
                script.load( widgets, parameters );
        },
        schema: ( params ) =>
        {
            var { id, values, div } = includes[ params.action ]( params );

            var object = 
            {
                id: id,
                values: values,
                parent: div,
                name: "parameters",
                widgets:
                [
                    { class: "Select", params: { array: [ "", "table", "calendar", "offline" ], name: "content" } },
                    { class: "Select", params: { array: [ "", "label", "sequence" ], name: "sub" } },
                    { class: "Array", params: { parent: div, name: "fields", widgets: [ { class: "Input", params: { type: "text", name: "field", required: true, headless: true } } ] } },
                    { class: "Input", params: { type: "text", name: "sort" } },
                    { class: "Input", params: { type: "text", name: "tab" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "label", value: values[ "label" ], parent: div } );
            new widgets.Input( { type: "input", Form: id, name: "endpoint", required: true, value: values[ "endpoint" ], parent: div } );
            new widgets.Input( { type: "number", Form: id, name: "sequence", required: true, value: values[ "sequence" ] || data.store[ scope.collection ].length + 1, parent: div, size: 2 } );
            new widgets.Select( { Form: id, name: "class", required: true, value: values[ "class" ], array: [ "DB", "Static", "Download", "File", "Directory" ], parent: div } );
            new widgets.Select( { Form: id, name: "role", required: true, value: values[ "role" ], array: [ "public", "user", "admin", "developer" ], parent: div } );
            new widgets.Object( object );
            //new widgets.Tuple( { name: "parameters", parent: div, values: values } );
        },
        sequence: ( params ) =>
        {
            var { id, values, div } = includes[ params.action ]( params );

            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
            new widgets.Input( { type: "number", Form: id, name: "sequence", required: true, value: values[ "sequence" ] || data.store[ scope.collection ].length + 1, parent: div, size: 2 } );
        },
        stock: async ( params ) => 
        { 
            var { id, values, div } = includes[ params.action ]( params );
            var matrix = 
            {
                id: id,
                values: values,
                parent: div,
                name: "storage",
                field: "name",
                query: `select * from venue`,
                collection: scope.collection,
                widgets:
                [
                    { class: "Select", config: { name: "storage", field: "label" } },
                    { class: "Input", config: { name: "inventory", field: "quantity", type: "number", min: 0 } }
                ]
            };

            new widgets.Datalist( { query: `select * from brand`, sort: "label", parent: div, Form: id, name: "brand", field: "label", value: values[ "brand" ], listeners: [ { event: "dblclick", handler: events.grow } ] } );
            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
            new widgets.Input( { type: "input", Form: id, name: "description", required: false, value: values[ "description" ], parent: div } );
            new widgets.Drilldown( { parent: div, config: 
            [ 
                { Form: id, name: "group", required: true, value: values[ "group" ], query: `select * from group`, sort: "label", field: "label" }, 
                { Form: id, name: "subgroup", required: true, value: values[ "subgroup" ], array: [], sort: "label", field: "label" }, 
            ] } );
            new widgets.Checkboxes( { query: `select * from allergen`, sort: "sequence", parent: div, Form: id, name: "allergen", field: "label", value: values[ "allergen" ] } );
            new widgets.Input( { type: "input", Form: id, name: "size", value: values[ "size" ], parent: div } );
            new widgets.Input( { type: "number", Form: id, name: "order number", value: values[ "order number" ], parent: div, pattern: "[0-9]{4,7}", maxlength: 7, size: 7, title: "Must be digits", min: 0 } );
            new widgets.Matrix( matrix );
        },
        tabs: async function( params )
        {
            var field = data.schema[ scope.collection ].filter.name;

            var tabs = docs.ce( "div" );
                tabs.id = "tabs";
                scope.view.parent( tabs );
            docs.ac( params.parent, tabs );

            scope.view.clear( tabs );

            await scope.view.populate( tabs, () =>
            {
                new widgets.Tabs( { field: field, values: data.store[ scope.collection ], listeners: [ { event: "click", handler: events.tab } ], parent: tabs } );
            } );

            return tabs;
        }, 
        thead: async function( params )
        {  
            var button = new widgets.Input( { type: "image", src: "/images/add.png", title: "Add", parent: params.parent, width: 36, height: 36, headless: true,
                listeners: [ { event: "click", handler: events.add } ] } );
                //button.addEventListener( "click", ( e ) => events.add( e ), false );

            var table = docs.ce( "table" );
            docs.ac( params.parent, table );

            var thead = docs.ce( "thead" );
            docs.ac( table, thead );

            // column headings
            var tr = docs.ce( "tr" );
                tr.id = "columns";
            scope.view.parent( tr );
            docs.ac( thead, tr );

            // populate headings
            scope.view.clear( tr );

            await scope.view.populate( tr, () =>
            {
                var fields = scope.fields || data.fields[ scope.collection ];

                fields.forEach( field =>
                {
                    let td = docs.ce( "td" );
                        td.classList.add( "column" );
                        td.innerText = field;
        
                    docs.ac( tr, td );
                } );
            } );

            var tbody = docs.ce( "tbody" );
                tbody.id = "data";
            scope.view.parent( tbody );
            docs.ac( table, tbody );

            return tbody;
        },
        tbody: async ( parameters ) =>
        {   
            // data rows
            var tbody = scope.view.el( "data" );
            var filter = data.schema[ scope.collection ].filter;

            scope.view.clear( tbody );

            await scope.view.populate( tbody, () => 
            {
                var fields = scope.fields || data.fields[ scope.collection ];

                data.filter( data.store[ scope.collection ], filter ).forEach( doc =>
                {       
                    parameters.doc = doc;
                    
                    let tr = docs.ce( "tr" );
                        tr.dataset.id = doc.getKey();;
                        tr.addEventListener( "click", ( e ) => events.select( e, parameters ), false );
                        tr.addEventListener( "contextmenu", events.prevent, false );
                        tr.classList.add( "row" );
        
                    fields.forEach( field =>
                    {                         
                        let td = docs.ce( "td" );
                            td.dataset.field = field;
                            td.classList.add( "cell" );
                            td.innerText = ui.text( doc.getValue()[ field ] );
            
                        docs.ac( tr, td );
                    } );
        
                    docs.ac( tbody, tr );
                } )  
            } );

            dnd.init( tbody, ( e ) => docs.bubble( e.target, "tr" ), data.fields[ scope.collection ] );

            return tbody;
        },
        table: async ( parameters ) =>
        {
            await templates.tabs( parameters );
            await templates.thead( parameters );
            await templates.tbody( parameters );
        },
        test: async ( parameters ) =>
        {
            var header = new includes[ parameters.action ]( parameters );
            Object.assign( header, { ...parameters } );

            let script = await import( "./stubs/offline.js" );
                script.load( widgets, header );
        },
        todo: function( params )
        {
            var { id, values, div } = includes[ params.action ]( params );

            values.date = new Date();

            new widgets.Date( { Form: id, name: "date", required: true, value: values[ "date" ], parent: div } );
            new widgets.Input( { type: "input", Form: id, name: "type", required: true, value: values[ "type" ], parent: div } );
            new widgets.Input( { type: "input", Form: id, name: "label", required: true, value: values[ "label" ], parent: div } );
            new widgets.Input( { type: "input", Form: id, name: "script", value: values[ "script" ], parent: div } );
            new widgets.Input( { type: "number", Form: id, name: "line", required: true, value: values[ "line" ], parent: div, size: 2, min: 0 } );
            new widgets.Text( { Form: id, name: "description", value: values[ "description" ], parent: div } );
            new widgets.Date( { Form: id, name: "completed", value: values[ "completed" ], parent: div } );
        },
        venue: function( params )
        {
            var { id, values, div } = includes[ params.action ]( params );
            var rooms = 
            {
                id: id,
                values: values,
                parent: div,
                name: "rooms",
                widgets:
                [
                    { class: "Input", params: { type: "text", name: "type" } },
                    { class: "Input", params: { type: "text", name: "label" } },    
                    { class: "Input", params: { type: "text", name: "description" } }
                ]
            };
            var storage = 
            {
                id: id,
                values: values,
                parent: div,
                name: "storage",
                widgets:
                [
                    { class: "Input", params: { type: "text", name: "label" } }
                ]
            };

            new widgets.Input( { type: "input", Form: id, name: "name", required: true, value: values[ "name" ], parent: div } );
            new widgets.Array( rooms );
            new widgets.Array( storage );
        }
    };

    this.init = function( params )
    { 
        scope.fields = params.fields ? params.fields.split( "," ) : null;
        scope.title = document.title;
        scope.view = new View();
        scope.view.init( params ); 
    };
};

export default Content;