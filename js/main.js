/* =====================================================================
   광주세계맥주축제 - main.js
   ---------------------------------------------------------------------
   [목차]
     [DATA]  콘텐츠 데이터 (맥주 / 푸드 / 구역 / 공연 / 티켓)  ← 내용 수정은 여기!
     01. 공통 유틸 & 이미지 대체(fallback)
     02. 헤더 스크롤 효과 & 모바일 메뉴
     03. (CSS) 부드러운 스크롤 - style.css 의 scroll-behavior 사용
     04. Scrollspy - 스크롤 위치에 따른 GNB 하이라이트
     05. 패럴렉스 효과 (data-parallax 속성)
     06. Hero 맥주 탄산 기포 파티클 (Canvas)
     07. 카운트다운 타이머
     08. 인포그래픽 숫자 카운트업
     09. 맥주 라인업 렌더링 + 필터링 모션
     10. 공용 모달 (맥주 상세 / 영상 / 티켓)
     11. 푸드 페어링 카러셀 (버튼·도트·자동재생·스와이프)
     12. 구역 안내 지도 (Zone Map)
     13. 공연 타임테이블 탭 + 아티스트 영상
     14. 교통수단 탭 & 주소 복사
     15. FAQ 카테고리 필터 + 아코디언
     16. 플로팅 CTA / TOP 버튼
     17. 티켓 예매 모달
     18. 스크롤 등장 애니메이션 (.reveal)
   ※ 외부 라이브러리 없이 순수 JavaScript(ES6)로 작성했습니다.
   ===================================================================== */

'use strict';

/* =====================================================================
   [DATA] 콘텐츠 데이터
   · 항목을 추가하려면 { ... } 블록을 복사해서 쉼표(,)로 이어 붙이세요.
   · img : 이미지 주소. 직접 촬영한 사진은 'images/파일명.jpg' 로 교체 권장.
   ===================================================================== */

/* 축제 개막 일시 (카운트다운 기준) - 형식: 'YYYY-MM-DDTHH:MM:SS+09:00' */
const FESTIVAL_START = new Date('2026-10-23T17:00:00+09:00');
const FESTIVAL_END   = new Date('2026-10-25T23:00:00+09:00');

/* 이미지 주소 생성 도우미 (키워드 기반 무료 이미지 - loremflickr)
   lock 번호를 바꾸면 다른 사진이 나옵니다. 실제 운영 시 자체 이미지로 교체하세요. */
const photo = (keyword, lock, w = 600, h = 600) =>
  `https://loremflickr.com/${w}/${h}/${keyword}?lock=${lock}`;

/* 맥주 라인업
   region : europe | asia | america | korea   (대륙 필터 값)
   style  : lager | ale | ipa | stout | wheat (스타일 필터 값) */
