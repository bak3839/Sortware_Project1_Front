import Navigation from '@/components/common/Navigation';
import Board from '@/components/detail/Board';
import Video from '@/components/detail/Video';
import MovieInfo from '@/components/detail/MovieInfo';
import { useState } from 'react';
import styled from 'styled-components';

function MovieDetail() {
    const [flag, setFlag] = useState(true);

    const menuChange = (menu) => {
        if(flag == menu) return;
        console.log(menu);
        setFlag(menu);
    }

    return (
        <>
            <Navigation />
            <MovieInfo />
            <TapWrapper>
                <div className='tab'>
                    <ul>
                        <li onClick={() => menuChange(true)} className={flag ? "active" : ""}>평점 / 댓글</li>
                        <li onClick={() => menuChange(false)} className={flag ? "" : "active"}>영상</li>
                    </ul>
                </div>
            </TapWrapper>
            {flag ? <Board /> : <Video />}
        </>
    )
}  

const TapWrapper = styled.div`
    border-bottom: 1px solid black;

    .tab{
        width: 1200px;
        margin: 0 auto;
        
        ul {
            display: flex;
            -webkit-box-pack: justify;
            -webkit-box-align: center;
            align-items: center;
        }

        li {
            color: gray;
            font-size: 2.4rem;
            font-weight: 700;
            margin: 0 20px;
            padding: 20px 0;
            cursor: pointer;
            transition: all ease 0.3s 0s;
            &:hover {
                color:black;
            }         
        }

        li.active {
            color: black;
        }   
    }
`
export default MovieDetail;