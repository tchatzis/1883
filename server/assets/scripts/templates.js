import UI from "./ui.js";

const Templates = function()
{
    var scope = this;

    UI.call( scope );
    
    const templates = 
    {
        "default":
        {
            data: ( doc ) =>
            {
                scope.elements.content.load = false;
                scope.elements.sub.load = false;
                scope.elements.data.parent = document.getElementById( "data" );

                scope.view[ scope.settings.action ] = 
                {
                    content: scope.elements.content,
                    data: Object.assign( scope.elements.data, { stub: "tbody", doc: doc, load: true } ),
                    sub: scope.elements.sub
                };
            },
            insert: ( doc ) => 
            {
                scope.elements.content.load = false;
                
                scope.view[ scope.settings.action ] = 
                {
                    content: scope.elements.content,
                    sub: Object.assign( scope.elements.sub, { stub: scope.elements.sub.stub || scope.settings.collection, doc: doc, load: true } ),
                };
            },
            select: ( doc ) => 
            {
                scope.elements.content.load = true;
                
                scope.view[ scope.settings.action ] = 
                {
                    content: scope.elements.content,
                    sub: Object.assign( scope.elements.sub || {}, { doc: doc, load: false } )
                };
            },    
            update: ( doc ) => 
            {                
                scope.elements.content.load = false;
                
                scope.view[ scope.settings.action ] = 
                {
                    content: scope.elements.content,
                    sub: Object.assign( scope.elements.sub, { stub: scope.elements.sub.stub || scope.settings.collection, doc: doc, load: true } )           
                };
            },       
        }
    };

    // getters
    this.getCollection = ( collection ) => scope.imports.data.store[ collection || scope.settings.collection ];

    this.getDoc = () => 
    {
        var doc = scope.view[ scope.settings.action ][ scope.settings.id ].doc;
            doc.id = doc.id || scope.settings.collection;
            doc.data = doc.data || { data: [] };
            doc.doc = doc.doc || { [ doc.id ]: doc.data };

        return doc;
    }

    this.getDocs = async ( parent ) =>
    {   
        var schema = scope.imports.data.schema[ scope.settings.collection ].getSchema( parent, scope.settings.action );

        if ( !schema.existing )
            await scope.imports.data.select( schema );

        scope.imports.data.map.set( parent, scope.imports.data.store[ scope.settings.collection ] );
    };

    this.getMap = ( parent ) => scope.imports.data.map.get( parent );

    this.getParent = () => scope.view[ scope.settings.action ][ scope.settings.id ].parent;

    // setters
    this.setDoc = ( action, doc ) =>
    {
        scope.settings.action = action;
        templates[ scope.settings.template ][ action ]( doc );

        return scope.view[ action ];
    };

    this.setTemplate = ( template, parameters ) =>
    {   
        scope.elements = {};
        scope.settings = {};
        scope.view = {};
        
        // create handle for each element
        Array.from( document.querySelectorAll( "[ data-ui ]" ) ).forEach( el =>
        {
            scope.setElement( el );
            scope.elements[ el.id ] = { id: el.id, stub: parameters[ el.id ], parent: el };
        } );

        // find non-element keys
        Object.keys( parameters ).forEach( key => { if ( Object.keys( scope.elements ).indexOf( key ) == -1 ) scope.settings[ key ] = parameters[ key ]; } );

        // the Doc object
        scope.Doc = function( doc )
        {
            this.id = doc ? doc.getKey() : null;
            this.collection = scope.settings.collection;
            this.data = doc ? doc.getValue() : null;
            this.doc = doc || null;
            this.getField = ( key ) => this.data ? this.data[ key ] || "" : "";

            if ( this.doc )
            {
                let _doc =  scope.imports.data.store[ this.collection ].find( row => row.getKey() == this.id );
                    _doc = this.doc;
            }
        };

        // format objects
        scope.settings.fields =  scope.settings.fields ?  scope.settings.fields.split( "," ) : null;
        scope.settings.collection = scope.settings.path.split( "/" ).pop();
        scope.settings.template = template;
    };

    this.setView = ( action ) => this.setStubs( scope.view[ action ] );

    this.setStubs = async ( views ) =>
    {       
        for ( let view in views )
        {               
            let script = views[ view ].stub;

            if ( views[ view ].load )
            {
                scope.settings.id = views[ view ].id;
                scope.setClear( views[ view ].parent );
                await loadStub( script );   
            }
        }
    };

    const loadStub = async ( script ) =>
    {
        try
        {
            let stub = await import( `./stubs/${ script }.js` );
                stub.load.call( scope );
        }
        catch( error )
        {
            console.error( script, error );
        }
    }
};

export default Templates;