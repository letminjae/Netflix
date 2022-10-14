# Netflix

## [Netflix 배포 사이트](https://letminjae-netflix.netlify.app/)

```
git clone https://github.com/letminjae/Netflix.git
npm install
npm start
```

## 프로젝트 기간
2022/08/20~22, MVP 완성 및 기능 업데이트 : 2022/10/12 ~ 2022/10/14 (6일)
## 핵심기능
- Open API를 통한 fetching, `React-Query를 이용한 캐싱 작업 및 값 업데이트, 에러 핸들링`
- Framer motion을 이용한 `슬라이더 컴포넌트`
- 상세 페이지를 통한 컨텐츠 `상세정보 열람 `
- 키워드를 통한 API 데이터 요청, `영화 및 컨텐츠 검색`
- 미디어 쿼리를 이용한 `반응형 웹 구현`

## 기술스택
- Programming Language : `Typescript` 
- FrontEnd Framework : `React`
- Style library : `Styled-components`
- Animation library : `Framer-motion` 
- Data Management : `React-query`
- Form library : `React-Hook-Form`
- Responsive library : `useMediaQuery`
- Deploy, CI/CD : `Netlify`

## 트러블 슈팅
> env apikey 401 error - env 에러
- 환경변수에 API Key를 저장해서 사용하려 했으나, HTTP 401 (Unauthorized) error가 발생한 문제.
- `dotenv` 패키지를 사용하여 해결하려 했으나, API 키를 올바르게 구문해석하여 필요가 없었음.
- fetch URL을 따로 변수에 담아 서버를 재시작하니 정상동작.
```js
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";


export async function getMovies(kind: string) {
  return await (
    await fetch(
      `${BASE_PATH}/movie/${kind}?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}
```
> 리액트 헬멧 에러
```
react_devtools_backend.js:4026 Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: SideEffect(NullComponent)
```
- react-helmet이 호출될 때 사용한 메소드가 react-side-effect에 노출되어 더이상 helmet 컴포넌트만 쓸수 없는 문제.
- react-helmet-async 패키지를 설치하고 <HelmetProvider>를 통해 캡슐화 진행
```jsx
import { Helmet, HelmetProvider } from 'react-helmet-async'

<HelmetProvider>
  <Helmet>
    <title>
      {detailData.title
        ? detailData.title
        : detailData.original_title}
    </title>
  </Helmet>
</HelmetProvider>
```

> 검색 여러번 할 시 해당 키워드 검색창으로 넘어가지 않는문제
- 키워드를 입력하면 키워드에 관련한 컨텐츠를 api 요청하여 DOM에 뿌려주는 작업.
- 허나, 아무리 입력해도 URL은 잘 바뀌는데 DOM에 응답받은 api들이 없어 이전 검색내용을 그대로 렌더링.
- Network 창을 확인해보니, fetching을 총 3번하는데 (검색키워드 관련된 컨텐츠 확인 get요청, 영화 컨텐츠 get 요청, 시리즈 컨텐츠 get 요청) 한번에 요청하는게 많다보니 응답 속도가 5초가 걸려 렌더링이 안되어 보였던 상태.
- fetch 로직을 수정하여 3번 요청하지않고 1번에 요청, 응답속도를 줄여 해결완료.
```js
export async function getSearchKey(keyword: string, type: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}`
    )
  ).json();
}
```