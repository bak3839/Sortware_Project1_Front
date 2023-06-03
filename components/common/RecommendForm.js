import styled from 'styled-components';
import movie from '../../pages/movie_data.json';
import { useState, useEffect, useRef, React } from 'react';
import useDebounce from '@/pages/infos/useDebounce';
import MovieCard from './MovieCard';
import axios from "axios";

/**
 * 제목으로 연관 영화 검색해서 미리보기 리스트 반환
 * @param {*} title
 */
function searchList(title) {
    let list = [];
    let cnt = -1;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if(cnt > 9) break;

        if (movie.movie_data[i].title.includes(title)) {
            cnt = cnt + 1;

            let page = '/infos/' + i;
            let title = movie.movie_data[i].title;
            list.push([page, title]);
        }
    }

    return list;
}

function SummaryBased(moviedata){
    if(moviedata == null) return null;

    let list = [];
    let title;
    let poster_path;
    let id;

    for (let i = 0; i < 10; i++) {
        id = moviedata[i];

        for (let j = 0; j < movie.movie_data.length; j++) {
            if (movie.movie_data[j].id == id) {

                let data = movie.movie_data[j];
                title = data.title;
                poster_path = data.poster_path;

                list.push(<MovieCard key={id} index={j} id={id} title={title} poster_path={poster_path} />);
                break;
            }
        }
    }
    console.log(list);

    list = <div className='container'>
        <p>줄거리 기반 추천 영화</p>
        <div className='movieBox'>
            {list}
        </div>
    </div>
    return list;
}

function KeywordBased(moviedata){
    if(moviedata == null) return null;

    let list = [];
    let title;
    let poster_path;
    let id;

    for (let i = 10; i < 20; i++) {
        id = moviedata[i];

        for (let j = 0; j < movie.movie_data.length; j++) {
            if (movie.movie_data[j].id == id) {

                let data = movie.movie_data[j];
                title = data.title;
                poster_path = data.poster_path;

                list.push(<MovieCard key={id} index={j} id={id} title={title} poster_path={poster_path} />);
                break;
            }
        }
    }
    console.log(list);

    list = <div className='container'>
        <p>키워드 기반 추천 영화</p>
        <div className='movieBox'>
            {list}
        </div>
    </div>

    return list;
}

