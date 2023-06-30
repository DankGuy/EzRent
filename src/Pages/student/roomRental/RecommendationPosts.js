import React, { useState, useEffect } from 'react';
import {Button} from 'antd'
import {GrPrevious, GrNext} from 'react-icons/gr'
import './RecommendationPosts.css'
import PostCarousel from './PostCarousel';
import { supabase } from '../../../supabase-client';


function RecommendationPosts({postID}) {

    
    const [recommendedPosts, setPost] = useState([]);


     //Get all posts from  and get agent information from supabase
     const fetchPosts = async () => {
        const {data} = await supabase
            .from('property_post')
            .select('*, agent(*)');

        setPost(data);
    }
    useEffect(() => {
       fetchPosts();

    }, []);

    //Recommendation section
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? recommendedPosts.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === recommendedPosts.length - 1 ? 0 : prevIndex + 1));
    };

    const renderPosts = () => {
        const startIndex = currentIndex;
        const endIndex = (currentIndex + 2) % recommendedPosts.length;
      
        const slicedPosts = recommendedPosts.slice(startIndex, endIndex + 1);
      
        console.log(slicedPosts);
      
        return slicedPosts.map((post, index) => (
          <PostCarousel
            post={post}
            key={index}
            activeIndex={index}
            totalPosts={slicedPosts.length}
          />
        ));
      };
      

    const isPreviousDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex === recommendedPosts.length - 3;

    return (
        <div className="product-carousel">
            <Button onClick={goToPrevious} className="carousel-button" disabled={isPreviousDisabled} shape='circle'>
                <GrPrevious size={25}/>
            </Button>
                {renderPosts()}
            <Button onClick={goToNext} className="carousel-button" disabled={isNextDisabled} shape='circle'>
                <GrNext size={25}/>
            </Button>
        </div>
    );
}

export default RecommendationPosts;