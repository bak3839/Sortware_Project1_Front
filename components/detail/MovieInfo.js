import { useRouter } from "next/router";
import movie from '../../pages/movie_data.json';
import actor from '../../pages/actor_data.json';
import styled from "styled-components";

export default function MovieInfo() {
    const router = useRouter();
    const index = router.query.index;

    if (index != null) {
        let data = movie.movie_data[index];
        let url = "https://image.tmdb.org/t/p/w400";
        let path = data.poster_path;
        let title = data.title;
        let title_en = data.title_en;
        let genre = data.genre;
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
                {/* <style jsx global>
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
                </style> */}
                <div className="container">
                    <div className="poster"><img src={url + path} /></div>
                    <div className="info">
                        <h1>{title}</h1>
                        <ul>
                            <li>{title_en} /</li>
                            <li>2h 49min  /</li>
                            <li>{genre}</li>
                        </ul>
                        <h5>SUMMARY</h5>
                        <p className="overview">{overview}</p>
                        <p className="actor">Matthew McConaughey, Anne Hathaway, Jessica Chastain</p>
                        <div className="actorImg">
                            <div>
                                <img src={url + actorPath[0]} />
                            </div>
                            <div>
                                <img src={url + actorPath[1]} />
                            </div>
                            <div>
                                <img src={url + actorPath[2]} />
                            </div>
                        </div>
                    </div>
                </div>
            </MovieInfoWrapper>
        )
    }
}

const MovieInfoWrapper = styled.div`
    background:#000;
    padding: 5rem 0;
    >div{
        display: flex;
        justify-content: space-between;
        >div{
            width: 50%;
        }
        .poster{
            width: 40%;
        }
        .info{
            width: calc(60% - 2rem);
            color: #fff;
            
            h1{
                font-size: 3.2rem;
                margin-left: -0.4rem;
            }
            ul{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin: 1.2rem 0 2.5rem;
                opacity: 0.8;

                li{
                    margin-left: 0.5rem;
                    font-size: 1.6rem;
                    &:first-child{
                        margin-left: 0;
                    }
                }
            }
            h5{
                font-size: 2rem;
            }
            p{
                margin: 1rem 0 3rem;
                font-size: 1.4rem;
                line-height: 1.8;
                opacity: 0.8;

                &.actor{
                    margin-bottom: 1.5rem;
                }
            }
            .actorImg{
                display: flex;
                justify-content: space-between;
                align-items: center;
                >div{
                    width: calc(33% - 1rem);
                }
            }
        }    
    }
`