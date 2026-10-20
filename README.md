# Root4 홈페이지

React 19 + Vite로 구현한 UI/UX 기획·디자인 스튜디오 프로토타입입니다.

```sh
npm ci
npm run dev
```

배포 빌드: `npm run build`. 빌드 확인: `npm run preview`.

- `/`: 스크롤에 반응하는 프로젝트 갤러리와 회사 소개
- `/work`: 분야별 프로젝트 목록, `/work/:id`: 프로젝트 상세
- `/about`: 작업 방식과 기획·디자인 업무 범위
- `/lab`: 실험·인사이트 목록, `/lab/:slug`: 노트 상세
- `/contact`: 프로젝트 문의 안내와 데모 양식

로고·회사명은 **Root4**로 표기합니다. 모든 프로젝트와 노트는 구성 예시이며, 문의 전송은 연결되지 않았습니다.

콘텐츠는 `src/data.js`에서 관리합니다. 실행 환경과 인터랙션 설명은 [DEVELOPMENT.md](DEVELOPMENT.md)를 참고하세요. Vercel 경로 처리는 `vercel.json`에 포함되어 있습니다.
