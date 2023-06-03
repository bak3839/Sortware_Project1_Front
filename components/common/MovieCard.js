import styled from "styled-components";

export default function MovieCard(props) {
    let url = "https://image.tmdb.org/t/p/w200";
    let path = props.poster_path;
    let index = props.index;
    let page = '/infos/' + index;

    const MovieCard = styled.div`
        position: relative;
        a{
            color: #000;
        }
        img{
            width: 100%;
            height: 30rem;
            border: 1px solid #ececec;
        }
        p{
            margin-top: 0.5rem;
            font-size: 1.4rem;
            font-weight: 800;
        }
        &:hover{
            top: -3px;
            box-shadow: 0 4px 5px rgba(0,0,0,0.2);
        }
    `
    return (
        <MovieCard id ={index}>
            <a href={page} target='_blank'>
                <div>
                    <div class="img">
                        <img src={url + path}></img>
                    </div>
                    <p>{props.title}</p>
                </div>
            </a>
        </MovieCard>
    )
}