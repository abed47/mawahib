import { useState } from "react";

const SelectComponent: React.FC <{
    items: any[], 
    label: string, 
    selectedValue: boolean, 
    onChange: (e: any) => void,
    error: boolean
}> = props => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    
    const handleClickOutside = () => {
        setMenuOpen(false);
    }

    const handleFocus = () => {
        setMenuOpen(true)
    }

    const handleClick = (e: any) => {
        setMenuOpen(false);
        props.onChange(e);
    }

    return (
        <div 
            className="input select glowing" 
            onFocus={handleFocus} 
            onBlur={handleClickOutside}
            tabIndex={6}>
            <p>{props.label}</p>
            
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