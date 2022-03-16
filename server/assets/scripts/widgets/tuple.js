import Common from "./common.js";
import Config from "./config.js";
import Multi from "./multi.js";
import parse from "../forms.js";

export default function Tuple( config )
{
    Common.call( this, config );
    Config.call( config, config );

    config.doc = config.scope.getDoc();
    config.default = {};

    var data = config.doc.data[ config.name ] || Object.assign( config.doc.data, { [ config.name ]: config.default } )[ config.name ];

    var scope = this;

    var widgets =
    [
        { class: "Input", config: { name: "name", hide: { update: true }, required: true } },
        { class: "Input", config: { name: "value" } }
    ];

    Multi.call( this, config, widgets );

    this.add = function( e )
    {
        e.preventDefault();

        var row = parse( e );
        var value = row.tuple();

        Object.assign( data, value );

        scope.populate();

        e.target.reset();
    };

    this.delete = function( e )
    {
        e.preventDefault();

        var name = Array.from( e.target.form.elements ).find( el => el.name == "name" );

        delete data[ name.dataset.value ];

        scope.populate();
    };

    this.update = function( e )
    {
        e.preventDefault();
        
        var row = parse( e );
        var name = Array.from( e.target.form.elements ).find( el => el.name == "name" );


        data[ name.dataset.value ] = row.value;
    };

    this.populate = () => 
    {
        this.section.innerHTML = null; 

        var index = 0;

        for ( let name in data )
        {       
            let tuple = { name: name, value: data[ name ] };
            this.row( index, tuple );
            index++;
        }

        scope.broadcast( config );
    };

    this.init( config ); 
}