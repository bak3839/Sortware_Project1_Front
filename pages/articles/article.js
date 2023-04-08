import styles from '@/styles/Home.module.css'
import React from 'react';
import movie from '../movie_data.json'

export default function Article(){
    return(
        <div>
            <Card id={123}></Card>
            <Card id={420}></Card>
            <Card id={532}></Card>
            <Card id={2351}></Card>
            <Card id={1112}></Card>
        </div>
    )
}

function Card(props) {
    let url = "https://image.tmdb.org/t/p/w200";
    let path = movie.movie_data[props.id].poster_path;
    let title = movie.movie_data[props.id].title;
    let id = 1;

    // for(let i = 0; i < movie.movie_data.length;i++){
    //     if(movie.movie_data[i].title == id) {
    //         path = movie.movie_data[i].poster_path;
    //         break;
    //     }
    // }

    return (
        <div className={styles.card}>
            <img src={url+path}></img>
            <p>{title}</p>
        </div>
    )
}