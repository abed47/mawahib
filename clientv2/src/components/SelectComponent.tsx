import { useState } from "react";

const SelectComponent: React.FC <{
    items: any[], 
    label: string, 
    selectedValue: boolean, 
    onChange: (e: any) => void,
    error: boolean,
    value?: string
}> = props => {

    const [menuOpen, setMenuOpen] = useState(false);

    const handleClickOutside = () => {
        setMenuOpen(false);
    }

    const handleFocus = (e:any) => {
        if(menuOpen){
            setMenuOpen(false);
            return;
        }
        setMenuOpen(true)
    }

    const handleInputPress = (e: any) => {
        if(!menuOpen){
            setMenuOpen(true);
            return;
        }
    }

    const handleClick = (e: any) => {
        setMenuOpen(false);
        props.onChange(e);
    }

    return (
        <div 
            id={'selectInput' + props.label.trim()}
            className="input select glowing" 
            onFocus={handleFocus} 
            onClick={handleInputPress}
            onBlur={handleClickOutside}
            tabIndex={6}>
            <p className={`${props?.value ? 'active' : ''}`}>{props?.value ? props.value : props.label }</p>
            
            <ul className={`menu ${menuOpen ? 'active' : ''}`}>
                {
                    props.items.map((item, i) => {
                        return <li key={`menu-category-list-item-${i}`} onClick={e => handleClick(item?.name || item?.title || item || null)} >{item?.name || item?.title || item || 'no item'}</li>
                    })
                }
            </ul>
        </div>
    );
}

export default SelectComponent;