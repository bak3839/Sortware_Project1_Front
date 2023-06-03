import { useRouter } from "next/router";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navigation() {
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 세션 스토리지에서 토큰 값을 확인하여 로그인 상태인지 확인
        const token = sessionStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginClick = () => {
        setShowLogin(!showLogin);
    };

    const handleLoginFormSubmit = (e) => {
        e.preventDefault();

        // 로그인 요청을 보내는 Axios 코드
        axios
            .post("http://localhost:8080/user/login", { id, pw })
            .then((res) => {
                console.log("로그인 성공:", res.data);
                const token = res.data.token; // 토큰 값 추출

                // 세션 스토리지에 토큰 값을 저장
                sessionStorage.setItem("token", res.data);

                setIsLoggedIn(true); // 로그인 성공 시 isLoggedIn 값을 true로 설정
            })
            .catch((error) => {
                console.error("로그인 실패:", error.response.data);
            });
    };

    const handleLogoutClick = () => {
        // 세션 스토리지에서 토큰 값을 제거
        sessionStorage.removeItem("token");

        setIsLoggedIn(false); // 로그아웃 시 isLoggedIn 값을 false로 설정
        // 필요한 경우 추가 로직 수행
    };

    return (
        <NavigationWrapper>
            <div className="container">
                <ul>
                    <li
                        className={router.asPath === "/" ? "active" : ""}
                        onClick={() => router.push("/")}
                    >
                        메인
                    </li>
                    <li
                        className={router.asPath.includes("search") ? "active" : ""}
                        onClick={() => router.push("/infos/search")}
                    >
                        영화검색
                    </li>
                    <li
                        className={router.asPath.includes("recommend") ? "active" : ""}
                        onClick={() => router.push("/infos/recommend")}
                    >
                        영화추천
                    </li>
                </ul>
                <ul>
                    {isLoggedIn ? (
                        <>
                            <li onClick={handleLogoutClick}>로그아웃</li>
                            <li>내 정보</li>
                        </>
                    ) : (
                        <>
                            <li onClick={handleLoginClick}>로그인</li>
                            <li>회원가입</li>
                        </>
                    )}
                </ul>
            </div>

            {showLogin && (
                <div className="login-overlay">
                    <div className="login-container">
                        <h2>로그인</h2>
                        <form onSubmit={handleLoginFormSubmit}>
                            <input
                                type="text"
                                placeholder="사용자명"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                            />
                            <button type="submit">로그인</button>
                        </form>
                        <button className="close-button" onClick={handleLoginClick}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </NavigationWrapper>
    );
}

const NavigationWrapper = styled.div`
  padding: 4rem 0 3rem;
  background: #000;
  border-bottom: 1px solid #fff;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }

  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  li {
    margin-right: 4rem;
    font-size: 1.8rem;
    color: #ffffff60;
    font-weight: 900;
    cursor: pointer;
    transition: all ease 0.3s 0s;
  }

  li.active,
  li:hover {
    color: #fff;
  }

  li:last-child {
    margin: 0;
  }

  .login-overlay {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 5px;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 250px;
    margin: 0 auto;
    display: flex;
    justify-content: center; /* 로그인 버튼을 수평 중앙으로 정렬 */
    align-items: center; /* 로그인 버튼을 수직 중앙으로 정렬 */
  }

  .login-container h2 {
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: bold;
  }

  .login-container form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .login-container input[type="text"],
  .login-container input[type="password"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 40px;
  }

  .login-container button[type="submit"],
  .login-container .close-button {
    padding: 0.5rem 1rem;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .login-container button[type="submit"] {
    padding: 0.3rem 1rem;
    font-size: 1.2rem;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container button[type="submit"]:hover,
  .login-container .close-button:hover {
    background-color: #333;
  }

  .login-container .close-button {
    margin-top: auto;
  }
`;
