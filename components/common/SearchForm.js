import styles from '@/styles/Home.module.css';
import styled from 'styled-components';
import movie from '../../pages/movie_data_final.json';
import disney from '../../pages/Disney.json';
import marvel from '../../pages/Marvel.json';
import pixar from '../../pages/Pixar.json';
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
    let genre;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if (movie.movie_data[i].title.includes(search_title)) {
            let data = movie.movie_data[i];
            
            id = data.id;
            title = data.title;
            poster_path = data.poster_path;
            rating = data.vote_count;
            genre = data.genre;

            list.push({ rating: rating, id: id, index: i, title: title, poster_path: poster_path, genre: genre });
        }
    }

    list.sort(function(a, b){
        return b.rating - a.rating;
    });

    const genreTypeList = list[0].genre.split(",");
    const genreList = Array.from({ length: genreTypeList.length }, () => []);

    for (let j = 0; j < genreTypeList.length; j++) {
        for (let i = 0; i < movie.movie_data.length; i++) {
            if (movie.movie_data[i].genre.includes(genreTypeList[j])) {
                const { id, title, genre, poster_path, vote_count } = movie.movie_data[i];
                genreList[j].push({ rating: vote_count, id: id, index: i, title: title, poster_path: poster_path });
            }
        }

        genreList[j].sort(function (a, b) {
            return b.rating - a.rating;
        });

        genreList[j] = genreList[j].slice(0, 10);
        console.log(genreList[j]);
    }

    return {list, genreList, genreTypeList};
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
            setPageBtn(false);
            setProductCode(null);
            setCurrentMovies(null);
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
    const [genreCode, setGenreCode] = useState(null);
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

        setMovielist(null);
        setProductCode(null);

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
        setGenreCode(genreBasedSearch(movieIndex));
        
    }
    // ------------------------- 카테고리 선택 --------------------------//

    

    // --------------------------- 제작사 선택--------------------------------//

    const [productCode, setProductCode] = useState(null);
    const [productId, setProducId] = useState(0);
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, name: "디즈니", checked: false },
        { id: 2, name: "마블", checked: false },
        { id: 3, name: "픽사", checked: false },
    ]);

    // 체크박스 선택시 다른 체크박스 선택 취소(단일 선택하게 만듬)
    const handleCheckboxChange = (changedCheckboxId) => {
        const updatedCheckboxes = checkboxes.map((checkbox) => {
            if (checkbox.id === changedCheckboxId) {
                return { ...checkbox, checked: true };
            } else {
                return { ...checkbox, checked: false };
            }
        });

        setProducId(changedCheckboxId);
        setCheckboxes(updatedCheckboxes);
    };

    const productSearch = () => {
        let cnt = 0;

        for(let i = 0; i < 3; i++){
            if(checkboxes[i].checked) cnt++;
        }
        if(cnt == 0) return;

        setMovielist(null);
        setCurrentMovies(null);

        let result = [];
        let data;

        if(productId == 1) data = disney.data;
        else if(productId == 2) data = marvel.data;
        else if(productId == 3) data = pixar.data;
        
        let movieData = movie.movie_data;

        for(let i =0; i < data.length; i++){
            let index = data[i].index;
            let now = movieData[index];

            let rating = now.vote_count;
            let id = now.id;
            let title = now.title;
            let poster_path = now.poster_path;

            result.push({ rating: rating, id: id, index: index, title: title, poster_path: poster_path});
        }

        result.sort(function(a, b){
            return b.rating - a.rating;
        });

        setPageBtn(null);
        setProductCode(result);
    }
    // --------------------------- 제작사 선택--------------------------------//

    //TODO: 최근에 추가한 영화가 있는 페이지에 가면 계속 남아있음

    // ------------------- 영화 30개씩 페이지 나누기 ---------------//
    const moviePerPage = 30;
    const [pageBtn, setPageBtn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMovies, setCurrentMovies] = useState([]);
    const [pageNum, setPageNum] = useState([]);
    
    const [totalMovies, setTotalMovies] = useState(0);
    const [btnStart, setBtnStart] = useState(1);
    // const [maxPage, setMaxPage] = useState(100);
    
    let indexOfLastMovie = currentPage * moviePerPage;
    let indexOfFirstMovie = indexOfLastMovie - moviePerPage;
    let left = '<';
    let right = '>';

    const buttonArray = (num) => {
        const button = [];
        //maxPage = Math.ceil(parseInt(totalMovies) / parseInt(moviePerPage));
        //setMaxPage(Math.ceil(parseInt(totalMovies) / parseInt(moviePerPage)));
        console.log(totalMovies);

        for (let i = (num - 1) * 5 + 1; i <= num * 5 && i <= Math.ceil(parseInt(totalMovies) / parseInt(moviePerPage)); i++) {
            if (i == currentPage) {
                button.push(
                    <button onClick={() => jumpToPage(i)} className="btnCur">
                        {i}
                    </button>
                );
            } else {
                button.push(
                    <button onClick={() => jumpToPage(i)} className="btn">
                        {i}
                    </button>
                );
            }
        }
        return button;
    };

    // 영화 리스트 변경시 totalMovies 값 변경
    // useEffect(() => {
    //     setTotalMovies(movielist?.list.length);
    //     setCurrentPage(1);       
    // },[movielist])
    useEffect(() => {
        setTotalMovies(genreCode?.length);
        setCurrentPage(1);
        console.log(genreCode);       
    },[genreCode])

    // 페이지 변경시 currentMovies에 해당 페이지에 들어갈 30개 영화 리스트에서 슬라이스

    // useEffect(() => {
    //     if(movielist == null) return;

    //     indexOfLastMovie = currentPage * moviePerPage;
    //     indexOfFirstMovie = indexOfLastMovie - moviePerPage;
    //     setCurrentMovies(movielist?.list.slice(indexOfFirstMovie, indexOfLastMovie));

    //     setBtnStart(currentPage / 5); // 버튼 시작 1~5 / 6~10 까지 표시하기 위함    
    // },[currentPage, movielist]); 
    useEffect(() => {
        if(genreCode == null) return;
        setCurrentMovies(null);

        indexOfLastMovie = currentPage * moviePerPage;
        indexOfFirstMovie = indexOfLastMovie - moviePerPage;

        setCurrentMovies(genreCode.slice(indexOfFirstMovie, indexOfLastMovie));
        console.log(currentMovies);
        setBtnStart(currentPage / 5); // 버튼 시작 1~5 / 6~10 까지 표시하기 위함    
    },[currentPage, genreCode]); 

    // 함수를 실행 시켜서 버튼태그가 담긴 배열 가져오기 매개변수로 시작 버튼 번호 넘기기
    useEffect(() => {
        const buttons = buttonArray(Math.ceil(btnStart));
        setPageNum(buttons); 
    },[btnStart, totalMovies]);
    
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
                        <div>
                            <button style={{ fontSize: "20px" }} onClick={genreSearch}>검색</button>
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
                            {checkboxes.map((checkbox) => (
                                <span>
                                    <input
                                        type="checkbox"
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(checkbox.id)}
                                    />
                                    <label htmlFor={checkbox.name}>{checkbox.name}</label>
                                </span>
                                
                            ))}
                        </div>
                        <div>
                            <button style={{ fontSize: "20px"}} onClick={productSearch}>검색</button>
                        </div>
                    </li>
                </ul>
                {/* <button style={{ fontSize: "20px" }} onClick={genreSearch}>검색</button> */}
            </div>

            <div className="movieBox container">
                {currentMovies?.map((m) => (
                    <MovieCard key={m.id} index={m.index} title={m.title} poster_path={m.poster_path} />
                ))}
            </div>

            <div className='movieBox container'>
                {movielist?.list?.map((m) => (
                    <MovieCard key={m.id} index={m.index} title={m.title} poster_path={m.poster_path} />
                ))}
            </div>

            <div className='movieBox container'>
                {productCode?.map((m) => (
                    <MovieCard key={m.id} index={m.index} title={m.title} poster_path={m.poster_path} />
                ))}
            </div>
           
            {movielist?.genreList.map((item, idx) => (<>
                <h1 className='container' style={{ padding: "0 20px", margin: "30px auto", fontSize: "30px" }}>{movielist.genreTypeList[idx]}</h1>
                <div className='movieBox container'>
                    {item.map((m) => (
                        <MovieCard key={m.id} index={m.index} title={m.title} poster_path={m.poster_path} />
                    ))}
                </div>
                
                {/* <div className="movieBox container">{item.slice(0, 10)}</div> */}
            </>))}

            {pageBtn ? <div className="btnBox">
                <button onClick={prevPage} className='btnShift'>{left}</button>
                <span className='btnLine'>{pageNum}</span>
                <button onClick={nextPage} className='btnShift'>{right}</button>
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
    .btnBox{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        margin-top: 5rem;
        gap: 0.5625rem;
        
    }
    .btnLine{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        flex-wrap: wrap;
        row-gap: 0.5625rem;
    }
    .btnShift{
        position: relative;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        min-width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        background-color: rgba(215, 226, 235, 0.5);
        border:0;
        &:hover{
            background-color: rgb(105, 104, 104);
        }
    }
    .btn {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        height: 3.6rem;
        padding: 0.3125rem 0.375rem;
        min-width: 3.6rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: rgb(38, 55, 71);
        background-color: rgba(215, 226, 235, 0.5);
        white-space: nowrap;
        border:0;
        &:hover{
            background-color: rgb(105, 104, 104);
        }       
    }
    .btnCur{
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        height: 3.6rem;
        padding: 0.3125rem 0.375rem;
        min-width: 3.6rem;
        text-align: center;
        font-size: 1.5rem;
        white-space: nowrap;
        position: relative;
        z-index: 2;
        font-weight: 700;
        color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 0.25rem 0.625rem;
        background-color: rgb(0, 0, 0);
        border-radius: 0.375rem !important;
    }
`

export default SearchForm;