export function bindVisitLink(link, visit) {
  link.addEventListener('click', event => { if (event.button === 0) visit(); });
  link.addEventListener('auxclick', event => { if (event.button === 1) visit(); });
}
export function clearViewer(doc=document) {
  const byId=id=>doc.getElementById(id);
  byId('site-frame').removeAttribute('src');byId('site-frame').hidden=true;
  byId('site-stage').hidden=true;byId('browserbar').hidden=true;byId('welcome').hidden=false;
  for(const id of ['open-site','fallback-open','help-open'])byId(id).removeAttribute('href');
  for(const id of ['site-name','site-domain','site-kind','fallback-title','fallback-description'])byId(id).textContent='';
  byId('save-project').disabled=true;byId('save-project').setAttribute('aria-pressed','false');
}
