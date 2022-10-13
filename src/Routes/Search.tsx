import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearchKey } from "../Apis/searchApi";
import MovieSlider from "../Components/Movie/MovieSlider";
import TvSlider from "../Components/Tv/TvSlider";

const Wrapper = styled.div`
  margin-top: 80px;
  height: 40vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

  const { data: movieData, isLoading: movieLoading } = useQuery(
    ["searchData", keyword, "movie"],
    () => getSearchKey(keyword!, "movie")
  );

  const { data: tvData, isLoading: tvLoading } = useQuery(
    ["searchData", keyword, "tv"],
    () => getSearchKey(keyword!, "tv")
  );

  console.log(movieData, tvData);

  return (
    <Wrapper>
      {movieLoading && tvLoading ? (
        <Loader>Loading...</Loader>
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
