import {useState, FC} from 'react';
import {Button } from '@mui/material';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FiSearch } from 'react-icons/fi';

const SearchBar: FC = props => {

  const [categories, setCategories] = useState<any>([
    {id: '1', value: 'hello', label: 'works'},
    {id: '21', value: 'hello2', label: 'works2'},
  ]);
  
  return (
    <div className='search-bar-wrapper'>
      <Dropdown className='menu-wrapper' options={categories} onChange={e => console.log(e)} placeholder="Select an option" />
      <input type="text" placeholder='Search' />
      <Button className='search-btn'><FiSearch /></Button>
    </div>
  );
}

export default SearchBar;