import { useQuery } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  getMovies,
  IGetMovieDetail,
  IGetMoviesResult,
} from "../Apis/movieApi";
import MovieSlider from "../Components/Movie/MovieSlider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  const history = useHistory();

  // Movie API fetching
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetMoviesResult>(["movie", "popular"], () =>
      getMovies("popular")
    );
  const { data: topData, isLoading: topLoading } = useQuery<IGetMoviesResult>(
    ["movie", "top"],
    () => getMovies("top_rated")
  );
  const { data: upData, isLoading: upLoading } = useQuery<IGetMoviesResult>(
    ["movie", "upcoming"],
    () => getMovies("upcoming")
  );

  // Banner API data fetching
  const { data: bannerData, isLoading: bannerLoading } =
    useQuery<IGetMovieDetail>(["movie", "banner"], () =>
      getMovieDetail(String(615173))
    );

  return (
    <Wrapper>
      {nowLoading &&
      popularLoading &&
      topLoading &&
      upLoading &&
      bannerLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(bannerData?.backdrop_path || "")}>
            <Title>{bannerData?.title}</Title>
            <Overview>{bannerData?.overview}</Overview>
          </Banner>

          <MovieSlider data={nowData} />
          <MovieSlider data={popularData} />
          <MovieSlider data={topData} />
          <MovieSlider data={upData} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
