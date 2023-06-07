import styled from "styled-components";
import MovieCard from "./common/CfMovieCard";

export default function HomeMovieCard({ title, lists }) {
    return (
        <HomeMovieCardWrapper>
            <div className="container">
                <p>{title}</p>
                <div className="movieBox">
                    {lists.map((list, i) => {
                        return (
                            <MovieCard
                                key={i}
                                index={list.index}
                                id={list.id}
                                title={list.title}
                                poster_path={list.poster_path}
                            />
                        );
                    })}
                </div>
            </div>
        </HomeMovieCardWrapper>
    );
}

const HomeMovieCardWrapper = styled.div`
  margin-top: 5rem;

  p {
    font-size: 2.8rem;
    font-weight: 900;
    margin-bottom: 2.5rem;
  }

  .movieBox {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  /* 영화 카드의 이미지 크기 수정 */
  .movieBox img {
    height: 60rem;
    width: 37rem;
  }
`;