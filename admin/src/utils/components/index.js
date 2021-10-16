// import InvoiceComponent from './InvoiceView'
import Icon from 'react-eva-icons'


export const EvaIcon = (props) => {
    return (<Icon 
            name={props.name}
            size={props.size ? props.size : "medium"}     // small, medium, large, xlarge
            fill= {props.fill ? props.fill : '#11141A'}
            animation={{
            type: "pulse",  // zoom, pulse, shake, flip
            hover: true,
            infinite: false,
            }}
        />);
}


export {default as InvoicePage} from './InvoiceView';