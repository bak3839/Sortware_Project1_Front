import { useRouter } from "next/router";
import styled from "styled-components";

export default function Navigation(){
    const router = useRouter();

    return (
        <NavigationWrapper>
            <div className="container">
                <ul>
                    <li 
                        className={router.asPath === "/" ? "active" : ''}
                        onClick={() => router.push("/")}
                    >메인</li>
                    <li 
                        className={router.asPath.includes("search") ? "active" : ''} 
                        onClick={() => router.push("/infos/search")}
                    >영화검색</li>
                    <li>영화추천</li>
                </ul>
                <ul>
                    <li>로그인</li>
                    <li>회원가입</li>
                </ul>
            </div>
            
        </NavigationWrapper>
    )
}

const NavigationWrapper = styled.div`
    padding: 4rem 0 3rem;
    background: #000;
    border-bottom: 1px solid #fff;

    >div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
    }
    ul{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }   
    li{
        margin-right: 4rem;
        font-size: 1.8rem;
        color: #ffffff60;
        font-weight: 900;
        cursor: pointer;
        transition: all ease 0.3s 0s;
    }
    li.active,
    li:hover{
        color: #fff;
    }
    li:last-child{
        margin: 0;
    }
`