import styles from '@/styles/test.module.scss'
import saveIcon from '@mui/icons-material/save';
import SvgIcon from "@mui/material/SvgIcon";

function Main() {
    let url = "https://image.tmdb.org/t/p/w300/zDNAeWU0PxKolEX1D8Vn1qWhGjH.jpg";
    return (
        <div>
            <style jsx>
                {
                    `
                    h1,
                    h2,
                    h3,
                    h4,
                    h5 {
                        font-family: 'Montserrat', sans-serif;
                        color: #e7e7e7;
                        margin: 0px;
                    }
                    
                    h1 {
                        font-size: 36px;
                        font-weight: 400;
                    }
                    
                    h3 {
                        font-size: 14px;
                        font-weight: 400;
                        color: #fe4141;
                    }
                    
                    h5 {
                        font-size: 12px;
                        font-weight: 400;
                    }

                    body {

                        background: linear-gradient(rgba(30, 27, 38, 0.95),
                                rgba(30, 27, 38, 0.95)),
                            url("https://i.ibb.co/FDGqCmM/papers-co-ag74-interstellar-wide-space-film-movie-art-33-iphone6-wallpaper.jpg");
                        background-position: center;
                        background-size: cover;
                        background-repeat: repeat;
                      }
                    `
                }
            </style>
            <div className={styles.container}>
                <div className={styles.cellphoneContainer}>
                    <div className={styles.movie}>
                        <div className={styles.menu}><i className="material-icons"></i></div>
                        <div className={styles.movieImg}></div>
                        <div className={styles.textMovieCont}>
                            <div className={styles.mrGrid}>
                                <div className={styles.col1}>
                                    <h1>Interstellar</h1>
                                    <ul className={styles.movieGen}>
                                        <li>PG-13  /</li>
                                        <li>2h 49min  /</li>
                                        <li>Adventure, Drama, Sci-Fi</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.mrGrid + " " + styles.summaryRow}>
                                <div className={styles.col2}>
                                    <h5>SUMMARY</h5>
                                </div>
                                <div className={styles.col2}>
                                    <ul className={styles.movieLikes}>
                                        <li><i className="material-icons">&#xE813;</i>124</li>
                                        <li><i className="material-icons">&#xE813;</i>3</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.mrGrid}>
                                <div className={styles.col1}>
                                    <p className={styles.movieDescription}>A group of elderly people are giving interviews about having lived in a climate of crop blight and constant dust reminiscent of The Great
                                        Depression of the 1930's. The first one seen is an elderly woman stating her father was a farmer, but did not start out that way. </p>
                                </div>
                            </div>
                            <div className={styles.mrGrid + " " + styles.actorsRow}>
                                <div className={styles.col1}>
                                    <p className={styles.movieActors}>Matthew McConaughey, Anne Hathaway, Jessica Chastain</p>
                                </div>
                            </div>
                            <div className={styles.mrGrid + " " + styles.actionRow}>
                                <div className={styles.col2}><div className={styles.watchBtn}><h3><i className="material-icons">&#xE037;</i>WATCH TRAILER</h3></div>
                                </div>
                                <div className={styles.col6 + " " + styles.actionBtn}><svg data-testid={saveIcon}></svg>
                                </div>
                                <div className={styles.col6 + " " + styles.actionBtn}><i>&#xE866;</i>
                                </div>
                                <div className={styles.col6+ " " + styles.actionBtn}><i>&#xE80D;</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="https://dribbble.com/geehm" target="_blank">
                <img className={styles.dribbbleLink} src={url}></img>
            </a>
        </div>
    )
}

export default Main;
