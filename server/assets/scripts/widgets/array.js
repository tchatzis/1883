import Common from "./common.js";
import Config from "./config.js";
import DND from "../dnd.js";
import docs from "../docs.js";
import Multi from "./multi.js";
import parse from "../forms.js";

export default function Array( config )
{
    Common.call( this, config );
    Config.call( config, config );

    /*config.doc = config.scope.getDoc();
    config.default = [];

    var data = config.doc.data[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];*/

    var scope = this;
    var data = this.getData( config );
    var dnd = new DND();

    Multi.call( this, config, config.widgets );

    this.add = function( e )
    {
        e.preventDefault();

        var row = parse( e );
        
        data.push( row );

        scope.populate();

        e.target.reset();
    };

    this.delete = function( e )
    {
        data.splice( e.target.dataset.index, 1 );

        scope.populate();
    };

    this.update = function( e )
    {
        e.preventDefault();
        
        var row = parse( e );

        data[ e.submitter.dataset.index ] = row;
    }; 

    this.populate = () => 
    {
        this.section.innerHTML = null; 

        data.forEach( ( data, index ) => this.row( index, data ) );

        scope.broadcast( config );  
        
        dnd.init( this.section, ( e ) => docs.find( e.target, "[draggable='true']" ), data );
    };

    this.init( config ); 
}