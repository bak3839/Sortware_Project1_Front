import { useRouter } from 'next/router'
import movie from '../movie_data.json'
import styles from '@/styles/Info.module.css'

function Info() {
    const router = useRouter();
    const id = router.query.id;
    console.log(id)

    if (id != null) {
        let url = "https://image.tmdb.org/t/p/w300";
        let path = movie.movie_data[id].poster_path;
        let title = movie.movie_data[id].title;
        let genre = movie.movie_data[id].genre;
        let keyword = movie.movie_data[id].keyword;

        return (
            <div>
                <div className={styles.block}><img src={url+path}></img></div>
                <div className={styles.test}>
                    <div className={styles.div1}>제목: {title}</div>
                    <div className={styles.div1}>장르: {genre}</div>
                    <div className={styles.div1}>키워드: {keyword}</div>
                    <div className={styles.div2}>줄거리: {movie.movie_data[id].overview}</div>
                </div>
            </div>
        )
    }
}

export default function MovieId() {
    return (
        <>            
            <Info></Info>
        </>
    )
}
