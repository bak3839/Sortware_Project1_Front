import styles from '@/styles/Home.module.css'
import React from 'react';
import movie from '../movie_data.json'
import { useState, useEffect } from 'react';

function Card(props) {
    let url = "https://image.tmdb.org/t/p/w200";
    let path = props.poster_path;
    let index = props.index;
    let page = '/infos/' + index;

    return (
        <a href={page}>
            <div className={styles.card}>
                <img className={styles.image} src={url+path}></img>
                <p>{props.title}</p>
            </div>
        </a>
    )
}

function find(search_title) {
    let list = [];
    let title;
    let poster_path;
    let id;
    
    for(let i = 0; i < movie.movie_data.length; i++) {
        if(movie.movie_data[i].title.includes(search_title)) {
            id = movie.movie_data[i].id;
            title = movie.movie_data[i].title;
            poster_path = movie.movie_data[i].poster_path;

            list.push(<Card key={id} index={i} id={id} title={title} poster_path={poster_path}></Card>);
        }
    }

    return list;
}

function Main() {
    const [flag,setFlag] = useState(true);
    const [title, setTitle] = useState("");
    const [list, setList] = useState(null);

    return (
        <div>
            <input type='text' value={title} className={styles.textBox} placeholder='영화 제목 입력' onChange={(e) => {
                console.log(e.target.value);
                setTitle(e.target.value);
            }}></input>

            <button className={styles.btn3d} onClick={() => {
                console.log(title);
                setList(find(title));
                setFlag(false);              
            }}>검색</button>

            <div>
                {flag ? <h1>영화 정보가 표시됩니다.</h1> : list}
            </div>
        </div>
    )
}

export default Main;