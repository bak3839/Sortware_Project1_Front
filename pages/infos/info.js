import styles from '@/styles/Home.module.css'
import React from 'react';
import movie from '../movie_data.json'

function Main() {
    return (
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
    let id = props.id;
    let page = '/infos/' + id;

    return (
        <a href={page}>
            <div className={styles.card}>
                <img className={styles.image} src={url + path}></img>
                <p>{title}</p>
            </div>
        </a>
    )
}

export default Main;