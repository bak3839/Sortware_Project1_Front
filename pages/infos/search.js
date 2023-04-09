import styles from '@/styles/Home.module.css'
import movie from '../movie_data.json'
import { useState, useEffect, React } from 'react';
import useDebounce from './useDebounce';

function Card(props) {
    let url = "https://image.tmdb.org/t/p/w200";
    let path = props.poster_path;
    let index = props.index;
    let page = '/infos/' + index;

    return (
        <div className={styles.card_container}>
            <a href={page}>
                <div className={styles.card}>
                    <img className={styles.image} src={url + path}></img>
                    <p>{props.title}</p>
                </div>
            </a>
        </div>
    )
}


function find(search_title) {
    let list = [];
    let title;
    let poster_path;
    let id;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if (movie.movie_data[i].title.includes(search_title)) {
            
            id = movie.movie_data[i].id;
            title = movie.movie_data[i].title;
            poster_path = movie.movie_data[i].poster_path;

            list.push(<Card key={id} index={i} id={id} title={title} poster_path={poster_path}></Card>);
        }
    }

    return list;
}
/**
 * 제목으로 연관 영화 검색해서 미리보기 리스트 반환
 * @param {*} title 
 */
function searchList(title) {
    let list = [];
    let cnt = 0;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if(cnt > 10) break;

        if (movie.movie_data[i].title.includes(title)) {
            cnt = cnt + 1;

            let page = '/infos/' + i;           
            let title = movie.movie_data[i].title;
            list.push(<a href={page}><li key={i}>{title}</li></a>);
        }
    }

    return (
        <div className={styles.list}>
            <ul key={1}>
                {list}
            </ul>
        </div>
    )
}

function Main() {
    const [flag, setFlag] = useState(true);
    const [title, setTitle] = useState("");
    const [list, setList] = useState(null);
    const [movie, setMovie] = useState(null);

    const debounceValue = useDebounce(title);

    useEffect(() => {
        const getMovies = async () => {
            console.log(debounceValue);
            setList(searchList(debounceValue));
            setFlag(false);
        }
        if (debounceValue) getMovies();
    }, [debounceValue]);

    return (
        <div className={styles.test}>
            <div className={styles.search}>
                <div className={styles.searchBox}>
                    <input type='text' value={title} className={styles.textBox} placeholder='영화 제목 입력' onChange={(e) => {
                        setTitle(e.target.value);
                    }}></input>
                    <button className={styles.btn3d} onClick={() => {
                        setMovie(find(title));
                        setFlag(false);
                    }}>검색</button>
                    {flag ? null : list}
                </div>
            </div>              

            <div className={styles.container}>
                <div className={styles.grid}>
                    {flag ? <h1>영화 정보가 표시됩니다.</h1> : movie}
                    {/* {title ? list : <h1>영화 정보가 표시됩니다.</h1>} */}
                </div>
            </div>

        </div>
    )
}

export default Main;