const BEERS = [
  { name: '바이에른 헬레스',   country: '🇩🇪 독일',    region: 'europe',  style: 'lager', styleLabel: '라거',     abv: '5.0%', ibu: 18, desc: '뮌헨 전통 방식의 부드럽고 깔끔한 황금빛 라거. 은은한 몰트 단맛이 특징입니다.', pair: '소시지, 프레첼', img: 'images/b1.png'},
  { name: '브뤼셀 화이트',     country: '🇧🇪 벨기에',  region: 'europe',  style: 'wheat', styleLabel: '밀맥주',   abv: '4.9%', ibu: 13, desc: '오렌지 껍질과 코리앤더가 더해진 상큼한 벨지안 윗비어.', pair: '샐러드, 해산물', img: 'images/b2.png'},
  { name: '더블린 드라이 스타우트', country: '🇮🇪 아일랜드', region: 'europe', style: 'stout', styleLabel: '스타우트', abv: '4.2%', ibu: 40, desc: '로스팅한 보리의 커피·초콜릿 향과 크리미한 거품.', pair: '굴, 초콜릿 디저트', img: 'images/b3.png' },
  { name: '런던 페일 에일',     country: '🇬🇧 영국',    region: 'europe',  style: 'ale',   styleLabel: '에일',     abv: '5.2%', ibu: 35, desc: '비스킷 같은 몰트와 영국산 홉의 흙내음이 조화로운 클래식 에일.', pair: '피시앤칩스', img: 'images/b4.png' },
  { name: '삿포로 클래식 라거', country: '🇯🇵 일본',    region: 'asia',    style: 'lager', styleLabel: '라거',     abv: '5.0%', ibu: 20, desc: '청량하고 드라이한 피니시의 일본식 라거.', pair: '꼬치구이, 가라아게', img: 'images/b5.jpg' },
  { name: '칭다오 필스너',     country: '🇨🇳 중국',    region: 'asia',    style: 'lager', styleLabel: '라거',     abv: '4.7%', ibu: 16, desc: '라오산 광천수로 빚은 가볍고 시원한 필스너.', pair: '양꼬치, 마라요리', img: 'images/b6.png' },
  { name: '웨스트코스트 IPA',  country: '🇺🇸 미국',    region: 'america', style: 'ipa',   styleLabel: 'IPA',      abv: '6.8%', ibu: 65, desc: '자몽·솔향 가득한 시트러스 홉과 쌉쌀한 피니시.', pair: '버거, 매운 요리', img: 'images/b7.jpg' },
  { name: '멕시칸 라이트 라거', country: '🇲🇽 멕시코',  region: 'america', style: 'lager', styleLabel: '라거',     abv: '4.5%', ibu: 10, desc: '라임 한 조각과 잘 어울리는 가벼운 라거.', pair: '타코, 나초',  img: 'images/b1.png' },
  { name: '무등산 IPA',        country: '🇰🇷 광주',    region: 'korea',   style: 'ipa',   styleLabel: 'IPA',      abv: '6.2%', ibu: 55, desc: '광주 지역 브루어리가 무등산의 사계절을 담아 빚은 시그니처 IPA.', pair: '수육, 전', img: 'images/b5.jpg'},
  { name: '양림 골든 에일',    country: '🇰🇷 광주',    region: 'korea',   style: 'ale',   styleLabel: '에일',     abv: '5.0%', ibu: 25, desc: '근대역사문화마을 양림동에서 영감을 받은 꽃향 가득한 골든 에일.', pair: '치킨, 감자튀김', img: 'images/b4.png' },
  { name: '충장 흑맥',         country: '🇰🇷 광주',    region: 'korea',   style: 'stout', styleLabel: '스타우트', abv: '5.5%', ibu: 38, desc: '보리 커피 같은 고소함이 매력적인 광주 수제 스타우트.', pair: '떡갈비, 디저트', img: 'images/b2.png' },
  { name: '남도 쌀 바이젠',    country: '🇰🇷 전남',    region: 'korea',   style: 'wheat', styleLabel: '밀맥주',   abv: '4.8%', ibu: 12, desc: '남도산 쌀을 더해 바나나 향과 부드러움을 살린 바이젠.', pair: '해물파전', img: 'images/b1.png' }
];

/* 푸드 페어링 존 */
const FOODS = [
  { name: '수제 소시지 플래터', desc: '독일식 브라트부어스트와 사워크라우트', pair: '🍺 헬레스 라거와 찰떡', img: photo('sausage', 31, 600, 450) },
  { name: '버팔로 윙',          desc: '매콤달콤 소스를 입힌 바삭한 치킨윙',   pair: '🍺 웨스트코스트 IPA 추천', img: photo('chickenwings', 32, 600, 450) },
  { name: '피시앤칩스',         desc: '맥주 반죽으로 튀긴 대구살과 감자튀김', pair: '🍺 런던 페일 에일 추천', img: photo('fishandchips', 33, 600, 450) },
  { name: '소프트 프레첼',      desc: '갓 구운 프레첼과 머스터드 딥',         pair: '🍺 모든 라거와 잘 어울려요', img: photo('pretzel', 34, 600, 450) },
  { name: '비프 타코',          desc: '라임과 고수를 곁들인 멕시칸 타코',     pair: '🍺 멕시칸 라이트 라거', img: photo('tacos', 35, 600, 450) },
  { name: '광주 떡갈비 슬라이더', desc: '광주 명물 떡갈비를 미니버거로',     pair: '🍺 충장 흑맥과 페어링', img: photo('slider,burger', 36, 600, 450) },
  { name: '트러플 감자튀김',    desc: '트러플 오일과 파마산 치즈',            pair: '🍺 양림 골든 에일 추천', img: photo('frenchfries', 37, 600, 450) }
];

