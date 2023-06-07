import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import movie from '../../pages/movie_data.json';
import styled from "styled-components";
import {useRouter} from "next/router";
import {StatusContext} from "@/pages/infos/StatusContext";

const StarRating = ({ rating, onRatingChange }) => {
    //사용자가 별을 클릭할대 호출되는 함수. 선택된 평점을 'onRatingChange'함수에 전달하여 부모 컴포넌트에서 처리
    const handleStarClick = (selectedRating) => {

        //사용자가 별을 클릭할때 호출 선택된 평점을 전달하여 부모 컴포넌트에서 해당 값을 업데이트함.
        onRatingChange(selectedRating);
    };
    //별 아이콘을 랜더링하는 함수
    const renderStars = () => {
        const starIcons = [];
        const maxRating = 5;
        const starSize = 22;

        for (let i = 0; i < maxRating; i++) {
            const ratingValue = i + 1;
            starIcons.push(
                <StarIcon
                    key={i}
                    className={ratingValue <= rating ? 'active' : ''}
                    style={{
                        fontSize: `${starSize}px`,
                        color: ratingValue <= rating ? 'red' : 'black',
                    }}
                    onClick={() => handleStarClick(ratingValue)}
                >
                    ★
                </StarIcon>
            );
        }

        return starIcons;
    };

    return (
        <div className="star-rating">
            {renderStars()}
        </div>
    );
};

export default function Board() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {status, setStatus} = useContext(StatusContext);

    const router = useRouter();
    const index = router.query.index;

    const url = "http://localhost:8080";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const movieId = movie.movie_data[index]?.id;
                if (movieId) {
                    const res = await axios.get(url + '/board/return?movieid=' + movieId);
                    setComments(res.data);
                    console.log(res.data);
                }
            } catch (error) {
                console.error('댓글 정보 가져오기 실패:', error);
                if (error.response.status === 401) {
                    // 호출 예시 1: handleLogoutClick() 함수 실행
                    setStatus(false);
                }
            }
        };

        if (index !== undefined) {
            fetchComments();
        }
    }, [index]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!isLoggedIn) {
            alert('로그인을 해주세요!');
            return;
        }

        if (newComment.trim() !== '' && rating > 0) {
            const offset = 1000 * 60 * 60 * 9;
            const koreaNow = new Date((new Date()).getTime() + offset);

            const board = {
                userid: -1,
                movieid: movie.movie_data[index].id,
                comment: newComment,
                date: koreaNow.toISOString(),
                rating: rating,
            };

            const fetchComments = async () => {
                try {
                    const response = await axios.post(url + '/board/insert', board, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getCookie('token')}`,
                        },
                    });
                    const commentsResponse = await axios.get(url + '/board/return?movieid=' + movie.movie_data[index].id);
                    setComments(commentsResponse.data);
                    setNewComment('');
                    setRating(0);
                } catch (error) {
                    console.error('댓글 저장하기 실패:', error);
                }
            };

            fetchComments();
        }
    };

    const calculateAverageRating = () => {
        if (comments.length === 0) {
            return 0;
        }

        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    };

    const getCookie = (name) => {
        if (typeof window !== 'undefined') {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
        }
        return null;
    };

    useEffect(() => {
        const token = getCookie('token');
        setIsLoggedIn(token !== null); // 토큰이 존재하면 로그인 상태로 설정

    }, []);

    return (
        <BoardWrapper>
            <div className="container" style={{paddingTop: '20px'}}>
                <h1>댓글</h1>
                <div className="comments-summary">
                    <p>평가 인원: {comments.length}</p>
                    <p>평균 별점: {calculateAverageRating().toFixed(1)}</p>
                </div>

                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder={isLoggedIn ? "댓글을 입력하세요" : "로그인을 해주세요!"}
                        disabled={!isLoggedIn} // 로그인 상태가 아니면 입력창 비활성화
                    />
                    {isLoggedIn && <StarRating rating={rating} onRatingChange={handleRatingChange} />}
                    {isLoggedIn && <button type="submit">댓글 작성</button>}
                </form>

                <div className="comments">
                    {comments.map((comment) => (
                        comment.comment != null && (
                            <div key={comment.id} className="comment">
                                <p className="rating">
                                    <StarRating rating={comment.rating} onRatingChange={() => {
                                    }}/>
                                </p>
                                <p className="content">{comment.comment}</p>
                                <span className="user">{comment.userid}</span>
                                <span className="date">{new Date(comment.date).toLocaleString()}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </BoardWrapper>
    )
}

const BoardWrapper = styled.div`
  //container
  > div {
    //여기에 CSS 작성
    h1 {
      font-size: 3rem;
    }

    .comments-summary {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .comments {
      margin-top: 1rem;

      .comment {
        margin-bottom: 0.5rem;
        border-top: 2px solid #f0f0f0;
        padding: 1rem;
        border-radius: 0px;

        .user {
          font-weight: bold;
          font-size: 13px;
          padding-right: 1rem;
          color: cadetblue;
        }

        .date {
          font-size: 12px;
          color: #888;
        }

        .content {
          margin-top: 0.5rem;
          padding-bottom: 1rem;
          font-size: 15px;
        }
      }
    }

    form {
      margin-top: 2rem;

      input[type='text'] {
        width: 100%;
        padding: 0.5rem;
      }

      button {
        margin-top: 0.5rem;
      }
    }
  }
`;

const StarIcon = styled.span`
  cursor: pointer;
  &.active {
    color: yellow;
  }
`;