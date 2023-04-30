import styled from "styled-components";
import MovieCard from "./common/MovieCard";

export default function HomeMovieCard ({
    title,
    lists
}){
    return (
        <HomeMovieCardWrapper>
            <div className="container">
                <p>{title}</p>
                <div className="movieBox">
                    {lists.map((list,i)=>{
                        return (
                            <MovieCard key={i} index={list.index} id={list.id} title={list.title} poster_path={list.poster_path} />
                        )
                    })}
                </div>
            </div> 
      </HomeMovieCardWrapper>
    )
}

const HomeMovieCardWrapper = styled.div`
    margin-top: 5rem;
    p{
        font-size: 2.8rem;
        font-weight: 900;
        margin-bottom: 2.5rem;
    }
    .movieBox{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
    }
`