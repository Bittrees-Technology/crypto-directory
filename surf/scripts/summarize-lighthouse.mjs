import {readFile,writeFile,appendFile} from 'node:fs/promises';

const folder=process.argv[2]||'surf-seo-artifacts';
const summaries=[];
for(const strategy of ['mobile','desktop']){
  const report=JSON.parse(await readFile(folder+'/'+strategy+'.json','utf8'));
  if(report.runtimeError)throw Error(strategy+': '+report.runtimeError.message);
  const scores=Object.fromEntries(Object.entries(report.categories).map(([id,c])=>[id,c.score===null?null:Math.round(c.score*100)]));
  const metrics=Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(id=>[id,{display:report.audits[id]?.displayValue,value:report.audits[id]?.numericValue}]));
  const findings=Object.values(report.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,display:a.displayValue,nodes:(a.details?.items||[]).flatMap(item=>item.node?[item.node.snippet]:[]).slice(0,5)}));
  const summary={strategy,lighthouseVersion:report.lighthouseVersion,fetchTime:report.fetchTime,url:report.finalDisplayedUrl||report.finalUrl,scores,metrics,findings};
  summaries.push(summary);console.log(JSON.stringify({lighthouseLab:summary}));
}
await writeFile(folder+'/summary.json',JSON.stringify(summaries,null,2)+'\n');
if(process.env.GITHUB_STEP_SUMMARY){
  const lines=['## Surf Lighthouse lab audit','','These are lab measurements of the public site, not CrUX or field Core Web Vitals.','','| Profile | Performance | Accessibility | Best practices | SEO |','| --- | ---: | ---: | ---: | ---: |',...summaries.map(s=>'| '+s.strategy+' | '+s.scores.performance+' | '+s.scores.accessibility+' | '+s.scores['best-practices']+' | '+s.scores.seo+' |')];
  await appendFile(process.env.GITHUB_STEP_SUMMARY,lines.join('\n')+'\n');
}
