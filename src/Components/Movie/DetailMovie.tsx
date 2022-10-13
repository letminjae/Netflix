import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieCredit,
  getMovieDetail,
  IGetMovieCredit,
  IGetMovieDetail,
} from "../../Apis/movieApi";
import { makeImagePath } from "../../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 9999;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Modal = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 90vh;
  top: 5%;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background-color: #141414;
`;

const ModalImage = styled.div<{ bgphoto: string }>`
  background-image: linear-gradient(to top, #141414, transparent),
    url(${(props) => props.bgphoto});
  border-radius: 12px 12px 0 0;
  height: 500px;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  #title {
    font-size: 48px;
    font-weight: 600;
    position: absolute;
    bottom: 50%;
    left: 5%;
  }
  #tagline {
    font-size: 24px;
    font-weight: 500;
    position: absolute;
    bottom: 46%;
    left: 5%;
  }
  display: flex;
  flex-direction: column;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 48px;
  gap: 48px;
  font-weight: 500;
`;

const Genre = styled.div`
  span::after {
    content: ", ";
  }
  span:last-child::after {
    content: none;
  }
`;

const ModalInfo = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  #star {
    font-size: 24px;
    font-weight: 500;
  }
`;

const ModalCreditsInfo = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 20px 0px;
`;

const ModalDirectorInfo = styled.div``;

const ModalCast = styled.div`
  display: flex;
  flex-direction: row;
`;

const ModalCastInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  #name {
    font-size: 14px;
  }
`;

const ModalInfoImage = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin: 0 10px;
`;

const overlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
  },
};

const modalVariants: Variants = {
  initial: { opacity: 0 },
  click: { opacity: 1 },
  exit: { opacity: 0 },
};

interface IProps {
  kind: string;
  id: string;
}

function DetailMovie({ id, kind }: IProps) {
  const { data: detailData, isLoading: detailLoading } =
    useQuery<IGetMovieDetail>(["movie", `${kind}_detail`], () =>
      getMovieDetail(id)
    );
  const { data: creditData, isLoading: creditLoading } =
    useQuery<IGetMovieCredit>(["movie", `${kind}_credit`], () =>
      getMovieCredit(id)
    );

  const Directing = creditData?.crew.find(
    (people) => people.known_for_department === "Directing"
  );

  const Casting = creditData?.cast.slice(0, 3);

  const history = useHistory();

  const clickOverlay = () => {
    history.goBack();
  };

  return (
    <AnimatePresence>
      {detailLoading && creditLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Overlay
          onClick={clickOverlay}
          variants={overlayVariants}
          initial="initial"
          animate="visible"
          exit="exit"
        >
          <Modal
            variants={modalVariants}
            initial="initial"
            animate="click"
            exit="exit"
          >
            {detailData ? (
              <>
                <Helmet>
                  <title>
                    {detailData.title
                      ? detailData.title
                      : detailData.original_title}
                  </title>
                </Helmet>

                <ModalImage
                  bgphoto={makeImagePath(
                    detailData.backdrop_path
                      ? detailData.backdrop_path
                      : detailData.poster_path
                  )}
                >
                  <span id="title">
                    {detailData.title
                      ? detailData.title
                      : detailData.original_title}
                  </span>
                  <span id="tagline">{detailData.tagline}</span>
                </ModalImage>

                <Info>
                  <ModalInfo>
                    <span id="star">
                      평점{" "}
                      {detailData.vote_average
                        ? +detailData.vote_average.toFixed(1)
                        : "0.0"}
                    </span>
                    <span>
                      {detailData.overview
                        ? detailData.overview.length >= 310
                          ? detailData.overview.substr(0, 310) + "..."
                          : detailData.overview
                        : "설명이 없습니다"}
                    </span>
                  </ModalInfo>

                  <ModalCreditsInfo>
                    <Genre>
                      장르 :{" "}
                      {detailData.genres.map((genre) => (
                        <span key={genre.id} id="genrs">
                          {genre.name}
                        </span>
                      ))}
                    </Genre>
                    <ModalDirectorInfo>
                      <span id="title">감독 : </span>
                      <span id="name">{Directing?.original_name}</span>
                    </ModalDirectorInfo>

                    <span id="title" style={{ marginTop: "8px" }}>
                      배우
                    </span>
                    <ModalCast>
                      {Casting?.map((Cast) => (
                        <ModalCastInfo key={Cast.id}>
                          <ModalInfoImage
                            bgphoto={makeImagePath(
                              Cast?.profile_path ? Cast?.profile_path : ""
                            )}
                          />
                          <span id="name">{Cast?.original_name}</span>
                        </ModalCastInfo>
                      ))}
                    </ModalCast>
                  </ModalCreditsInfo>
                </Info>
              </>
            ) : null}
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

export default DetailMovie;
