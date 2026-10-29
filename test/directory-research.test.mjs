import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CATEGORIES,entry} from '../lib/directory/model.mjs';

const batch=JSON.parse(fs.readFileSync(new URL('../content/submissions/research/2026-10-29-500-sites.json',import.meta.url)));
const host=url=>new URL(url).hostname.toLowerCase().replace(/^www\./,'');
const normalizedName=name=>name.toLowerCase().replace(/[^a-z0-9]/g,'');
function domain(url){const value=host(url),parts=value.split('.');if(/\.(co\.uk|com\.au|com\.br|co\.jp)$/.test(value))return parts.slice(-3).join('.');if(/\.(vercel\.app|netlify\.app|github\.io)$/.test(value))return value;return parts.slice(-2).join('.');}

test('AI Agents is available to intake without granting approval or broadening roles',()=>{
  assert(CATEGORIES.includes('AI Agents'));
  const candidate=batch.candidates.find(c=>c.entry.lead_category==='AI Agents');
  assert(candidate);
  assert.equal(entry(candidate.entry).verification_status,'pending_audit');
  assert.throws(()=>entry({...candidate.entry,verification_status:'verified'}));
});

test('research contains exactly 500 distinct, unapproved candidates with availability evidence',()=>{
  assert.equal(batch.candidate_count,500);assert.equal(batch.candidates.length,500);
  assert.equal(batch.approved,false);assert.equal(batch.research_status,'awaiting_review');
  const ids=new Set(),names=new Set(),hosts=new Set();
  // Historical intake stays immutable when individual candidates are later accepted.
  const baselineNames=new Set(batch.baseline_index.normalized_names),baselineDomains=new Set(batch.baseline_index.domains);
  assert.equal(batch.baseline_entries,1031);assert.equal(baselineNames.size,1031);
  for(const c of batch.candidates){
    assert(!ids.has(c.id));ids.add(c.id);
    const name=c.entry.name.toLowerCase();assert(!names.has(name));names.add(name);
    for(const value of new Set([host(c.entry.primary_url),host(c.evidence.final_url)])){
      assert(!hosts.has(value),value);hosts.add(value);
    }
    assert.equal(c.review.accepted,false);assert.equal(c.review.status,'awaiting_review');
    assert.equal(c.evidence.http_status,200);assert.equal(c.evidence.availability,'reachable-html');
    assert(c.evidence.title);assert.match(c.evidence.checked_at,/^2026-10-29T/);
    assert.match(c.evidence.sample_sha256,/^[a-f0-9]{64}$/);
    assert(new URL(c.evidence.discovery_url).protocol==='https:');
    assert.equal(entry(c.entry).verification_status,'pending_audit');
    assert(!baselineNames.has(normalizedName(c.entry.name)),c.entry.name);
    assert(!baselineDomains.has(domain(c.entry.primary_url)),c.entry.primary_url);
    assert(!baselineDomains.has(domain(c.evidence.final_url)),c.evidence.final_url);
  }
  assert.equal(Object.values(batch.categories).reduce((sum,n)=>sum+n,0),500);
  assert(batch.categories['AI Agents']>0);
  for(const c of batch.candidates.filter(c=>c.entry.lead_category==='AI Agents')){
    assert(!c.entry.ecosystem.some(chain=>chain.toLowerCase()==='unknown'));
    assert(c.review.checks_remaining.includes('live product or app'));
  }
});
