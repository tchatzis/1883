import parse from "./forms.js";

const Events = function()
{
    var scope = this;
        scope.on = {};

    scope.on.add = ( e ) =>
    {   
        e.preventDefault();

        let doc = scope.view.data.data.doc;

        scope.setDoc( "insert", doc );
        scope.setView( "insert" );
    },
        
        /*checklist: function( e, params )
        {
            e.preventDefault();

            var sub = scope.view.get( "sub" );
                sub.action = "view";
                sub.display = "checklist";
                sub.doc = params.doc;
            dom.exec( sub );
        },*/

    scope.on.date = ( e, params ) =>
    {
        e.preventDefault();
        
        var el = e.target;
        console.log( el );
        //var id = params.doc.getKey();
        /*var cell = {};
            cell.action = "date";
            cell.child = el;
            cell.display = params.display;
            cell.doc = params.doc;
            cell.doc[ id ].date = new Date( el.dataset.date );

        dom.change( cell );*/
    };
        
        /*delete: async function( e, params )
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
        },*/

        /*edit: function( e, params )
        {
            e.preventDefault();
            
            var sub = scope.view.get( "sub" );
                sub.action = "update";
                sub.display = scope.collection;
                sub.doc = params.doc;
            dom.exec( sub );
        },*/

        /*grow: async function( e, params, object )
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
        },*/
        
    scope.on.insert = async ( e ) =>
    {
        e.preventDefault();

        let doc = scope.getDoc();
        let values = parse( e );

        let schema = 
        {
            action: scope.settings.action,
            doc: Object.assign( doc.data, values ),
            url: `${ scope.settings.path }/${ scope.settings.action }`
        };

        await scope.imports.data.insert( schema );

        scope.setClear( scope.getParent() );
    };

    scope.on.login = async( e ) =>
    {
        scope.on.prevent();

        const values = parse( e );

        console.log( values );

        /*let schema = { ...data.schema[ scope.collection ] };
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
        }*/
    },

    scope.on.load = ( e, data ) =>
    {
        scope.on.prevent( e );
        console.log( data );
    };
  
    scope.on.prevent = ( e ) => e.preventDefault();

    scope.on.select = ( e, doc ) =>
    {
        scope.on.prevent( e );
        scope.on.stop( e );

        scope.setDoc( "update", doc );
        scope.setView( "update" );
    },

    scope.on.stop = ( e ) => e.stopPropagation();

    scope.on.tab = ( e ) =>
    {
        let el = e.target;
        let doc = new scope.Doc();
            doc.id = scope.settings.collection;
            doc.data = { [ scope.settings.tab ]: el.innerText };
            doc.doc = { [ doc.id ]: doc.data };
        
        scope.imports.data.schema[ scope.settings.collection ].filter.value = el.innerText;
        scope.controls[ "add" ].enable( true );
        
        scope.setDoc( "data", doc );
        scope.setView( "data" );

        /*var tabs = scope.view.get( "tabs" );
            tabs.action = "tab";
            tabs.child = el;
        dom.change( tabs );

        var tbody = scope.view.get( "data" );
        dom.exec( tbody );*/
    };

    scope.on.update = async ( e ) =>
    {
        e.preventDefault();

        let doc = scope.getDoc();
        let values = parse( e );

        if ( doc )
        {
            let schema = 
            {
                action: scope.settings.action,
                doc: Object.assign( doc.data, values ),
                url: `${ scope.settings.path }/${ scope.settings.action }/${ doc.id }`
            };

            await scope.imports.data.update( schema );

            scope.setClear( scope.getParent() );
        }
    }
};

export default Events;