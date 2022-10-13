import { AnimatePresence, motion, Variants } from "framer-motion";
import styled from "styled-components";

const Overlay = styled(motion.div)`
position: fixed;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
opacity: 0;
`;

const BigMovie = styled(motion.div)`
position: absolute;
width: 40vw;
height: 80vh;
left: 0;
right: 0;
margin: 0 auto;
border-radius: 15px;
overflow: hidden;
background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
width: 100%;
background-size: cover;
background-position: center center;
height: 400px;
`;

const BigTitle = styled.h3`
color: ${(props) => props.theme.white.lighter};
padding: 20px;
font-size: 46px;
position: relative;
top: -80px;
`;

const BigOverview = styled.p`
padding: 20px;
position: relative;
top: -80px;
color: ${(props) => props.theme.white.lighter};
`;

interface IProps {
    id: string;
}

function DetailMovie({id} : IProps) {
  return (
    <>
    </>
  )
}

export default DetailMovie