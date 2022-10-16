import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../../Apis/movieApi";
import { makeImagePath } from "../../utils";
import next from "../../Images/next.png";
import prev from "../../Images/prev.png";
import DetailMovie from "./DetailMovie";
import { useMediaQuery } from "react-responsive";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  height: 40vh;
`;

const SliderTitle = styled.h2`
  margin-bottom: 20px;
  padding-left: 10px;
  color: white;
  font-size: 24px;
  font-weight: 800;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  padding: 0 5px;

  @media ${(props) => props.theme.medium} {
    grid-template-columns: repeat(5, 1fr);
  }

  @media ${(props) => props.theme.small} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  text-shadow: 2px 2px 2px black;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  &:first-child {
    margin-left: 5px;
    transform-origin: center left;
  }
  &:last-child {
    margin-right: 5px;
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
  span {
    text-align: center;
    font-size: 14px;
  }
`;

const PrevIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 120px;
  left: 0;
  cursor: pointer;
`;

const NextIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 120px;
  right: 0;
  cursor: pointer;
`;

const rowVariants: Variants = {
  hidden: (isNext: boolean) => {
    return {
      x: isNext ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => {
    return {
      x: isNext ? -window.innerWidth : window.innerWidth,
    };
  },
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const IconVariants: Variants = {
  initial: {
    opacity: 0.3,
  },
  hover: {
    opacity: 0.7,
  },
};

interface Iprops {
  kind: string;
  data?: IGetMoviesResult;
}

const MovieSlider = React.memo(({ kind, data }: Iprops) => {
  const [titleName, setTitle] = useState("");
  const [isSearch, setSearch] = useState(false);

  useEffect(() => {
    switch (kind) {
      case "popular":
        setTitle("대한민국에서 인기인 영화");
        break;
      case "toprated":
        setTitle("평점높은 영화");
        break;
      case "upcoming":
        setTitle("상영예정 영화");
        break;
      case "search":
        setTitle("영화");
        setSearch(true);
        break;
    }
  }, [kind]);

  const [index, setIndex] = useState(0);
  const [isNext, setIsNext] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const navigate = useNavigate();

  const isLarge = useMediaQuery({ minWidth: 1101 });
  const isMedium = useMediaQuery({ minWidth: 801, maxWidth: 1100 });
  const isSmall = useMediaQuery({ maxWidth: 800 });

  const offset = 6;
  const mediumOffset = 5;
  const smallOffset = 3;

  const movieMatch = useMatch("/movie/:id");
  const searchMatch = useMatch("/search/movie/:id");

  const nextIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        const totalMovies = data?.results.length;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        toggleLeaving();

        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        setIsNext(() => true);
      }
    }
  };

  const prevIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        const totalMovies = data?.results.length;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;

        toggleLeaving();
        setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
        setIsNext(() => false);
      }
    }
  };

  const clickBox = (id: number) => {
    setTimeout(() => {
      if (isSearch) {
        navigate(`/search/movie/${id}`);
      } else {
        navigate(`/movie/${id}`);
      }
    }, 10);
  };

  return (
    <>
      {data ? (
        <>
          <Slider>
            <SliderTitle>{titleName}</SliderTitle>
            <AnimatePresence
              onExitComplete={toggleLeaving}
              initial={false}
              custom={isNext}
            >
              {isSmall && (
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  custom={isNext}
                >
                  {data?.results
                    .slice(
                      smallOffset * index,
                      smallOffset * index + smallOffset
                    )
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        bgphoto={makeImagePath(
                          movie.backdrop_path
                            ? movie.backdrop_path
                            : movie.poster_path
                        )}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => clickBox(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                          <span>★ {movie.vote_average}</span>
                        </Info>
                      </Box>
                    ))}
                </Row>
              )}
              {isMedium && (
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  custom={isNext}
                >
                  {data?.results
                    .slice(
                      mediumOffset * index,
                      mediumOffset * index + mediumOffset
                    )
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        bgphoto={makeImagePath(
                          movie.backdrop_path
                            ? movie.backdrop_path
                            : movie.poster_path
                        )}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => clickBox(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                          <span>★ {movie.vote_average}</span>
                        </Info>
                      </Box>
                    ))}
                </Row>
              )}
              {isLarge && (
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  custom={isNext}
                >
                  {data?.results
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        bgphoto={makeImagePath(
                          movie.backdrop_path
                            ? movie.backdrop_path
                            : movie.poster_path
                        )}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => clickBox(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.original_title}</h4>
                          <span>★ {movie.vote_average}</span>
                        </Info>
                      </Box>
                    ))}
                </Row>
              )}
            </AnimatePresence>
            <PrevIcon
              src={prev}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={prevIndex}
            />
            <NextIcon
              src={next}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={nextIndex}
            />
          </Slider>

          <AnimatePresence>
            {movieMatch ? (
              <DetailMovie id={movieMatch.params.id} kind={kind} />
            ) : null}
            {searchMatch ? (
              <DetailMovie id={searchMatch.params.id} kind={kind} />
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <Loader>Loading...</Loader>
      )}
    </>
  );
});

export default MovieSlider;
