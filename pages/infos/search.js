import styles from '@/styles/Home.module.css'
import styled from 'styled-components';
import movie from '../movie_data.json'
import { useState, useEffect, useRef, React } from 'react';
import useDebounce from './useDebounce';

function Card(props) {
    let url = "https://image.tmdb.org/t/p/w200";
    let path = props.poster_path;
    let index = props.index;
    let page = '/infos/' + index;

    return (
        <div className={styles.card_container}>
            <a href={page}>
                <div className={styles.card}>
                    <img className={styles.image} src={url + path}></img>
                    <p>{props.title}</p>
                </div>
            </a>
        </div>
    )
}

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

            list.push(<Card key={id} index={i} id={id} title={title} poster_path={poster_path}></Card>);
        }
    }

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

const ListFocus = styled.li`
      padding: 5px 4px;
      text-align: left;
      background: ${props => props.isFocus ? "rgb(158, 157, 157)" : "rgb(221, 219, 219)"};
    `;

function Main() {
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
            console.log(target);
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
            console.log(debounceValue);
            setList(searchList(debounceValue));
            setFlag(false);
        }
        if (debounceValue && !notDebounce) getMovies();
    }, [debounceValue]);   

    useEffect(() => {
        if(list != null) {
            console.log(list);
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
            console.log('down')

            nextIdx = idx + 1;
            if (nextIdx >= listItems) {
                nextIdx = 0;
            }
            setIdx(nextIdx);
        }

        else if (key == 'ArrowUp') {
            e.preventDefault();
            console.log('up')
            
            nextIdx = idx - 1
            if (nextIdx < 0) {
                nextIdx = listItems - 1;
            }
            setIdx(nextIdx);
        }       
    }  

    return (
        <div className={styles.test}>
            <div className={styles.search}>
                <div className={styles.searchBox}>
                    <input type='text' key={100} value={title} ref={inputRef} className={styles.textBox} placeholder='영화 제목 입력' onKeyDown={(e) => {
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
                    }} onChange={(e) => {
                        setTitle(e.target.value);
                        if(e.target.value == ""){
                            setFlag(true);
                        }
                    }} onClick={(e) => {                       
                        if(e.target.value == ""){
                            setFlag(true);
                        }
                        else {
                            setList(searchList(e.target.value));
                        }
                    }}></input>
                    {flag ? null : 
                    <div className={styles.list}>
                        <ul ref={ulRef}>
                            {list.map((item, index) => (                               
                                <a href={item[0]} key={index}>
                                    <ListFocus key={index} isFocus={idx == index ? true : false}>
                                        {item[1]}
                                    </ListFocus>
                                </a>                      
                            ))}
                        </ul>
                    </div>
                    }
                </div>
            </div>              
            <div className={styles.container}>
                <div className={styles.grid}>
                    {movie}
                </div>
            </div>
        </div>
    )
}

export default Main;