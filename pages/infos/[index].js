import Navigation from '@/components/common/Navigation';
import Board from '@/components/detail/Board';
import MovieInfo from '@/components/detail/MovieInfo';

function MovieDetail() {
    return (
        <>
            <Navigation />
            <MovieInfo />
            {/* 게시판컴포넌트 */}
            <Board />
        </>
    )
}  

export default MovieDetail;
