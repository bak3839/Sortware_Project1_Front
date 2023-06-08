import { useRouter } from "next/router";
import styled from "styled-components";
import {useState, useEffect, useContext} from "react";
import axios from "axios";
import {StatusContext} from "@/pages/infos/StatusContext";

export default function Navigation() {
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {status, setStatus} = useContext(StatusContext);

    useEffect(() => {
        const token = getCookie("token");

        if (token) {
            setIsLoggedIn(true);
        }
        //else return;
        const fetchData = async () => {
            if (token == null) console.log("로그인 해주세요")
            else console.log(token)

            try {
                const response = await axios.post("http://localhost:8080/user/loginTest", null, // 요청 본문 데이터 (null로 설정)
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
                        },
                    });
            } catch (error) {
              if (error.response.status === 401) {
                // 호출 예시 1: handleLogoutClick() 함수 실행
                setStatus(false);
              } else if (error.response.status === 409) {
                console.log("Flask 서버 Status: Off");
              }
            }
        };

        fetchData();
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

    useEffect(() => {
        if(status) return;
        console.log(status);
        setStatus(true);
        handleLogoutClick();
    }, [status])

    const handleLoginClick = () => {
        setShowLogin(!showLogin);
    };

    const handleLoginFormSubmit = (e) => {
        e.preventDefault();

        const loginForm = {
            id: id,
            pw: pw
        };

        axios
            .post("http://localhost:8080/user/login", loginForm, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("로그인 성공:", res.data);

                const token = getCookie("token");
                // console.log(getCookie("token"))
                setIsLoggedIn(true);

                setShowLogin(false); // 로그인 성공 후 로그인 창 닫기

                // 환영 메시지 보여주기
                alert("환영합니다!");

                // 페이지 새로고침
                //window.location.reload();
                router.replace({pathname: "/"});
            })
            .catch((error) => {
                console.error("로그인 실패:", error.response.data);
                const errorMessage = error.response.data;

                // 아이디 혹은 비밀번호 오류에 따라 다른 메시지 표시
                let loginErrorMessage = "";
                if (errorMessage === "아이디가 존재하지 않습니다") {
                    loginErrorMessage = "아이디가 일치하지 않습니다.";
                } else if (errorMessage === "비밀번호가 일치하지 않습니다.") {
                    loginErrorMessage = "아이디 혹은 비밀번호가 일치하지 않습니다.";
                } else {
                    loginErrorMessage = "로그인에 실패했습니다. 관리자에게 문의주세요";
                }

                // 오류 메시지를 로그인 창에 표시
                const errorMessageElement = document.getElementById("login-error-message");
                if (errorMessageElement) {
                    errorMessageElement.textContent = loginErrorMessage;
                }
            });
    };
    const handleLogoutClick = () => {
        // 쿠키에서 토큰 값을 제거
        deleteCookie("token");

        setIsLoggedIn(false); // 로그아웃 시 isLoggedIn 값을 false로 설정

        // 로그아웃 알림 메시지 표시
        alert("로그아웃 되었습니다.");

        // 페이지 새로고침
        //window.location.reload();
        //router.replace({pathname: "/"});
        setShowLogin(true);
    };

    // 쿠키 가져오기 함수
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

// 쿠키 삭제 함수
    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    const handleClick = () => {
        alert("구현중입니다");
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
                            <li onClick={handleClick}>내 정보</li>
                        </>
                    ) : (
                        <>
                            <li onClick={handleLoginClick}>로그인</li>
                            <li
                                onClick={() => router.push("/infos/register")}
                            >회원가입</li>
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
                            <div id="login-error-message" className="login-error-message"></div> {/* 오류 메시지를 표시할 요소 */}
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

  .login-error-message {
    text-align: center;
    color: red;
    font-weight: bold;
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
