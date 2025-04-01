import React from "react";
import { menuItems } from "../../jsons/mainMenuItems";
import './home.scss'
import '../../common/fonts.scss';
import { IconViewResolver } from "../../common/iconViewResolver";
import {banner as Banner, nextButton as NextButton } from "../../common/icons";
const Home = (props) => {  
    const {setCategory,setComponent,setCategoryName}=props
    const handleClick=(name,value)=>{
        setComponent('details')
        setCategory(name)
        setCategoryName(value)
    }  
    return (
        <div className="home">
            <div className="home__heading" style={{backgroundImage: `url("data:image/svg+xml,${Banner}")`,}}>
                <h1 className="home__heading__title">Gutenberg Project</h1>
                <h4 className="home__heading__description">A social cataloging website that allows you to freely search its database of books, annotations, and reviews.</h4>
            </div>
            <div className="home__navButtons">
            {menuItems.map((items, index) => {
                return (
                    <div key={`${items.name}--${index}`} className="home__navButtons__items" onClick={()=>handleClick(items.name,items.value)}>
                        <div className="home__navButtons__items__left">
                            {IconViewResolver(items.name)}
                            <span>{items.value}</span>
                        </div>
                        <div className="home__navButtons__item__right">
                            <NextButton />
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    );
};

export default Home;
