import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../Apis/movieApi";
import {
  getSearchKey,
  getSearchMovie,
  getSearchTv,
  IGetSearchKey,
} from "../Apis/searchApi";
import { IGetTvResult } from "../Apis/tvApi";
import MovieSlider from "../Components/Movie/MovieSlider";
import TvSlider from "../Components/Tv/TvSlider";

const Wrapper = styled.div`
  margin-top: 80px;
  height: 40vh;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  height: 250px;
  color: white;
  margin-top: 20px;
  padding-top: 40px;
  padding-left: 20px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  font-size : 28px;
  font-weight: 600;
`;

const KeyResult = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin: 20px 10px;
`;

const Key = styled.div`
  margin: 10px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
`;

const Nothing = styled.div`
  margin-top: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  span:nth-child(2) {
    font-size: 18px;
    margin-top: 20px;
  }
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: keyData, isLoading: keyLoading } = useQuery<IGetSearchKey>(
    ["search", "key"],
    () => getSearchKey(keyword!),
    { enabled: !!keyword }
  );
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(
      ["search", "movie"],
      () => getSearchMovie(keyword!),
      { enabled: !!keyword }
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["search", "tv"],
    () => getSearchTv(keyword!),
    { enabled: !!keyword }
  );

  return (
    <Wrapper>
      {keyLoading && movieLoading && tvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>Netflix : SEARCH</title>
            </Helmet>
          </HelmetProvider>

          {keyData?.results.length &&
          movieData?.results.length &&
          tvData?.results.length ? (
            <>
              <Div>
                <Title>다음과 관련된 콘텐츠</Title>
                <KeyResult>
                  {keyData.results.slice(0, 18).map((key) => (
                    <Key key={key.id}>{key.name ? key.name : key.title}</Key>
                  ))}
                </KeyResult>
              </Div>
              <MovieSlider kind="search" data={movieData} />
              <TvSlider kind="search" data={tvData} />
            </>
          ) : (
            <Nothing>
              <span>검색결과가 없습니다.</span>
              <span>상단 오른쪽의 검색 아이콘을 클릭하여 검색해주세요!</span>
            </Nothing>
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Search;
