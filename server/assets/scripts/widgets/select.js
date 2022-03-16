import Common from "./common.js";
import Config from "./config.js";
import docs from "../docs.js";

export default function Select( config )
{
    Common.call( this, config );
    Config.call( config, config );

    var scope = this;

    this.block( config );
    this.label.innerText = config.name || "\n";
    this.input = docs.ce( "select" );
    
    docs.ac( this.parent, this.input );

    this.listeners( this.input, config );

    this.populate = () =>
    {   
        if ( this.data )
        {
            this.label.innerText = this.data.name

            // input 
            this.input.name = this.data.name;
            this.input.id = config.id ? config.id : this.data.name;
            this.input.value = config.value;

            // hide
            if ( config?.hide?.input && !config.value )
            {
                let container = docs.find( this.input, ".field" );
                container.classList.add( "hidden" );
            }

            [ "Form", "required" ].forEach( att => { if ( config[ att ] ) this.input.setAttribute( att, config[ att ] ) } );

            // empty option
            let option = docs.ce( "option" );
                option.text = "";
                option.value = ""
            docs.ac( this.input, option );
            
            // options
            var array = this.normalize( this.data.values, config );
                array.forEach( ( value ) =>
                {             
                    let option = docs.ce( "option" );
                        option.text = value[ config.model.field ];
                        option.value = value[ config.model.field ];
                    if ( config.value && config.value == option.value )
                        option.setAttribute( "selected", "");
                    docs.ac( this.input, option );
                } ); 

            this.data.values = array;   
        }
    };

    config.model.data.load.call( this, config );
}