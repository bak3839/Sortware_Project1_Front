import { useRouter } from "next/router";
import movie from '../../pages/movie_data.json';
import actor from '../../pages/actor_data.json';
import styled from "styled-components";

function Topbox(props){
    return(
        <div className="top_box">
            <img src={props.poster}></img>
            <div className="info_box">
                <div><p className="title">{props.title}</p></div>
                <div><p className="genre">{props.title_en} | {props.genre}</p></div>
                <hr></hr>
                <div><p className="grade">평점 {props.aver} | 추천수 {props.count}</p></div>
                <hr></hr>
            </div>
        </div>
    )
}

export default function MovieInfo() {
    //const router = useRouter();
    const index = 4117;

    if (index != null) {
        let data = movie.movie_data[index];
        let url = "https://image.tmdb.org/t/p/w400";
        let path = data.poster_path;
        let backdropPath = '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg';
        let title = data.title;
        let title_en = data.title_en;
        let genre = data.genre;
        let aver = data.vote_aver;
        let count = data.vote_count
        let overview = data.overview;
        let keyword = data.keyword;

        let ac_data = actor.actor_data;
        let actorId = [];
        let actorPath = [];

        actorId.push(data['cast/0/actor_id']);
        actorId.push(data['cast/1/actor_id']);
        actorId.push(data['cast/2/actor_id']);

        for(let i = 0; i < actorId.length; i++) {
            let now = actorId[i];

            for(let j = 0; j < ac_data.length; j++){
                if(ac_data[j].actor_id == now){
                    actorPath.push(ac_data[j].profile_path);
                    break;
                }
            }
        }

        return (
            <MovieInfoWrapper>
                <style jsx global>
                {
                    `
                    body {
                        background: linear-gradient(rgba(30, 27, 38, 0.95), rgba(30, 27, 38, 0.95)), url(${url+path});
                        background-position: center;
                        background-size: cover;
                        background-repeat: repeat;
                        backface-visibility: hidden;
                        transform: translateZ(0);
                    }
                    `
                }
                </style>
                <Topbox poster={url + path} title={title} 
                title_en={title_en} genre={genre} aver={aver} count={count}></Topbox>
            </MovieInfoWrapper>
        )
    }
}

const MovieInfoWrapper = styled.div`
    image-rendering: -webkit-optimize-contrast; /* chrome */ 
    .top_box {
        width: 1200px;
        margin:0 auto;
        position: relative;
        padding: 40px 0px;
        
        img{
            float: left;
            width: 220px; // 190
            height: 320px; // 280
            margin-right:30px;
        }
        hr{           
            color: rgb(105, 104, 104);
        }
        .title{
            font-size: 28px;
            font-weight: 700;
            // color: white;
        }
        .genre{
            margin-top: 14px;
            margin-bottom: 14px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(105, 104, 104);
        }
        .grade{
            margin-top: 14px;
            margin-bottom: 14px;
            font-size: 18px;
            font-weight: 700;
            // color: white;
        }
        .info_box{
            width: 100%;
        }
    }
`