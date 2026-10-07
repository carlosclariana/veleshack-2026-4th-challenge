/* DOM behaviour tests. Install: npm install --prefix .browser-tools jsdom */
const fs=require('fs'),assert=require('assert'),path=require('path');
const {JSDOM}=require('../.browser-tools/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'arena/static/index.html'),'utf8');
const archive=JSON.parse(fs.readFileSync(path.join(root,'results/live-match.json'),'utf8'));
let fixture=structuredClone(archive),fail=false,tick,blob,tests=[];
const dom=new JSDOM(html,{url:'http://localhost:8091',runScripts:'dangerously',beforeParse(w){
 w.fetch=async url=>{if(fail)throw Error('offline');return {ok:true,json:async()=>url==='/v1/status'?fixture.status:fixture.leaderboard}};
 w.AbortSignal={timeout:()=>null};w.setTimeout=fn=>{if(fn.name==='tick')tick=fn;return 1};
 w.Blob=Blob;w.URL.createObjectURL=b=>{blob=b;return 'blob:test'};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
}});
const flush=()=>new Promise(r=>setImmediate(r));const $=id=>dom.window.document.getElementById(id);
async function check(name,fn){await fn();tests.push({name,passed:true})}
(async()=>{
 await flush();
 await check('Renders live API score, rank and eligible coverage',()=>{assert.equal($('score').textContent,'16,670');assert.equal($('coverage').textContent,'100 %');assert.equal($('rows').children.length,4);assert($('notice').hidden)});
 await check('Learning and evidence tabs switch panels',()=>{dom.window.document.querySelector('[data-tab=learn]').click();assert(!$('learn-panel').hidden);assert($('arena-panel').hidden);dom.window.document.querySelector('[data-tab=arena]').click()});
 await check('Presentation mode is reversible',()=>{$('present').click();assert(dom.window.document.body.classList.contains('present'));$('present').click();assert(!dom.window.document.body.classList.contains('present'))});
 await check('Archive is prominently labelled',()=>{$('replay').click();assert($('notice').textContent.includes('REPRODUCCIÓN'));assert($('mode-label').textContent.includes('archivada'))});
 await check('Export preserves source and real score',async()=>{$('export').click();const data=JSON.parse(await blob.text());assert.equal(data.source,'archived-live-match-77123');assert.equal(data.leaderboard[0].score,16.6697)});
 await check('Offline live data is marked stale',async()=>{$('replay').click();fail=true;await tick();assert(!$('notice').hidden);assert.equal($('connection').textContent,'Sin conexión');$('export').click();const saved=JSON.parse(await blob.text());assert.equal(saved.stale,true);assert.equal(saved.source,'archived-live-match-77123')});
 await check('Team names are escaped against markup injection',async()=>{fail=false;fixture.leaderboard.leaderboard[0].team='<img src=x onerror=alert(1)>';await tick();assert.equal($('rows').querySelectorAll('img').length,0);assert($('team-title').textContent.includes('<img'))});
 await check('Empty arena has an honest waiting state',async()=>{fixture.leaderboard.leaderboard=[];await tick();assert.equal($('score').textContent,'—');assert($('team-title').textContent.includes('Esperando'))});
 const result={test_type:'DOM behaviour; not a visual browser render',passed:tests.length,tests};fs.writeFileSync(path.join(root,'results/dashboard-tests.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));dom.window.close();
})().catch(e=>{console.error(e);dom.window.close();process.exit(1)});
