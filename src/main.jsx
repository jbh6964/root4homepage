import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {notes} from './data';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import './style.css';
import ScrollGallery from './ScrollGallery';

function Modal({item,onClose}){
 const ref=useRef();
 useEffect(()=>{
  const previous=document.activeElement;const y=window.scrollY;
  document.body.style.position='fixed';document.body.style.top=`-${y}px`;document.body.style.width='100%';
  ref.current.querySelector('button').focus();
  const key=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=ref.current.querySelectorAll('button,a,input,textarea');const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo({top:y,behavior:'instant'});previous?.focus({preventScroll:true})};
 },[onClose]);
 return <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose()}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
 <div className="modal-top"><span>ROOTFO / {item.id?'PROJECT STUDY':'NOTES'}</span><button onClick={onClose} aria-label="상세 닫기">닫기 <span>×</span></button></div>
 <p className="eyebrow">{item.id?'구성 예시 · CONCEPT PROJECT':'예시 콘텐츠 · LAB / NOTES'}</p><h2 id="modal-title">{item.name||item.title}</h2>
 {item.id?<><p className="modal-desc">{item.description}</p><img className="detail-image" src={`/projects/${item.id}.svg`} alt={`${item.brand} UI 디자인 목업`}/><div className="detail-columns"><h3>우리가 설계한 범위</h3><div><p>아래는 본 프로토타입에서 제안하는 작업 범위 예시입니다. 실제 고객 프로젝트나 수행 실적이 아닙니다.</p>{item.work.map((w,i)=><p className="scope-line" key={w}><span>0{i+1}</span>{w}</p>)}</div></div></>:<><div className={`note-art ${item.art}`} aria-hidden="true">{item.art==='ai'?<><span>Human</span><i>×</i><span>AI</span></>:item.art==='motion'?<><i/><i/><i/></>:<span>Why?</span>}</div><p className="modal-desc">{item.text}</p><p>이 글은 루트포의 탐구 방향을 보여주는 예시 콘텐츠입니다. 실험 결과나 실제 수행 사례로 제시되지 않습니다.</p><p>질문을 정리하고, 작은 프로토타입을 만들고, 사람의 관점에서 다시 검토합니다. 도구보다 중요한 것은 경험을 이해하는 일이라고 생각합니다.</p></>}
 <button className="text-link" onClick={onClose}>목록으로 돌아가기 ↗</button></section></div>
}
function Contact({close}){
 const [copied,setCopied]=useState(false);
 return <div className="contact-demo"><p>프로토타입 안내</p><h3>좋은 대화의 시작을<br/>준비하고 있습니다.</h3><p>현재는 문의 전송 기능이 연결되지 않은 데모입니다.<br/>문의 채널과 실제 연락처는 오픈 시 등록됩니다.</p><button onClick={async()=>{try{await navigator.clipboard.writeText('프로젝트 분야:\n현재 고민:\n필요한 작업 범위:\n희망 일정:\n연락처:');setCopied(true)}catch{setCopied(false)}}}>{copied?'문의 양식을 복사했습니다 ✓':'문의 양식 복사 ↗'}</button><button onClick={close}>닫기 ×</button><span role="status">{copied?'복사한 양식에 프로젝트 내용을 정리해 보세요.':''}</span></div>
}
function App(){
 const [selected,setSelected]=useState(null),[contact,setContact]=useState(false),[active,setActive]=useState('work');
 const [cursor,setCursor]=useState({x:0,y:0,visible:false});
 const close=React.useCallback(()=>{if(history.state?.rootfo)history.back();else setSelected(null)},[]);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('main > section[id]').forEach(el=>sections.observe(el));
  return()=>{observer.disconnect();sections.disconnect()};
 },[]);
 useEffect(()=>{const fn=()=>setSelected(null);addEventListener('popstate',fn);return()=>removeEventListener('popstate',fn)},[]);
 const open=p=>{history.pushState({rootfo:true},'');setCursor(c=>({...c,visible:false}));setSelected(p)};
 return <><a href="#work" className="skip">프로젝트 바로가기</a><header className="site-header"><a className="logo" href="#top" aria-label="ROOTFO 홈">ROOTFO<span className="logo-mark">✳</span></a><nav aria-label="주 메뉴">{['Work','About','Lab','Contact'].map(n=><a key={n} href={`#${n.toLowerCase()}`} className={active===n.toLowerCase()?'active':''}>{n}</a>)}</nav><span className="header-note">Seoul, KR <span className="status-dot"/></span></header>
 <main id="top"><ScrollGallery onOpen={open} onPointerMove={e=>setCursor({x:e.clientX,y:e.clientY,visible:e.pointerType==='mouse'})} onPointerLeave={()=>setCursor(c=>({...c,visible:false}))}/>
 <section id="about" className="about"><div className="ghost-type" aria-hidden="true">TOGETHER, BETTER.</div><div className="section-bar"><h2>Our Approach</h2><span>기획과 디자인 사이, 경계를 넘어</span></div><div className="about-content reveal"><p className="eyebrow">THINK TOGETHER. MAKE BETTER.</p><h2>좋은 질문을 나누고,<br/>하나의 경험을 만듭니다<span>.</span></h2><p>기획은 방향을 찾고, 디자인은 가능성을 구체화합니다.<br/>루트포는 처음부터 끝까지 함께 고민하며<br/>서비스에 꼭 필요한 답을 찾아갑니다.</p></div><div className="process">{[['Understand','문제 이해','사용자와 비즈니스의 맥락을 읽습니다.'],['Structure','구조 설계','복잡함을 정리하고 흐름을 만듭니다.'],['Design','디자인','명확한 구조를 감각적인 경험으로.'],['Refine','검토','직접 사용하고, 더 나은 답을 찾습니다.']].map((a,i)=><div key={a[0]}><span className="process-num">0{i+1} <span>↗</span></span><h3>{a[0]}</h3><h4>{a[1]}</h4><p>{a[2]}</p></div>)}</div></section>
 <section id="lab" className="lab"><div className="section-bar"><h2>Lab / Notes <sup>(03)</sup></h2><span>더 나은 경험을 위한 작은 탐구</span><span className="example">예시 콘텐츠</span></div><div className="notes">{notes.map((n,i)=><button className="note reveal" key={n.tag} onClick={()=>open(n)}><div className={`note-art ${n.art}`} aria-hidden="true">{i===0?<><span>Human</span><i>×</i><span>AI</span></>:i===1?<><i/><i/><i/></>:<span>Why?</span>}<b>↗</b></div><span className="note-tag">{n.tag} <span>EXAMPLE / 0{i+1}</span></span><h3>{n.title}</h3><p>{n.text}</p></button>)}</div></section>
 <section id="contact" className="contact"><div className="contact-heading"><span className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</span><span className="status-dot"/></div><p>만들고 싶은 서비스나<br/>현재 고민을 알려주세요.</p><button className="contact-cta" onClick={()=>setContact(!contact)}>함께 시작하기 <span>↗</span></button>{contact&&<Contact close={()=>setContact(false)}/>}<div className="contact-foot"><span>새로운 가능성은 대화에서 시작됩니다.</span><span>PROJECT INQUIRY</span></div></section></main>
 <footer><a href="#top" className="logo">ROOTFO<span className="logo-mark">✳</span></a><p>기획과 디자인으로, 더 나은 경험을.</p><span>© {new Date().getFullYear()} ROOTFO</span><a href="#top">Back to top ↑</a></footer><div className={`custom-cursor ${cursor.visible?'visible':''}`} style={{transform:`translate3d(${cursor.x+16}px,${cursor.y+16}px,0)`}}>View project ↗</div>{selected&&<Modal item={selected} onClose={close}/>}</>
}
createRoot(document.getElementById('root')).render(<App/>);
