import { useRouter } from "next/router";
import movie from '../../pages/movie_data.json';
import styled from "styled-components";

export default function MovieInfo() {
    const router = useRouter();
    const index = router.query.index;

    if (index != null) {
        let url = "https://image.tmdb.org/t/p/w400";
        let path = movie.movie_data[index].poster_path;
        let title = movie.movie_data[index].title;
        let title_en = movie.movie_data[index].title_en;
        let genre = movie.movie_data[index].genre;
        let overview = movie.movie_data[index].overview;
        let keyword = movie.movie_data[index].keyword;

        return (
            <MovieInfoWrapper>
                <div className="container">
                    <div className="poster"><img src={url+path} /></div>
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
                                <img src={url+path} />
                            </div>
                            <div>
                                <img src={url+path} />
                            </div>
                            <div>
                                <img src={url+path} />
                            </div>
                        </div>
                    </div>
                </div>
            </MovieInfoWrapper>
        )
    }
}

const MovieInfoWrapper = styled.div`
    background: #000;
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