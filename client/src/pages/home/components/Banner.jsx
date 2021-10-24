import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import PlaceHolder from '../../../assets/images/placeholder.jpg';
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
const Banner = (props) => {

  const [active, setActive] = useState(0);
  const [items, setItems] = useState([
    1,2,3,4,5,6,7,8,9,0,4,3
  ]);

  const [direction, setDirection] = useState('');


  

  useEffect(() => {

  //   let timer = setInterval(() => {
  //   let newActive = active;
  //   newActive--
  //   setActive(newActive < 0 ? items.length - 1 : newActive);
  // }, 1000);

    return () => {
      // clearInterval(timer);
    }
  }, [])

  const moveLeft = () => {
    setDirection('left');
    let newActive = active;
    newActive--;
    setActive(newActive < 0 ? items.length - 1: newActive)
  }

  const moveRight = () => {
    setDirection('right');
    let newActive = active;
    setActive((newActive + 1) % items.length)
  }

  const generateItems = () => {
    let itemList = [];
    let level;

    for (let i = active - 2; i < active + 3 ; i++){
      let index = i;

      if(i < 0) {
        index = items.length + i;
      }else if( i >= items.length){
        index = i % items.length
      }

      level = active - i;
      itemList.push(
        <div key={index} id={index} className={`item level${level}`}>
          h
        </div>
      )
    }

    return itemList;
  }

    
    return (
        <div className="home-banner" >

          <div className="carousel-wrapper">
            <div id="carousel" className='noselect'>
              <CSSTransitionGroup transitionName={direction}>
                {generateItems()}
              </CSSTransitionGroup>
            </div>
          </div>
          

          <div className="actions">
            <Button onClick={moveLeft}>Left</Button>
            <Button onClick={moveRight}>Right</Button>
          </div>
          
        </div>
    );
}

export default Banner;