import Data from "./data.js";
import docs from "./docs.js";
import Events from "./events.js";
import Templates from "./templates.js";
import Widgets from "./widgets.js";

const Content = function()
{
    var scope = this;
        scope.imports =
        {
            data: new Data(),
            docs: docs
        };
        scope.imports.widgets = new Widgets( scope );
        scope.controls = {};
        scope.widgets = {};

    Events.call( scope );

    // new scope 
    function Schema( parameters )
    {
        this.collection = parameters.collection || scope.settings.collection;
        this.path = parameters.path || scope.settings.path;
        this.sort = parameters.sort || scope.settings.sort;
        this.filter = { name: parameters.tab || scope.settings.tab, value: parameters.filter || null };

        this.getSchema = ( parent, action ) =>
        {
            this.action = action;
            this.existing = scope.imports.data.store.hasOwnProperty( this.collection );
            this.parent = parent;
            this.url = `${ this.path }/${ action }`;
            
            return this;
        };
    }  

    // setters
    this.setClear = ( element ) => element.innerHTML = null;
    
    this.setContent = async ( parameters ) =>
    { 
        Templates.call( scope );
        
        scope.title = document.title;

        scope.setTemplate( "default", parameters );

        scope.imports.data.schema[ scope.settings.collection ] = new Schema( parameters );

        scope.setDoc( "select", new scope.Doc() );

        await scope.getDocs( sub );

        scope.setView( "select" );
    };
};

export default Content;