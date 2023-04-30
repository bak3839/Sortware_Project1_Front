import styles from '@/styles/Home.module.css';
import styled from 'styled-components';
import movie from '../../pages/movie_data.json';
import { useState, useEffect, useRef, React } from 'react';
import useDebounce from '@/pages/infos/useDebounce';
import MovieCard from './MovieCard';

function find(search_title) {
    let list = [];
    let title;
    let poster_path;
    let id;

    for (let i = 0; i < movie.movie_data.length; i++) {
        if (movie.movie_data[i].title.includes(search_title)) {
            
            id = movie.movie_data[i].id;
            title = movie.movie_data[i].title;
            poster_path = movie.movie_data[i].poster_path;

            list.push(<MovieCard key={id} index={i} id={id} title={title} poster_path={poster_path} />);
        }
    }

    return list;w
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

function SearchForm() {
    const [flag, setFlag] = useState(true);
    const [title, setTitle] = useState("");
    const [list, setList] = useState(null);
    const [movie, setMovie] = useState(null);
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

    // useEffect(()=>{
    //     console.log(idx)
    // },[idx])

    const onKeyDown = (e) => {
        if(e.key == 'Enter') {
            setMovie(find(title));
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
                            <span>
                                <input name="zanre" id="fantasy" type='checkbox'/>
                                <label htmlFor='fantasy'>판타지</label>
                            </span>
                            <span>
                                <input name="zanre" id="action" type='checkbox'/>
                                <label htmlFor='action'>액션</label>
                            </span>
                            <span>
                                <input name="zanre" id="sf" type='checkbox'/>
                                <label htmlFor='sf'>S.F</label>
                            </span>
                        </div>
                    </li>
                    <li>
                        <p>카테고리</p>
                        <div>
                            <span>
                                <input name="category" id="meta" type='checkbox'/>
                                <label htmlFor='meta'>메타버스</label>
                            </span>
                            <span>
                                <input name="category" id="alien" type='checkbox'/>
                                <label htmlFor='alien'>외계</label>
                            </span>
                        </div>
                    </li>
                    <li>
                        <p>제작사</p>
                        <div>
                            <span>
                                <input name="maker" id="marvel" type='checkbox'/>
                                <label htmlFor='marvel'>마블</label>
                            </span>
                            <span>
                                <input name="maker" id="desiny" type='checkbox'/>
                                <label htmlFor='desiny'>디즈니</label>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="movieBox container">
                {movie}
            </div>
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