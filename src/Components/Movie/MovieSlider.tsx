import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../../api";
import { makeImagePath } from "../../utils";
import next from "../../image/next.png";
import prev from "../../image/prev.png";
import DetailMovie from "./DetailMovie";

const Slider = styled.div`
  position: relative;
  height: 50vh;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  padding: 0 5px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
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
  top: 60px;
  left: 0;
  cursor: pointer;
`;

const NextIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 60px;
  right: 0;
  cursor: pointer;
`;

const rowVariants: Variants = {
  hidden: (isNext: boolean) => ({
    x: isNext ? window.innerWidth : -window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => ({
    x: isNext ? -window.innerWidth : window.innerWidth,
  }),
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
  data?: IGetMoviesResult;
}

const MovieSlider = ({ data }: Iprops) => {
  const [index, setIndex] = useState(0);
  const [isNext, setIsNext] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const history = useHistory();

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const offset = 6;

  const movieMatch = useRouteMatch<{ id: string }>("/movie/:id");
  const searchMatch = useRouteMatch<{ id: string }>("/search/movie/:id");

  const nextIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        const totalMovies = data?.results.length;
        const maxIndex = Math.floor(totalMovies / offset);

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
        const totalMovies = data?.results.length - 1;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;

        toggleLeaving();
        setIndex((prev) => (prev === maxIndex ? maxIndex - 1 : prev - 1));
        setIsNext(() => false);
      }
    }
  };

  return (
    <>
      <Slider>
        <AnimatePresence
          onExitComplete={toggleLeaving}
          initial={false}
          custom={isNext}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  key={movie.id}
                  bgPhoto={makeImagePath(
                    movie.backdrop_path
                      ? movie.backdrop_path
                      : movie.poster_path
                  )}
                  variants={boxVariants}
                  initial="normal"
                  whileHover="hover"
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                    <span>★ {movie.vote_average}</span>
                  </Info>
                </Box>
              ))}
          </Row>
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
              <DetailMovie id={movieMatch.params.id} />
            ) : null}
            {searchMatch ? (
              <DetailMovie id={searchMatch.params.id} />
            ) : null}
          </AnimatePresence>
    </>
  );
};

export default MovieSlider;
