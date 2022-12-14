import { useQuery } from "@tanstack/react-query";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  getMovies,
  IGetMovieDetail,
  IGetMoviesResult,
} from "../Apis/movieApi";
import Loading from "../Components/Loading";
import MovieSlider from "../Components/Movie/MovieSlider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
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
  background-position: center;

  @media ${(props) => props.theme.medium} {
    background-position : center;
    width: 100%;
    height: 100%;
  }

  @media ${(props) => props.theme.small} {
    background-position : center;
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 800;
  margin-bottom: 10px;

  @media ${(props) => props.theme.medium} {
    font-size: 48px;
    font-weight: 700;
  }

  @media ${(props) => props.theme.small} {
    font-size: 32px;
    font-weight: 600;
  }
`;

const Overview = styled.p`
  font-size: 22px;
  font-weight: 500;
  width: 50%;

  @media ${(props) => props.theme.medium} {
    font-size: 18px;
    font-weight: 400;
  }

  @media ${(props) => props.theme.small} {
    display: none;
  }
`;

const BannerBtn = styled.div`
  font-weight: 600;
  font-size: 18px;
  width: 150px;
  text-align: center;
  border-radius: 5px;
  margin: 5px 0;
  padding: 5px;
  margin-top: 15px;
  cursor: pointer;
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: rgba(109, 109, 110, 1);
  }

  @media ${(props) => props.theme.medium} {
    font-size: 16px;
    font-weight: 500;
    width: 120px;
  }

  @media ${(props) => props.theme.small} {
    font-size: 12px;
    font-weight: 400;
    width: 100px;
  }
`;

function Home() {
  const navigate = useNavigate();

  const moveBanner = (id: string) => () => {
    navigate(`/movie/${id}`);
  };

  // Movie API fetching
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
      getMovieDetail(String(496243))
    );


  return (
    <Wrapper>
      {popularLoading &&
      topLoading &&
      upLoading &&
      bannerLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>Netflix</title>
            </Helmet>
          </HelmetProvider>

          <Banner bgPhoto={makeImagePath(bannerData?.backdrop_path || "")}>
            <Title>{bannerData?.title}</Title>
            <Overview>{bannerData?.overview}</Overview>
            <BannerBtn onClick={moveBanner(bannerData?.id + "")}>
              ?????? ??????
            </BannerBtn>
          </Banner>

          <MovieSlider kind="popular" data={popularData} />
          <MovieSlider kind="toprated" data={topData} />
          <MovieSlider kind="upcoming" data={upData} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
