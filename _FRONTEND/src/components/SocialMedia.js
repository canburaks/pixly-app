import React from "react";


export const SocialBox = ({ item, size, rating, styles}) => (
    <div className="cbs-social-box">
        {item.homepage && <SocialMedia homepage={item.homepage} size={size} />}
        {item.facebook && <SocialMedia facebook={item.facebook} size={size} />}
        {item.twitter && <SocialMedia twitter={item.twitter} size={size} />}
        {item.instagram && <SocialMedia instagram={item.instagram} size={size} />}
        {item.imdb && 
            <SocialMedia imdb={item.imdb} size={size} rating={rating ? item.imdbRating : null}
                styles={styles}
            />}
    </div>
)


export const SocialMedia = (props) => {
    const styles ={
        marginRight:12
    }
    if (props.homepage) return  <HomeIcon link={props.homepage} size={props.size} styles={props.styles} />
    else if (props.imdb) return  <ImdbIcon link={props.imdb} size={props.size} rating={props.rating} styles={props.styles} />
    else if (props.facebook) return  <FacebookIcon link={props.facebook} size={props.size} styles={props.styles} />
    else if (props.twitter) return  <TwitterIcon link={props.twitter} size={props.size} styles={props.styles} />
    else if (props.instagram) return  <InstagramIcon link={props.instagram} size={props.size} styles={props.styles} />
    else return <div></div>

}


export const ImdbIcon = ({link, rating, size, styles, className="" }) => (

    <a target="_blank" rel="noopener" href={link} className="fbox-c jcfs aifs pos-r zin-5">
        <svg aria-hidden="true" focusable="false" 
            className={"svg-inline--fa fa-imdb fa-w-14 f-icon " + className} 
            role="img" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512" 
            //style={{fontSize:size, color:"#000000", ...styles}}
            style={{fontSize:size, color:"#fac539", ...styles}}
        >
            <title>{link}</title>
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM21.3 229.2H21c.1-.1.2-.3.3-.4zM97 319.8H64V192h33zm113.2 0h-28.7v-86.4l-11.6 86.4h-20.6l-12.2-84.5v84.5h-29V192h42.8c3.3 19.8 6 39.9 8.7 59.9l7.6-59.9h43zm11.4 0V192h24.6c17.6 0 44.7-1.6 49 20.9 1.7 7.6 1.4 16.3 1.4 24.4 0 88.5 11.1 82.6-75 82.5zm160.9-29.2c0 15.7-2.4 30.9-22.2 30.9-9 0-15.2-3-20.9-9.8l-1.9 8.1h-29.8V192h31.7v41.7c6-6.5 12-9.2 20.9-9.2 21.4 0 22.2 12.8 22.2 30.1zM265 229.9c0-9.7 1.6-16-10.3-16v83.7c12.2.3 10.3-8.7 10.3-18.4zm85.5 26.1c0-5.4 1.1-12.7-6.2-12.7-6 0-4.9 8.9-4.9 12.7 0 .6-1.1 39.6 1.1 44.7.8 1.6 2.2 2.4 3.8 2.4 7.8 0 6.2-9 6.2-14.4z"></path>
        </svg>
        {rating && 
            <p className="mar-l-x  t-bold imdb-rating" 
                style={{
                    ...styles,
                    fontWeight:"900", 
                    fontSize:14,
                    color:"rgba(255,255,255, 0.8)",
                    position:"relative", 
                    left:-5
                    /* 
                    border:"1px solid black",
                    padding:"1px 2px",
                    borderRadius:"100%", 
                    bottom:0, right:-25, 
                   */
                }}
                >{rating}/10</p>}
    </a>
)
export const FacebookIcon = ({link, size, className="", }) => (
    <a target="_blank" rel="noopener" href={link} className="fbox-r jcfs aic">
        <svg
            aria-hidden="true" focusable="false" 
            className={"svg-inline--fa fa-facebook-square fa-w-14 f-icon" + className}
            role="img" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512" 
            style={{fontSize:size, color:"#355995"}}
        >
            <title>{link}</title>
            <path fill="currentColor" d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path>
        </svg>
    </a>
)
export const InstagramIcon = ({link, size, className="", }) => (
    <a target="_blank" rel="noopener" href={link} className="fbox-r jcfs aic">
        <svg
            aria-hidden="true" focusable="false" 
            className={"svg-inline--fa fa-instagram fa-w-14 f-icon" + className}
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
            style={{fontSize:size,borderRadius:8,padding:1, background:"linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)"}}
        >
            <title>{link}</title>
            <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
        </svg>
    </a>
)
export const TwitterIcon = ({link, size, className="", }) => (
    <a target="_blank" rel="noopener" href={link} className="fbox-r jcfs aic">
        <svg
            aria-hidden="true" focusable="false" 
            className={"svg-inline--fa fa-twitter-square fa-w-14 f-icon" + className}
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
            style={{fontSize:size, color:"#42aceb"}}
        >
            <title>{link}</title>
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"></path>
        </svg>
    </a>
)
export const HomeIcon = ({link, size, className="", }) => (
    <a target="_blank" rel="noopener" href={link} className="fbox-r jcfs aic">
        <svg
            aria-hidden="true" focusable="false" 
            className={"svg-inline--fa fa-home fa-w-18 f-icon t-color-light" + className}
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
            style={{fontSize:size, color:"white"}}
        >
            <title>{link}</title>
            <path fill="currentColor" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
        </svg>
    </a>
)
