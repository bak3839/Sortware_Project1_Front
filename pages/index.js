import Navigation from '@/components/common/Navigation'
import HomeMovieCard from '@/components/HomeMovieCard';
import HomeCfMovieCard from '@/components/HomeCfMovieCard';
import styled from 'styled-components';
import {useEffect, useState} from "react";
import {StatusContext} from "@/pages/infos/StatusContext";
import axios from "axios";
import json from "@/pages/movie_data_final.json";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cfMovieId, setCfMovieId] = useState([]);
    const [status, setStatus] = useState(true);
    const url = "http://localhost:8080";

    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            setIsLoggedIn(true);
        }
        const fetchData = async () => {
            if (token == null) console.log("로그인 해주세요")
            else console.log(token)

            try {
                const response = await axios.post(url + '/search/collaborative', null, // 요청 본문 데이터 (null로 설정)
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
                        },
                    });

                setCfMovieId(response.data)
            } catch (error) {
                console.error('CF 불러오기 실패:', error);
                if (error.response.status === 401) {
                    // 호출 예시 1: handleLogoutClick() 함수 실행
                    setStatus(false);
                } else if(error.response.status === 409) {
                    console.log("Flask 서버 Status: Off");
                }
            }
        };

        fetchData();
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

    const cf_lists = [];
    const lists = [8856, 8857, 8858, 8859, 8860, 8861, 8862, 8863, 8864, 8865, 8866, 8867, 8868, 8869, 8870, 8871, 8872, 8873, 8874, 8875];
    const lists2 = [];


    // const CfMovieId = [1726, 10138, 68721]; // test코드 아이언맨 1,2,3

    // id 값을 사용하여 JSON 데이터를 찾아서 cf_lists 배열에 추가
    cfMovieId.forEach(id => {
        const foundItem = json["movie_data"].find((item) => item.id === id);
        if (foundItem) {
            cf_lists.push(foundItem);
        }
    });

    lists.forEach((idx => {
        lists2.push(json["movie_data"][idx]);
    }))

    // 쿠키 가져오기 함수
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    return (
        <HomeWrapper>
            <StatusContext.Provider value={{status, setStatus}}>
                <Navigation/>
            </StatusContext.Provider>
            {isLoggedIn ? (
                <HomeCfMovieCard title={"당신을 위한 추천 영화"} lists={cf_lists} />
            ) : (null)
            }
            <HomeMovieCard title={"이달의 추천 영화"} lists={lists2}/>
        </HomeWrapper>
    );
}

const HomeWrapper = styled.div`
  margin-bottom: 10rem;
`