/* 구역 안내 지도 - 키 이름은 index.html 의 data-zone 값과 같아야 합니다. */
const ZONES = {
  stage: { icon: '🎤', name: '메인 무대',     desc: 'DJ 파티와 라이브 공연이 펼쳐지는 축제의 중심',       items: ['공연 시간 17:00 – 23:00', '스탠딩 + 테이블석 운영', '골든벨 퀴즈쇼 매일 20:00'] },
  craft: { icon: '🍺', name: '수제맥주 부스', desc: '광주·전남 지역 브루어리 15곳 참여',                 items: ['무등산 IPA, 양림 골든 에일 등', '브루어 토크 & 시음', '코인 1개 = 시음 1잔'] },
  world: { icon: '🌍', name: '세계맥주 부스', desc: '30여 개국의 정통 맥주를 한자리에서',                 items: ['유럽 / 아시아 / 아메리카관', '블라인드 테이스팅 체험', '한정판 굿즈 판매'] },
  food:  { icon: '🚚', name: '푸드트럭존',    desc: '맥주와 어울리는 푸드트럭 20대 운영',                 items: ['소시지, 윙, 타코, 떡갈비 등', '현금·카드·간편결제 가능', '분리수거 스테이션 운영'] },
  event: { icon: '🎯', name: '이벤트존',      desc: '체험 프로그램과 포토존',                             items: ['나만의 맥주잔 만들기', '맥주 퀴즈 & 경품 이벤트', '인생네컷 포토부스'] },
  rest:  { icon: '🛋️', name: '휴게존',        desc: '잠시 쉬어가는 라운지 공간',                          items: ['빈백 & 파라솔 테이블', '휴대폰 충전 스테이션', '무료 생수 제공'] },
  wc:    { icon: '🚻', name: '편의시설',      desc: '화장실 · 의무실 · 분실물센터',                       items: ['남/여 화장실, 장애인 화장실', '의무실(응급구조사 상주)', '분실물·미아보호센터'] },
  gate:  { icon: '🎟️', name: '입구 · 매표소', desc: '입장 및 성인 인증 손목밴드 지급',                    items: ['신분증 지참 필수 (만 19세 이상)', '현장 매표 · 모바일 티켓 확인', '시음잔·코인 수령'] }
};

/* 공연 타임테이블 - 키(day1…)는 index.html 탭 버튼의 data-day 값과 같아야 합니다.
   video : 영상 파일 주소(mp4). 공식 영상으로 교체하세요. 비우면 '영상 준비중' 안내가 뜹니다.
   ※ 현재 아티스트명은 예시(가상) 데이터입니다. */
const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const TIMETABLE = {
  day1: [
    { time: '17:30', stage: '버스킹', name: '소리마당 어쿠스틱', genre: '어쿠스틱 버스킹', song: '가을밤 산책',   img: photo('acoustic,guitar', 41, 800, 600), video: SAMPLE_VIDEO },
    { time: '19:00', stage: '메인',   name: '광주 브라스 크루',  genre: '브라스 밴드',     song: 'Golden Hour', img: photo('brass,band', 42, 800, 600),      video: SAMPLE_VIDEO },
    { time: '21:00', stage: '메인',   name: 'DJ 앰버웨이브',     genre: 'EDM / 하우스',    song: 'Amber Night', img: photo('dj,party', 43, 800, 600),        video: SAMPLE_VIDEO }
  ],
  day2: [
    { time: '17:30', stage: '버스킹', name: '무등 재즈 트리오',  genre: '재즈',            song: 'Blue Hops',   img: photo('jazz,trio', 44, 800, 600),       video: SAMPLE_VIDEO },
    { time: '19:30', stage: '메인',   name: '더 홉스 밴드',      genre: '록 / 모던록',     song: '거품처럼',     img: photo('rock,concert', 45, 800, 600),    video: SAMPLE_VIDEO },
    { time: '21:30', stage: '메인',   name: '네온 시티 팝',      genre: '시티팝 / 신스',   song: 'Neon Gwangju', img: photo('concert,lights', 46, 800, 600), video: SAMPLE_VIDEO }
  ],
  day3: [
    { time: '17:00', stage: '버스킹', name: '청춘 스트리트 댄스', genre: '댄스 퍼포먼스', song: 'Cheers!',     img: photo('streetdance', 47, 800, 600),     video: SAMPLE_VIDEO },
    { time: '19:00', stage: '메인',   name: '남도 소울 프로젝트', genre: 'R&B / 소울',    song: '남도의 밤',    img: photo('singer,stage', 48, 800, 600),    video: '' },
    { time: '21:00', stage: '메인',   name: 'DJ 폼(FOAM) 피날레', genre: '페스티벌 EDM', song: 'Last Call',   img: photo('festival,crowd', 49, 800, 600),  video: SAMPLE_VIDEO }
  ]
};

