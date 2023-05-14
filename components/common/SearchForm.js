import styles from '@/styles/Home.module.css';
import styled from 'styled-components';
import movie from '../../pages/movie_data.json';
import { useState, useEffect, useRef, React } from 'react';
import useDebounce from '@/pages/infos/useDebounce';
import MovieCard from './MovieCard';

function find(search_title) {
    if(search_title == null) return null;

    let list = [];
    let title;
    let poster_path;
    let id;
    let rating;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if (movie.movie_data[i].title.includes(search_title)) {
            let data = movie.movie_data[i];
            
            id = data.id;
            title = data.title;
            poster_path = data.poster_path;
            rating = data.vote_count;

            list.push({ rating: rating, id: id, index: i, title: title, poster_path: poster_path });
        }
    }

    list.sort(function(a, b){
        return b.rating - a.rating;
    });

    return list;
} 
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

function genreBasedSearch(movieIndexs){
    if(movieIndexs.length == 0) return;

    let list = [];
    let title;
    let poster_path;
    let id;
    let rating;

    for (let i = 0; i < movieIndexs.length; i++) {
        let index = movieIndexs[i];
        let data = movie.movie_data[index];

        id = data.id;
        title = data.title;
        poster_path = data.poster_path;
        rating = data.vote_count;

        list.push({ rating: rating, id: id, index: index, title: title, poster_path: poster_path });

        //list.push(<MovieCard key={id} index={index} id={id} title={title} poster_path={poster_path} />);
    }
    
    list.sort(function(a, b){
        return b.rating - a.rating;
    });

    return list;
}

