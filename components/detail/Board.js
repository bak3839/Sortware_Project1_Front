import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import movie from '../../pages/movie_data.json';
import {useRouter} from "next/router";

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

    const router = useRouter();
    const index = router.query.index;

    // 토큰 값 가져오기
    let token = null;
    if (typeof window !== 'undefined') {
        token = sessionStorage.getItem('token');
    }

    const url = "http://localhost:8080";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const movieId = movie.movie_data[index]?.id; // movieId 값을 정확히 설정해줍니다.
                if (movieId) {
                    const res = await axios.get(url + '/board/return?movieid=' + movieId);
                    setComments(res.data);
                    console.log(res.data);
                }
            } catch (error) {
                console.error('댓글 정보 가져오기 실패:', error);
            }
        };

        if (index !== undefined) {
            fetchComments();
        }
    }, [index]); // index를 의존성 배열에 추가합니다.

    //댓글 내용 변경될 때마다 호출. 입력된 댓글 내용을 가져와 'setNewComment'함수 호출 'newComment'상태 업데이트함. 입력된 댓글 내용을 상태에 저장함.
    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    //별점이 변경될 때 호출되는 함수. 'selectedRating'매개변수를 받아와 'setRating'함수를 호출하여 'rating' 상태를 업데이트함. 선택한 별점을 상태에 저장함.
    const handleRatingChange = (selectedRating) => {
        setRating(selectedRating);
    };

    //댓글을 제출할 때 호출되는함수
    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        //내용이 비어잇지 않고 선택된 별점이 0보다 크면 저장
        if (newComment.trim() !== '' && rating > 0) {
            const offset = 1000 * 60 * 60 * 9
            const koreaNow = new Date((new Date()).getTime() + offset)

            const board = {
                userid: 0,
                movieid: movie.movie_data[index].id,
                comment: newComment,
                date: koreaNow.toISOString(),
                rating: rating,
            };

            //spring boot와 axios를 이용한 통신
            const fetchComments = async () => {
                try {
                    const response = await axios.post(url + '/board/insert', board, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
                        },
                    });
                    // 댓글 목록 새로고침.
                    const commentsResponse = await axios.get(url + '/board/return?movieid=' + movie.movie_data[index].id);
                    setComments(commentsResponse.data);

                    // 댓글 입력 필드와 별점을 초기화합니다.
                    setNewComment('');
                    setRating(0);
                } catch (error) {
                    console.error('댓글 저장하기 실패:', error);
                    // 오류 처리
                }
            };

            fetchComments();
        }
    };

    //평점계산
    const calculateAverageRating = () => {
        if (comments.length === 0) {
            return 0;
        }

        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    };

    return (
        <BoardWrapper>
            <div className="container" style={{ paddingTop: '20px' }}>
                <h1>댓글</h1>

                <div className="comments-summary">
                    <p>댓글 수: {comments.length}</p>
                    <p>평균 별점: {calculateAverageRating().toFixed(1)}</p>
                </div>

                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글을 입력하세요"
                    />
                    <StarRating rating={rating} onRatingChange={handleRatingChange} />
                    <button type="submit">댓글 작성</button>
                </form>

                <div className="comments">
                    {comments.map((comment) => (
                        // comments.comment이 null인 경우에만 렌더링합니다.
                        comment.comment != null && (
                            <div key={comment.id} className="comment">
                                <p className="rating">
                                    <StarRating rating={comment.rating} onRatingChange={() => {}} />
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
    );
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