/* 티켓 종류 / 실제 예매처 주소 */
const TICKETS = [
  { id: 'early', name: '얼리버드 1일권', info: '10/15까지 한정 · 시음잔 + 코인 3개', price: 12000 },
  { id: 'day',   name: '일반 1일권',     info: '시음잔 + 코인 3개',                  price: 15000 },
  { id: 'pass',  name: '3일 자유이용권', info: '3일 입장 · 시음잔 + 코인 10개',      price: 35000 }
];
const TICKET_URL = 'https://tickets.interpark.com/'; // ← 실제 예매 페이지 주소로 교체


/* =====================================================================
   01. 공통 유틸 & 이미지 대체(fallback)
   ===================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const pad = (n) => String(n).padStart(2, '0');
const won = (n) => n.toLocaleString('ko-KR') + '원';

/* 이미지가 깨지면(주소 만료 등) 자동으로 대체 이미지 표시 */
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG' || img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = 'https://placehold.co/800x600/171D2A/FFB800?text=GWANGJU+BEER+FEST&font=montserrat';
}, true); // 캡처 단계에서 감지해야 img 오류를 잡을 수 있음

/* 토스트 메시지 */
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('is-show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}


/* =====================================================================
   02. 헤더 스크롤 효과 & 모바일 메뉴
   · 스크롤 50px 이상 → .is-scrolled (배경 진해짐)
   · 햄버거 클릭 → .gnb.is-open / 메뉴 링크 클릭 시 자동 닫힘
   ===================================================================== */
const header = $('#header');
const gnb = $('#gnb');
const menuToggle = $('#menuToggle');

function toggleMenu(force) {
  const open = typeof force === 'boolean' ? force : !gnb.classList.contains('is-open');
  gnb.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  document.body.classList.toggle('is-locked', open);
}
menuToggle.addEventListener('click', () => toggleMenu());
$$('.gnb__link').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 768) toggleMenu(false); });


/* =====================================================================
   04. Scrollspy - 현재 보이는 섹션의 메뉴에 .is-active
   · IntersectionObserver : 섹션이 화면 중앙부에 들어오면 감지
   ===================================================================== */
const navLinks = $$('.gnb__link');
const spySections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) =>
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' }); // 화면 가운데 띠 영역 기준
spySections.forEach((sec) => spyObserver.observe(sec));

/* Hero 영역으로 돌아오면 하이라이트 해제 */
new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) navLinks.forEach((a) => a.classList.remove('is-active'));
}, { threshold: 0.6 }).observe($('#hero'));


/* =====================================================================
   05. 패럴렉스 효과
   · HTML 요소에 data-parallax="0.3" 처럼 속도를 지정 (0 = 고정, 클수록 많이 움직임)
   · requestAnimationFrame 으로 스크롤 성능 최적화
   ===================================================================== */