function SearchForm() {
    const [flag, setFlag] = useState(true);
    const [title, setTitle] = useState("");
    const [list, setList] = useState(null);
    const [movielist, setMovielist] = useState(null);
    const [idx, setIdx] = useState(-1);
    const [notDebounce, setnotDebounce] = useState(false);

    const inputRef = useRef();
    const ulRef = useRef(null);

    const debounceValue = useDebounce(title);

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

    const onKeyDown = (e) => {
        if(e.key == 'Enter') {
            setPageBtn(true);
            setMovielist(find(title));
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

    // --------------------------- 장르 선택--------------------------------//
    const genre = ['범죄','드라마','액션','스릴러','SF','멜로','다큐멘터리','로맨스','코미디','가족','판타지','미스터리','공포','어드벤처','전쟁','사극','서부극','애니메이션'];
    let code1 = [];
    let code2 = [];

    // onChange함수를 사용하여 체크박스 상태관리
    const [checkedList, setCheckedList] = useState([]);
    
    const onCheckedElement = (checked, item) => {
        console.log(item)

        if (checked) {
            setCheckedList([...checkedList, item]);
        } else if (!checked) {
            setCheckedList(checkedList.filter(el => el !== item));
        }
    };

    for(let i = 0; i < 9; i++) {
        let now = genre[i];
        code1.push(
        <span>
            <input name="genre" id={now} type='checkbox' onChange={e => {
                onCheckedElement(e.target.checked, e.target.id);
            }}/>
            <label htmlFor={now}>{now}</label>
        </span>)
    }

    for(let i = 9; i < 18; i++) {
        let now = genre[i];
        code2.push(
        <span>
            <input name="genre" id={now} type='checkbox' onChange={e => {
                onCheckedElement(e.target.checked, e.target.id);
            }}/>
            <label htmlFor={now}>{now}</label>
        </span>)
    }
    // --------------------------- 장르 선택--------------------------------//

    /**
     * 선택된 장르 기반으로 영화 검색
     * @param {*} e 
     */
    const genreSearch = (e) => {
        if (checkedList.length == 0) return;

        let movieIndex = []; // 처음 장르가 포함된 영화의 인덱스
        let tmp = [];
        let genre = checkedList;
        console.log(genre);

        for (let i = 0; i < movie.movie_data.length; i++) {
            let data = movie.movie_data[i];

            if (data.genre.includes(genre[0])) {
                movieIndex.push(data.index);
            }
        }

        for (let i = 1; i < genre.length; i++) {
            tmp = movieIndex;

            for (let j = 0; j < movieIndex.length; j++) {
                let index = movieIndex[j];
                let data = movie.movie_data[index].genre;

                if (!data.includes(genre[i])) {
                    tmp = tmp.filter(now => now != index)
                }
            }
            movieIndex = tmp;
            tmp = [];
        }
        setPageBtn(true);
        setMovielist(genreBasedSearch(movieIndex));
    }

    // ------------------- 영화 30개씩 페이지 나누기 ---------------//
    const moviePerPage = 30;
    const [pageBtn, setPageBtn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMovies, setCurrentMovies] = useState([]);
    const [pageNum, setPageNum] = useState([]);
    
    const [totalMovies, setTotalMovies] = useState(0);
    let indexOfLastMovie = currentPage * moviePerPage;
    let indexOfFirstMovie = indexOfLastMovie - moviePerPage;

    // 페이지 변경시 currentMovies에 해당 페이지에 들어갈 30개 영화 리스트에서 슬라이스
    useEffect(() => {
        if(movielist == null) return;

        let button = [];
        indexOfLastMovie = currentPage * moviePerPage;
        indexOfFirstMovie = indexOfLastMovie - moviePerPage;
        setCurrentMovies(movielist?.slice(indexOfFirstMovie, indexOfLastMovie));       
    },[currentPage, movielist]);

    // 영화 리스트 변경시 totalMovies 값 변경
    useEffect(() => {
        setTotalMovies(movielist?.length);
    }, [movielist])
    
    const nextPage = () => {     
        if (currentPage <= parseInt(totalMovies) / parseInt(moviePerPage)) {
            console.log("next");
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const jumpToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };     

    return (
        <SearchFormWrapper>
            <div className='searchBox'>
                <div className="container">
                    <input 
                        type='text' 
                        key={100} 
                        value={title} 
                        ref={inputRef} 
                        placeholder='영화 제목 입력' 
                        onKeyDown={(e) => onKeyDown(e)} 
                        onChange={(e) => onChange(e)}
                        onClick={(e) => onClick(e)} 
                    />
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
            <div className='container'>
                <ul className="filter">
                    <li>
                        <p>장르</p>
                        <div>
                            {code1}
                        </div>
                        <div>
                            {code2}
                        </div>
                    </li>
                    <li>
                        <p>카테고리</p>
                        <div>
                            <span>
                                <input name="category" id="meta" type='checkbox' />
                                <label htmlFor='meta'>메타버스</label>
                            </span>
                            <span>
                                <input name="category" id="alien" type='checkbox' />
                                <label htmlFor='alien'>외계</label>
                            </span>
                        </div>
                    </li>
                    <li>
                        <p>제작사</p>
                        <div>
                            <span>
                                <input name="maker" id="marvel" type='checkbox' />
                                <label htmlFor='marvel'>마블</label>
                            </span>
                            <span>
                                <input name="maker" id="desiny" type='checkbox' />
                                <label htmlFor='desiny'>디즈니</label>
                            </span>
                        </div>
                    </li>
                </ul>
                <button style={{ fontSize: "20px" }} onClick={genreSearch}>검색</button>
            </div>

            <div className="movieBox container">
                {/* {currentMovies}                */}
                {currentMovies.map((m) => (
                    <MovieCard key={m.id} index={m.index} title={m.title} poster_path={m.poster_path} />
                ))}
            </div>
            {pageBtn ? <div className="container">
                <button style={{ fontSize: "20px" }} onClick={prevPage}>이전 페이지</button>
                {/* {pageNum} */}
                <button style={{ fontSize: "20px" }} onClick={nextPage}>다음 페이지</button>
            </div> : null}
            
        </SearchFormWrapper>        
    )
}

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

export default SearchForm;