import React, {Suspense} from 'react'



export default function RenderCarousel({ children, ...props }) {

    const Carousel = React.lazy(() => import('../../Carousel'));
    
    return (
        <Suspense>
            <Carousel {...props}>{ children }</Carousel>
        </Suspense>
    );
}