import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearchKey } from "../Apis/searchApi";
import MovieSlider from "../Components/Movie/MovieSlider";
import TvSlider from "../Components/Tv/TvSlider";
import Loading from "../Components/Loading";

const Wrapper = styled.div`
  margin-top: 80px;
  height: 40vh;
`;

const Contents = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  padding: 8px 24px;
`;

const Nothing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 36px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieData, isLoading: movieLoading } = useQuery(
    ["searchData", keyword, "movie"],
    () => getSearchKey(keyword!, "movie")
  );

  const { data: tvData, isLoading: tvLoading } = useQuery(
    ["searchData", keyword, "tv"],
    () => getSearchKey(keyword!, "tv")
  );

  return (
    <Wrapper>
      {movieLoading && tvLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>Netflix : SEARCH</title>
            </Helmet>
          </HelmetProvider>

          {movieData?.results.length && tvData?.results.length ? (
            <>
              <Title>"{keyword}"을(를) 검색한 콘텐츠</Title>
              <Contents>
                <MovieSlider kind="search" data={movieData} />
                <TvSlider kind="search" data={tvData} />
              </Contents>
            </>
          ) : (
            <Nothing>검색결과가 없습니다.</Nothing>
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Search;
