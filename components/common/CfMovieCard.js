import styled from "styled-components";

export default function MovieCard(props) {
    let url = "https://image.tmdb.org/t/p/w400";
    let path = props.poster_path;
    let index = props.index;
    let page = "/infos/" + index;

    return (
        <MovieCardStyled id={index}>
            <a href={page} target="_blank">
                <div className="De">
                    <div className="img">
                        <img src={url + path} alt="Movie Poster" />
                    </div>
                    <p className="title">{props.title}</p>
                </div>
            </a>
        </MovieCardStyled>
    );
}

const MovieCardStyled = styled.div`
  position: relative;
  a {
    color: #000;
  }
  img {
    width: 100%;
    height: 30rem;
    border: 1px solid #ececec;
  }
  .De .title {
    margin-top: 0.5rem;
    font-size: 3rem;
    font-weight: 800;
  }
  &:hover {
    top: -3px;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
  }
`;
