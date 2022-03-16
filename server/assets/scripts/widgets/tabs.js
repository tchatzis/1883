import Common from "./common.js";
import docs from "../docs.js";

export default function Tabs( config )
{
    Common.call( this, config );
    
    var tabs = [];
    var values = [ ...config.values ];
        values.forEach( doc => 
        {
            let value = doc.getValue()[ config.field ];
           
            if ( !tabs.find( field => field == value ) )
                if ( value )
                    tabs.push( value );
        } );

    if ( tabs.length )
    {
        let div = docs.ce( "div" );
            div.classList.add( "flex" );
        docs.ac( config.parent, div );

        let label = docs.ce( "div" );
            label.innerText = config.field;
            label.classList.add( "tabs" );
        docs.ac( div, label );

        tabs.forEach( text =>
        {
            var tab = docs.ce( "div" );
                tab.innerText = text;
                tab.classList.add( "tab" );
            this.listeners( tab, config, text );
            docs.ac( div, tab );
        } );

        let underline = docs.ce( "div" );
            underline.classList.add( "underline" );
        docs.ac( div, underline );
    }
}