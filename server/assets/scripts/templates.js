import doc from "./doc.js";
import Widgets from "./widgets.js";

var Templates = function()
{
    var scope = this;

    function remove( e, params )
    {
        const id = Object.keys( params.data );

        params.action = "delete";
        
        params.url = `/db/${ scope.from }/${ params.action }/${ id }`;

        scope[ params.action ]( params );
    }

    function select( e, data )
    {
        doc.clear( "tbody" );

        var target = doc.bubble( e.target, "tr" );
            target.classList.add( "active" );

        var params = Object.assign( view( "update" ),
        {
            data: data,
            target: target
        } );

        templates[ params.action ][ params.display ]( params );
    }

    function post( e, params )
    {
        e.preventDefault();

        const fields = new FormData( e.target );   
        const id = Object.keys( params.data );

        params.url = `/db/${ scope.from }/${ params.action }/${ id }`;
        params.body = Object.fromEntries( fields.entries() );

        scope[ params.action ]( params );
    }

    const templates = {};

    templates.controls = 
    {
        input: function( params )
        {
            var div = doc.ce( "div" );
                div.classList.add( "column" );
                div.innerText = params.name ? params.name : '\n';
            var nested = doc.ce( "div" );
                nested.classList.add( "input" );
            var input = doc.ce( "input" );

            for ( let att in params )
                input.setAttribute( att, params[ att ] );

            doc.ac( div, nested );
            doc.ac( nested, input );

            return div;
        }
    };
    
    templates.select =
    {
        table: function( params )
        {
            params.element.innerHTML = null;
            
            var table = doc.ce( "table" );
            var thead = doc.ce( "thead" );
            var tr = doc.ce( "tr" );
            var tbody = doc.ce( "tbody" );
    
            scope.fields.forEach( field =>
            {
                let td = doc.ce( "td" );
                    td.classList.add( "column" );
                    td.innerText = field;
    
                doc.ac( tr, td );
            } );
    
            scope.data.forEach( data =>
            {
                let id = Object.keys( data );
                let tr = doc.ce( "tr" );
                    tr.addEventListener( "click", ( e ) => select( e, data ), false );
                    tr.classList.add( "row" );
    
                scope.fields.forEach( field =>
                {   
                    let td = doc.ce( "td" );
                        td.dataset.key = field;
                        td.classList.add( "cell" );
                        td.innerText = data[ id ][ field ];
        
                    doc.ac( tr, td );
                } );
    
                doc.ac( tbody, tr );
            } );
    
            doc.ac( thead, tr );
            doc.ac( table, thead );
            doc.ac( table, tbody );
            doc.ac( params.element, table );
        }
    };

    templates.update =
    {
        group: ( params ) =>
        {
            params.element.innerHTML = null;

            var id = Object.keys( params.data );
            var data = params.data[ id ];

            var div = doc.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            doc.ac( params.element, div );

            var form = doc.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => post( e, params ), false );
            doc.ac( div, form );

            var label = templates.controls.input( { type: "input", name: "label", required: "true", value: `${ data[ "label" ] }` } );
            doc.ac( form, label );

            var sequence = templates.controls.input( { type: "number", name: "sequence", required: "true", value: `${ data[ "sequence" ] }` } );
            doc.ac( form, sequence );

            var submit = templates.controls.input( { type: "submit", value: "Update" } );
            doc.ac( form, submit );

            var button = templates.controls.input( { type: "button", value: "Remove" } );
                button.addEventListener( "click", ( e ) => remove( e, params ), false );
            doc.ac( form, button ); 
        },
        stock: ( params ) => 
        { 
            params.element.innerHTML = null;
            
            var widgets = new Widgets();
            var id = Object.keys( params.data );
            var data = params.data[ id ];

            var div = doc.ce( "div" );
                div.classList.add( "content" );
                div.classList.add( "noprint" );
            doc.ac( params.element, div );

            var form = doc.ce( "form" );
                form.setAttribute( "method", "post" );
                form.addEventListener( "submit", ( e ) => post( e, params ), false );
            doc.ac( div, form );

            var label = templates.controls.input( { type: "input", name: "label", required: "true", value: `${ data[ "label" ] }` } );
            doc.ac( form, label );

            var description = templates.controls.input( { type: "input", name: "description", value: `${ data[ "description" ] }` } );
            doc.ac( form, description );

            var group = new widgets.Datalist( { query: `select * from group`, sort: "sequence", action: "select", element: form, name: "group", field: "label", value: data[ "group" ] } );

            var size = templates.controls.input( { type: "input", name: "size", value: `${ data[ "size" ] }` } );
            doc.ac( form, size );

            var number = templates.controls.input( { type: "input", name: "order number", pattern: "[0-9]{7}", maxlength: "7", title: "Must be 7 digits", value: `${ data[ "order number" ] }` } );
            doc.ac( form, number );

            var radio = new widgets.Radio( { path: `/kitchens/erwin/storage`, action: "select", element: form, required: true, value: data[ "storage" ] } );

            var submit = templates.controls.input( { type: "submit", value: "Update" } );
            doc.ac( form, submit );

            var button = templates.controls.input( { type: "button", value: "Remove" } );
                button.addEventListener( "click", ( e ) => remove( e, params ), false );
            doc.ac( form, button );         
        }
    };

    this.change = function( params, result )
    {
        function transition( callback )
        {
            params.target.classList.remove( "active" );
            params.target.classList.add( params.action );
            params.target.addEventListener( "transitionend", callback, false );
        }

        var changes = {};
            changes.delete = () =>
            {
                var callback = () =>
                {
                    params.target.remove();
                };
                
                transition( callback );

                scope.data.forEach( row =>
                {
                    var id = Object.keys( result.data[ 0 ] )
                    var data = result.data[ 0 ][ id ];
                    
                    if( row == params.data )
                        Array.from( params.target.children ).forEach( child => child.innerText = "\n" );
                } );
            },
            changes.update = () => 
            {
                var callback = () => 
                {
                    params.target.classList.remove( params.action );
                    params.element.innerHTML = null;

                    templates[ scope.mode.action ][ scope.mode.display ]( scope.mode );
                };
                
                transition( callback );

                scope.data.forEach( row =>
                {
                    var id = Object.keys( result.data[ 0 ] )
                    var data = result.data[ 0 ][ id ];
                    
                    if( row == params.data )
                        Array.from( params.target.children ).forEach( child => child.innerText = data[ child.dataset.key ] );
                } );
            };
            changes[ params.action ]();
    };

    this.init = function( mode )
    {
        scope = Object.assign( scope, this );

        scope.mode = view( mode );
        scope.mode.name = mode;

        templates[ scope.mode.action ][ scope.mode.from || scope.mode.display ]( scope.mode );
    };

    function view( mode, display )
    {   
        var modes = 
        {
            table: { element: document.getElementById( "content" ), action: "select", display: display || "table" },
            update: { element: document.getElementById( "sub" ), action: "update", display: scope.from }
        };

        return modes[ mode ];  
    };
};

export default Templates;