const parallaxEls = $$('[data-parallax]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateParallax() {
  if (reduceMotion) return;
  const vh = window.innerHeight;
  parallaxEls.forEach((el) => {
    const rect = el.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) return;            // 화면 밖이면 계산 생략
    const speed = parseFloat(el.dataset.parallax) || 0;
    const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
}


/* =====================================================================
   06. Hero 맥주 탄산 기포 파티클 (Canvas)
   · BUBBLE_COUNT : 기포 개수 / 색상은 그라디언트 rgba 값에서 수정
   ===================================================================== */
(function bubbles() {
  const canvas = $('#bubbleCanvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, list = [], running = true;
  const BUBBLE_COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function create(randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 20,
      r: Math.random() * 5 + 1.5,                 // 반지름
      speed: Math.random() * 0.8 + 0.3,           // 상승 속도
      drift: Math.random() * 0.6 + 0.2,           // 좌우 흔들림 폭
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.2
    };
  }
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    list.forEach((b, i) => {
      b.y -= b.speed;
      b.phase += 0.02;
      b.x += Math.sin(b.phase) * b.drift;
      if (b.y < -20) list[i] = create(false);   // 위로 사라지면 아래에서 다시 생성
      const g = ctx.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 0, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(255,255,255,${b.alpha + 0.3})`);
      g.addColorStop(0.6, `rgba(255,214,102,${b.alpha * 0.5})`);
      g.addColorStop(1, 'rgba(255,184,0,0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${b.alpha * 0.6})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  resize();
  list = Array.from({ length: BUBBLE_COUNT }, () => create(true));
  draw();
  window.addEventListener('resize', resize);
  /* Hero가 화면 밖이면 애니메이션 일시정지 (배터리·성능 절약) */
  new IntersectionObserver(([en]) => {
    const was = running;
    running = en.isIntersecting;
    if (running && !was) draw();
  }).observe($('#hero'));
})();


/* =====================================================================
   07. 카운트다운 타이머
   · 개막 전 : "축제 개막까지" / 진행 중 : "축제 진행 중! 폐막까지" / 종료 후 : 종료 안내
   ===================================================================== */
(function countdown() {
  const label = $('#countdownLabel');
  const els = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
  let timer;

  function tick() {
    const now = Date.now();
    let target;
    if (now < FESTIVAL_START) { target = FESTIVAL_START; label.textContent = '🍻 축제 개막까지'; }
    else if (now < FESTIVAL_END) { target = FESTIVAL_END; label.innerHTML = '<span class="text-amber">🎉 축제 진행 중!</span> 폐막까지'; }
    else { label.textContent = '2026 축제가 종료되었습니다. 내년에 다시 만나요!'; Object.values(els).forEach((e) => (e.textContent = '00')); clearInterval(timer); return; }

    const diff = Math.max(0, target - now);
    els.d.textContent = pad(Math.floor(diff / 86400000));
    els.h.textContent = pad(Math.floor((diff / 3600000) % 24));
    els.m.textContent = pad(Math.floor((diff / 60000) % 60));
    els.s.textContent = pad(Math.floor((diff / 1000) % 60));
  }
  tick();
  timer = setInterval(tick, 1000);
})();


/* =====================================================================
   08. 인포그래픽 숫자 카운트업
   · 화면에 처음 보일 때 0 → data-count 값까지 1.6초간 증가
   ===================================================================== */
(function counters() {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1600;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
        el.textContent = Math.round(end * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);                                // 한 번만 실행
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach((el) => io.observe(el));
})();


/* =====================================================================
   09. 맥주 라인업 렌더링 + 필터링 모션
   · BEERS 데이터를 카드로 그린 뒤, 대륙/스타일 두 필터를 동시에 적용(AND 조건)
   · 모션 : 사라질 카드는 .is-out(축소·투명) → 0.3초 후 .is-hidden(제거)
            나타날 카드는 .is-hidden 해제 → 다음 프레임에 .is-out 해제
   ===================================================================== */
const beerGrid = $('#beerGrid');
const filterState = { region: 'all', style: 'all' };

function renderBeers() {
  beerGrid.innerHTML = BEERS.map((b, i) => `
    <button type="button" class="beer-card" data-index="${i}" data-region="${b.region}" data-style="${b.style}"
            aria-label="${b.name} 상세보기">
      <div class="beer-card__img"><img src="${b.img}" alt="${b.name}" loading="lazy"></div>
      <div class="beer-card__body">
        <p class="beer-card__country">${b.country}</p>
        <h4 class="beer-card__name">${b.name}</h4>
        <div class="beer-card__tags"><span>${b.styleLabel}</span><span>ABV ${b.abv}</span></div>
      </div>
    </button>`).join('');
}

function applyBeerFilter() {
  const cards = $$('.beer-card', beerGrid);
  let visible = 0;
  cards.forEach((card) => {
    const match = (filterState.region === 'all' || card.dataset.region === filterState.region) &&
                  (filterState.style === 'all' || card.dataset.style === filterState.style);
    if (match) {
      visible++;
      card.classList.remove('is-hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
    } else {
      card.classList.add('is-out');
      setTimeout(() => { if (card.classList.contains('is-out')) card.classList.add('is-hidden'); }, 300);
    }
  });
  $('#beerEmpty').hidden = visible > 0;
}

/* 필터 버튼 클릭 */
$$('.lineup .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const type = chip.dataset.filterType;
    filterState[type] = chip.dataset.filter;
    $$(`.lineup .chip[data-filter-type="${type}"]`).forEach((c) => c.classList.toggle('is-active', c === chip));
    applyBeerFilter();
  });
});

/* 카드 클릭 → 상세 모달 */
beerGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.beer-card');
  if (!card) return;
  const b = BEERS[card.dataset.index];
  openModal(`
    <div class="beer-detail">
      <div class="beer-detail__img"><img src="${b.img}" alt="${b.name}"></div>
      <div class="beer-detail__body">
        <p class="beer-card__country">${b.country}</p>
        <h3 id="modalTitle">${b.name}</h3>
        <p>${b.desc}</p>
        <div class="spec">
          <div><small>스타일</small><strong>${b.styleLabel}</strong></div>
          <div><small>도수</small><strong>${b.abv}</strong></div>
          <div><small>쓴맛(IBU)</small><strong>${b.ibu}</strong></div>
        </div>
        <p class="food-card__pair">🍽 추천 페어링 : ${b.pair}</p>
      </div>
    </div>`);
});

renderBeers();


/* =====================================================================
   10. 공용 모달
   · openModal(html) : 내용 넣고 열기 / closeModal() : 닫기
   · 닫기 방법 : X 버튼, 배경 클릭, ESC 키
   · 닫을 때 영상은 자동 정지(내용 비움), 포커스는 원래 버튼으로 복귀(접근성)
   ===================================================================== */
const modal = $('#modal');
const modalContent = $('#modalContent');
let lastFocus = null;

function openModal(html) {
  lastFocus = document.activeElement;
  modalContent.innerHTML = html;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  setTimeout(() => $('.modal__close', modal).focus(), 50);
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  setTimeout(() => { modalContent.innerHTML = ''; }, 300);
  if (lastFocus) lastFocus.focus();
}
modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('is-open')) closeModal();
    else if (gnb.classList.contains('is-open')) toggleMenu(false);
  }
});


/* =====================================================================
   11. 푸드 페어링 카러셀
   · 화면 폭에 따라 한 번에 보이는 카드 수 자동 계산 (CSS flex-basis 기준)
   · 이전/다음 버튼, 하단 도트, 4초 자동재생(마우스 올리면 정지), 터치 스와이프 지원
   · AUTOPLAY_MS 값으로 자동 넘김 속도 조절 (0 이면 자동재생 끔)
   ===================================================================== */
(function foodCarousel() {
  const track = $('#foodTrack');
  const dotsWrap = $('#foodDots');
  const carousel = $('#foodCarousel');
  const AUTOPLAY_MS = 4000;
  let index = 0, timer;

  track.innerHTML = FOODS.map((f) => `
    <article class="food-card">
      <div class="food-card__img"><img src="${f.img}" alt="${f.name}" loading="lazy"></div>
      <div class="food-card__body">
        <h4>${f.name}</h4>
        <p>${f.desc}</p>
        <span class="food-card__pair">${f.pair}</span>
      </div>
    </article>`).join('');

  const cards = $$('.food-card', track);

  /* 한 화면에 보이는 카드 수 계산 */
  const perView = () => {
    const cw = cards[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(carousel.clientWidth / cw));
  };
  const maxIndex = () => Math.max(0, cards.length - perView());

  function buildDots() {
    const count = maxIndex() + 1;
    dotsWrap.innerHTML = Array.from({ length: count }, (_, i) =>
      `<button type="button" aria-label="${i + 1}번째 슬라이드"></button>`).join('');
    $$('button', dotsWrap).forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  }
  function goTo(i) {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i;               // 끝에서는 처음으로 순환
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const x = index * (cards[0].getBoundingClientRect().width + gap);
    track.style.transform = `translate3d(${-x}px,0,0)`;
    $$('button', dotsWrap).forEach((d, n) => d.classList.toggle('is-active', n === index));
  }
  function restart() {
    clearInterval(timer);
    if (AUTOPLAY_MS && !reduceMotion) timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  $('#foodPrev').addEventListener('click', () => { goTo(index - 1); restart(); });
  $('#foodNext').addEventListener('click', () => { goTo(index + 1); restart(); });
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);

  /* 터치 스와이프 */
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    restart();
  });

  /* 화면 크기 변경 시 다시 계산 */
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { buildDots(); goTo(Math.min(index, maxIndex())); }, 150); });

  buildDots(); goTo(0); restart();
})();


/* =====================================================================
   12. 구역 안내 지도 (Zone Map)
   · 구역 버튼 클릭 → ZONES 데이터로 오른쪽 정보 패널 갱신(페이드인)
   ===================================================================== */
(function zoneMap() {
  const info = $('#zoneInfo');
  const zones = $$('.zonemap__zone');
  zones.forEach((btn) => {
    btn.addEventListener('click', () => {
      const z = ZONES[btn.dataset.zone];
      if (!z) return;
      zones.forEach((b) => b.classList.toggle('is-active', b === btn));
      info.innerHTML = `
        <div class="fade-in">
          <div class="zone-icon">${z.icon}</div>
          <h4>${z.name}</h4>
          <p>${z.desc}</p>
          <ul>${z.items.map((t) => `<li>${t}</li>`).join('')}</ul>
        </div>`;
      /* 모바일에서는 정보 패널이 지도 아래에 있으므로 보이도록 스크롤 */
      if (window.innerWidth <= 768) info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();


/* =====================================================================
   13. 공연 타임테이블 탭 + 아티스트 영상 모달
   · 탭 클릭 → 해당 날짜 TIMETABLE 데이터로 카드 재생성 (CSS fadeIn, 카드마다 시차)
   · 카드 호버 → 대표곡 + 재생 버튼 노출 / 재생 버튼 → 영상 모달(<video>)
   ※ 오시는길 지도를 Google Maps JavaScript API 로 바꾸려면:
     1) index.html 에 <script src="https://maps.googleapis.com/maps/api/js?key=발급키&callback=initMap" async></script>
     2) iframe 대신 <div id="map"></div> 를 두고 아래와 같이 작성
        function initMap(){ new google.maps.Map(document.getElementById('map'),{center:{lat:35.146,lng:126.840},zoom:16}); }
   ===================================================================== */
(function performanceSection() {
  const wrap = $('#timetable');
  const tabs = $$('.tabs__btn');
  let current = [];

  function render(day) {
    current = TIMETABLE[day] || [];
    wrap.innerHTML = current.map((a, i) => `
      <article class="artist-card" style="animation-delay:${i * 0.12}s">
        <div class="artist-card__img">
          <img src="${a.img}" alt="${a.name} 공연 사진" loading="lazy">
          <div class="artist-card__hover">
            <p>대표곡<strong>♪ ${a.song}</strong></p>
            <button type="button" class="play-btn" data-index="${i}" aria-label="${a.name} 영상 보기">▶</button>
          </div>
        </div>
        <div class="artist-card__body">
          <span class="artist-card__time">${a.time}</span><span class="artist-card__stage">${a.stage}</span>
          <h3 class="artist-card__name">${a.name}</h3>
          <p class="artist-card__genre">${a.genre}</p>
        </div>
      </article>`).join('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on);
      });
      render(tab.dataset.day);
    });
  });

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.play-btn');
    if (!btn) return;
    const a = current[btn.dataset.index];
    const media = a.video
      ? `<video src="${a.video}" controls autoplay playsinline poster="${a.img}"></video>`
      : `<div style="aspect-ratio:16/9;display:grid;place-items:center;background:#000;color:#9AA3B5">🎬 영상 준비중입니다</div>`;
    openModal(`
      <div class="video-detail">
        ${media}
        <div class="video-detail__body">
          <h3 id="modalTitle">${a.name}</h3>
          <p>${a.genre} · 대표곡 ♪ ${a.song} · ${a.time} ${a.stage} 무대</p>
        </div>
      </div>`);
  });

  render('day1');
})();


/* =====================================================================
   14. 교통수단 탭 & 주소 복사
   · 탭 버튼 data-target = 패널 id
   ===================================================================== */
(function transport() {
  const tabs = $$('.transport__tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on);
        $('#' + t.dataset.target).classList.toggle('is-active', on);
      });
    });
  });

  $('#copyAddr').addEventListener('click', async (e) => {
    const text = e.currentTarget.dataset.addr;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard API 미지원 환경(file:// 등) 대비 */
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    showToast('📋 주소가 복사되었습니다');
  });
})();


/* =====================================================================
   15. FAQ 카테고리 필터 + 아코디언(Slide Toggle)
   · 질문 클릭 → 답변 높이(scrollHeight)만큼 max-height 지정 → 부드럽게 펼침
   · 한 번에 하나만 열기 : ONLY_ONE_OPEN = true (false 면 여러 개 동시 열림)
   ===================================================================== */
(function faq() {
  const ONLY_ONE_OPEN = true;
  const items = $$('.faq__item');

  function setOpen(item, open) {
    const answer = $('.faq__a', item);
    item.classList.toggle('is-open', open);
    $('.faq__q', item).setAttribute('aria-expanded', open);
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
  }

  items.forEach((item) => {
    $('.faq__q', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      if (ONLY_ONE_OPEN) items.forEach((it) => it !== item && setOpen(it, false));
      setOpen(item, willOpen);
    });
  });

  /* 카테고리 필터 */
  $$('#faqFilter .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.filter;
      $$('#faqFilter .chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      items.forEach((item) => {
        const match = cat === 'all' || item.dataset.category === cat;
        if (match) {
          item.classList.remove('is-hidden');
          requestAnimationFrame(() => requestAnimationFrame(() => item.classList.remove('is-out')));
        } else {
          setOpen(item, false);
          item.classList.add('is-out');
          setTimeout(() => { if (item.classList.contains('is-out')) item.classList.add('is-hidden'); }, 300);
        }
      });
    });
  });

  /* 창 크기 변경 시 열린 답변 높이 재계산 */
  window.addEventListener('resize', () => items.filter((i) => i.classList.contains('is-open')).forEach((i) => setOpen(i, true)));
})();


/* =====================================================================
   16. 플로팅 CTA / TOP 버튼 + 스크롤 이벤트 통합
   · Hero 높이의 80%를 지나면 플로팅 예매 버튼 & TOP 버튼 표시
   ===================================================================== */
const floatingCta = $('#floatingCta');
const toTop = $('#toTop');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

let ticking = false;
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 50);
  const pastHero = y > $('#hero').offsetHeight * 0.8;
  floatingCta.classList.toggle('is-show', pastHero);
  toTop.classList.toggle('is-show', pastHero);
  updateParallax();
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();


/* =====================================================================
   17. 티켓 예매 모달
   · .js-open-ticket 클래스가 붙은 모든 버튼에서 열림
   · 권종 선택 + 수량(1~10매) → 합계 자동 계산 → 예매처(TICKET_URL)로 이동
   ===================================================================== */
(function ticket() {
  function open() {
    openModal(`
      <div class="ticket-detail">
        <h3 id="modalTitle">TICKET</h3>
        <p>2026 광주세계맥주축제 · 10.23(금) – 10.25(일)</p>
        <div class="ticket-list">
          ${TICKETS.map((t, i) => `
            <label class="ticket-option">
              <input type="radio" name="ticketType" value="${t.id}" ${i === 1 ? 'checked' : ''}>
              <span class="ticket-option__info"><strong>${t.name}</strong><small>${t.info}</small></span>
              <span class="ticket-option__price">${won(t.price)}</span>
            </label>`).join('')}
        </div>
        <div class="ticket-qty">
          <div class="qty-ctrl">
            <span style="min-width:auto;margin-right:12px;font-weight:600">수량</span>
            <button type="button" data-qty="-1" aria-label="수량 감소">−</button>
            <span id="qtyNum">1</span>
            <button type="button" data-qty="1" aria-label="수량 증가">+</button>
          </div>
          <p class="ticket-total">총 결제금액<strong id="ticketTotal"></strong></p>
        </div>
        <a href="${TICKET_URL}" target="_blank" rel="noopener" class="btn btn--primary btn--lg" id="ticketGo">예매처로 이동하기</a>
        <p class="note">※ 만 19세 이상만 주류 시음 가능 · 입장 시 신분증 확인</p>
      </div>`);

    let qty = 1;
    const update = () => {
      const t = TICKETS.find((x) => x.id === $('input[name="ticketType"]:checked', modal).value);
      $('#qtyNum').textContent = qty;
      $('#ticketTotal').textContent = won(t.price * qty);
    };
    $$('input[name="ticketType"]', modal).forEach((r) => r.addEventListener('change', update));
    $$('[data-qty]', modal).forEach((b) => b.addEventListener('click', () => {
      qty = Math.min(10, Math.max(1, qty + Number(b.dataset.qty)));
      update();
    }));
    update();
  }

  $$('.js-open-ticket').forEach((btn) => btn.addEventListener('click', () => {
    toggleMenu(false);
    open();
  }));
})();


/* =====================================================================
   18. 스크롤 등장 애니메이션
   · class="reveal" 요소가 화면에 들어오면 .is-visible 추가 (아래→위 페이드인)
   ===================================================================== */
(function reveal() {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
})();
