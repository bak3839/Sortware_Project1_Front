import styles from '@/styles/test.module.scss'
import { useRouter } from 'next/router'
import movie from '../movie_data.json'

function MovieInfo() {
    //const router = useRouter();
    const index = 4117;
    console.log(index)

    if (index != null) {
        let url = "https://image.tmdb.org/t/p/w400";
        let path = movie.movie_data[index].poster_path;
        let title = movie.movie_data[index].title;
        let title_en = movie.movie_data[index].title_en;
        let genre = movie.movie_data[index].genre;
        let overview = movie.movie_data[index].overview;
        let keyword = movie.movie_data[index].keyword;

        return (
            <div>
                <style jsx global>
                {
                    `
                    body {
                        background: linear-gradient(rgba(30, 27, 38, 0.95), rgba(30, 27, 38, 0.95)), url(${url+path});
                        background-position: center;
                        background-size: cover;
                        background-repeat: repeat;
                    }
                    `
                }
                </style>
                <div className={styles.movieImg}><img src={url+path}></img></div>
                <div className={styles.textMovieCont}>
                    <div className={styles.mrGrid}>
                        <div className={styles.col1}>
                            <h1>{title}</h1>
                            <ul className={styles.movieGen}>
                                <li>{title_en} /</li>
                                <li>2h 49min  /</li>
                                <li>{genre}</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.mrGrid + " " + styles.summaryRow}>
                        <div className={styles.col2}>
                            <h5>SUMMARY</h5>
                        </div>
                    </div>
                    <div className={styles.mrGrid}>
                        <div className={styles.col1}>
                            <p className={styles.movieDescription}>
                                {overview}
                            </p>
                        </div>
                    </div>
                    <div className={styles.mrGrid + " " + styles.actorsRow}>
                        <div className={styles.col1}>
                            <p className={styles.movieActors}>Matthew McConaughey, Anne Hathaway, Jessica Chastain</p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


}

function Main() {
    return (
        <div>
            <style jsx global>
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
                        font-size: 32px;
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
                    `
                }
            </style>
            <div className={styles.container}>
                <div className={styles.cellphoneContainer}>
                    <div className={styles.movie}>
                        {/* <div className={styles.menu}><i className="material-icons"></i></div> */}
                        {/* <div className={styles.movieImg}></div> */}
                        <MovieInfo></MovieInfo>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;