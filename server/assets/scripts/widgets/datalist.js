import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Datalist( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;
    
    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "input" );
    this.input.placeholder = config.name;
    this.input.setAttribute( "value", config.value || "" );

    [ "Form", "required" ].forEach( att => { if ( config[ att ] ) this.input.setAttribute( att, config[ att ] ) } );
    
    docs.ac( this.parent, this.input );

    this.populate = function()
    {   
        if ( this.data )
        {
            scope.label.innerText = this.data.name;
            let id = scope.Form ? `${ scope.Form }_${ this.data.name }` : this.data.name;  
            
            scope.input.setAttribute( "list", id );
            scope.input.name = this.data.name;
            this.listeners( scope.input, config );

            var datalist = docs.ce( "datalist" );
                datalist.id = id;
            docs.ac( scope.parent, datalist );
            
            /*var array = normalize( this.data.values, params );*/
            this.data.values.forEach( ( value, i ) =>
            {
                var val;
                var text = "";
                var option = docs.ce( "option" )

                if ( Array.isArray( config.model.field ) )
                {
                    let array = [];

                    config.field.forEach( ( field, index ) =>
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
                    val = value[ config.model.field ];
                    option.setAttribute( `data-${ config.model.field }`, value[ config.model.field ] );
                }

                option.value = val;
                option.innerText = text;
                docs.ac( datalist, option );
            } );
        }
    };

    config.model.data.load.call( this, config );
};