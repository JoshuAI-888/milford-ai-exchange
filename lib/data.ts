export type Prompt = {
  id: string; title: string; description: string; category: string; team: string; tags: string[];
  model: string; risk: 'Low' | 'Medium' | 'High'; rating: number; uses: number; status: string; owner: string; version: string; body: string;
};

export const teams = [
  'Investment Research','Portfolio Management','Performance & Risk','Quant / Data Science','Client Services','Wealth / Advice','Marketing','Operations','Technology & Data','Executive / Management'
];

export const prompts: Prompt[] = [
  { id:'earnings-review', title:'Earnings Result Deep Dive', description:'Turn a result release into investment-grade observations, risks and questions.', category:'Investment Research', team:'Investment Research', tags:['earnings','research','equities'], model:'Claude', risk:'Medium', rating:4.8, uses:142, status:'Approved', owner:'Investment Enablement', version:'1.0', body:'Analyse {{company}} latest earnings release. Focus on revenue quality, margin drivers, cash flow, guidance, balance sheet, management tone, market reaction, bull/base/bear interpretation, key follow-up questions and portfolio relevance. Output as: executive summary, positives, concerns, thesis impact, questions for management.'},
  { id:'ic-pack', title:'Investment Committee Memo Builder', description:'Creates a structured IC memo from source notes and analyst thesis.', category:'Portfolio Management', team:'Portfolio Management', tags:['ic','memo','portfolio'], model:'Claude', risk:'High', rating:4.7, uses:96, status:'Approved', owner:'Portfolio Office', version:'1.0', body:'Using the notes below, draft an investment committee memo. Include recommendation, thesis, valuation, catalysts, downside case, position sizing logic, liquidity, risk controls and what would make us wrong. Do not invent facts. Flag missing evidence.'},
  { id:'performance-attribution', title:'Performance Attribution Narrative', description:'Explains fund performance drivers in clear language for governance or client-facing review.', category:'Performance & Risk', team:'Performance & Risk', tags:['performance','risk','attribution'], model:'ChatGPT', risk:'High', rating:4.6, uses:118, status:'Approved', owner:'Performance & Risk', version:'1.0', body:'Convert this attribution data into a clear narrative. Separate allocation, selection, currency, market beta and one-off effects. Highlight material contributors/detractors, data caveats and client-safe wording risks.'},
  { id:'client-email', title:'Client Email Draft - Plain English', description:'Drafts a helpful client response while avoiding personal financial advice leakage.', category:'Client Services', team:'Client Services', tags:['email','client','service'], model:'Copilot', risk:'High', rating:4.5, uses:173, status:'Approved', owner:'Client Services', version:'1.0', body:'Draft a concise, empathetic client email using the facts provided. Keep it plain English. Do not provide personal financial advice. Escalate if the query requires advice, complaint handling, legal judgement or account-specific recommendations.'},
  { id:'sql-review', title:'SQL Logic Review', description:'Reviews SQL for business logic, join grain, duplication, performance and maintainability.', category:'Technology & Data', team:'Technology & Data', tags:['sql','data','quality'], model:'Claude', risk:'Low', rating:4.9, uses:221, status:'Approved', owner:'Data Team', version:'1.0', body:'Review this SQL. Identify grain issues, join duplication risk, incorrect filters, inefficient CTEs, naming problems, missing test cases and optimisation opportunities. Return severity, issue, evidence, fix recommendation.'}
];

export const collections = [
  { id:'investment-committee-pack', title:'Investment Committee Pack', description:'From raw research to IC-ready memo.', team:'Investment Research', prompts:['Earnings Result Deep Dive','Investment Committee Memo Builder'] },
  { id:'client-response-pack', title:'Client Response Pack', description:'Reusable prompts for consistent, safe client communication.', team:'Client Services', prompts:['Client Email Draft - Plain English'] },
  { id:'performance-risk-pack', title:'Performance & Risk Pack', description:'Governance-ready performance and risk narratives.', team:'Performance & Risk', prompts:['Performance Attribution Narrative'] },
  { id:'data-quality-pack', title:'Data Quality Review Pack', description:'Prompt set for SQL, lineage and analytics quality review.', team:'Technology & Data', prompts:['SQL Logic Review'] }
];