function RecommendForm() {
    const [flag, setFlag] = useState(true);
    const [title, setTitle] = useState("");
    const [movieId, setMovieId] = useState(null);
    const [list, setList] = useState(null);
    const [movielist, setMovielist] = useState(null);
    const [idx, setIdx] = useState(-1);
    const [notDebounce, setnotDebounce] = useState(false);
    const [recommendFlag, setRecommendFlag] = useState(true);
    const inputRef = useRef();
    const ulRef = useRef(null);

    const debounceValue = useDebounce(title);

    const [moviedata, setMovieData] = useState([]); // 추천id값을 배열로 받음

    // target이 inputRef이 등록된 하위 컨테이너가 아닐때 실행
    const handleClickOutside = ({ target }) => {
        if (flag && !inputRef.current.contains(target)) {
            setFlag(true);
        }
        setIdx(-1);
        setnotDebounce(false);
    };

    // 미리보기 리스트와 검색창을 제외한 다른 화면을 클릭하면 미리보기가 닫힘
    useEffect(() => {
        //inputRef.current.focus();
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 디바운스를 이용하여 검색 리스트를 띄우는데 딜레이를 주어
    // 엔터 입력이 없어도 자동으로 미리보기 리스트를 띄워준다.
    useEffect(() => {
        const getMovies = async () => {
            setList(searchList(debounceValue));
            setFlag(false);
        }
        if (debounceValue && !notDebounce) getMovies();
    }, [debounceValue]);

    useEffect(() => {
        if(list != null) {
            setFlag(false);
        }
    }, [list])

    useEffect(() => {
        if(idx < 0) return;
        setTitle(list[idx][1]);
        setnotDebounce(true);
    },[idx])

    function handleKeyDown(e) {
        const { key } = e;
        const listItems = ulRef.current.childElementCount ? ulRef.current.childElementCount:null;
        if(listItems == null) return;

        let nextIdx = 0;

        if (key == 'ArrowDown') {
            e.preventDefault();

            nextIdx = idx + 1;
            if (nextIdx >= listItems) {
                nextIdx = 0;
            }
            setIdx(nextIdx);
        }

        else if (key == 'ArrowUp') {
            e.preventDefault();

            nextIdx = idx - 1
            if (nextIdx < 0) {
                nextIdx = listItems - 1;
            }
            setIdx(nextIdx);
        }
    }

    const [lists, setLists] = useState(null);
    const [lists2, setLists2] = useState(null);

    // 임의 배열 주석 처리 해주기
    // let moviedata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    useEffect(() => {
        if(movieId == null){
            return;
        }
        async function fetchRecommendations(movieId) {

            try {
                const res = await axios.get('http://localhost:8080/search/recommand?Movieid=' + movieId);
                //console.log(res.data); // 출력
                setMovieData(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRecommendations(movieId);
    },[movieId]);

    useEffect(() => {
        if (moviedata.length == 0) {
            return;
        }
        setRecommendFlag(false); // 밑에 컴포넌트 나오게 하는 변수

        // 각 추천 영화 jsx 코드로 반환
        setLists(SummaryBased(moviedata));
        setLists2(KeywordBased(moviedata));
    }, [moviedata])

    const OnKeyDown = (e) => {
        if(e.key == 'Enter') {
            // 여기서 test 함수 실행 하고 216번째 줄 주석 처리 하면 됨
            for (let i = 0; i < movie.movie_data.length; i++) {
                if (movie.movie_data[i].title == e.target.value) {
                    setMovieId(movie.movie_data[i].id)
                    break;
                }
            }
        }
        else if(e.key == 'ArrowDown' || e.key == 'ArrowUp'){
            handleKeyDown(e);
        }
        else {
            setIdx(-1);
            setnotDebounce(false);
        }
    }
    const onChange = (e) => {
        setTitle(e.target.value);
        if(e.target.value == ""){
            setFlag(true);
        }
    }

    const onClick = (e)=> {
        if(e.target.value == ""){
            setFlag(true);
        }
        else {
            setList(searchList(e.target.value));
        }
    }

    useEffect(()=>{
        console.log(flag)
    },[flag])

    return (
        <SearchFormWrapper>
            <div className='searchBox'>
                <div className="container">
                    <span>
                        <input
                            type='text'
                            key={100}
                            value={title}
                            ref={inputRef}
                            placeholder='재미있게 본 영화 입력'
                            onKeyDown={(e) => OnKeyDown(e)}
                            onChange={(e) => onChange(e)}
                            onClick={(e) => onClick(e)}
                        />
                    </span>

                    {flag ? null :
                        <div className='list'>
                            <ul ref={ulRef}>
                                {list.map((item, index) => (
                                    <li key={index}>
                                        <a href={item[0]} className={idx == index ? "active" : ""}>{item[1]}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </div>
            <div className="movieBox container">
                {movielist}
            </div>
            {recommendFlag ? null :
                <CardWrapper>
                    <div>
                        {lists} {/*줄거리 기반*/}
                        {lists2} {/*키워드 기반*/}
                    </div>
                </CardWrapper>}

        </SearchFormWrapper>
    )
}

const CardWrapper = styled.div`
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

const SearchFormWrapper = styled.div`
  width: 100%;
  .searchBox{
    padding: 2rem 0;
    background: #000;
    >.container{
      position: relative;
      input{
        width: 100%;
        height: 5rem;
        padding: 0 2rem;
        border: none;
        font-size: 1.6rem;
        font-weight: 900;

        justify-content: right;
        align-items: right;
      }

      .list{
        width: 100%;
        li{
          background: #ececec;
          a{
            display: block;
            width: 100%;
            padding: 1.5rem 2rem;
            font-size: 1.4rem;
            color: #000;
            &.active,
            &:hover{
              background: #999;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .filter{
    border: 1px solid #999;
    margin: 5rem 0;
    li{
      padding: 2rem;
      font-size: 1.8rem;
      font-weight: 900;
      border-bottom: 1px solid #999;
      p{
        font-size: 1.4rem;
        color: #999;
      }
      div{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 1.2rem;
        span{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          input{
            width: 2rem;
            height: 2rem;
            margin-right: 1rem;
            transform: translateY(1px);
            cursor: pointer;
          }
          label{
            font-size: 1.8rem;
            margin-right: 2rem;
            cursor: pointer;
          }
        }
      }
      &:last-child{
        border: none
      }
    }
  }
  .movieBox{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem
  }

`

export default RecommendForm;