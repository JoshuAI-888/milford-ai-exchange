insert into public.teams (name, slug, description) values
('Investment Research','investment-research','Company, sector, macro and security research prompts.'),
('Portfolio Management','portfolio-management','Portfolio construction, position review and IC workflows.'),
('Performance & Risk','performance-risk','Performance attribution, liquidity, risk and governance prompts.'),
('Quant / Data Science','quant-data-science','Quant research, modelling, backtesting and analytics prompts.'),
('Client Services','client-services','Client query, service, complaint and communication prompts.'),
('Wealth / Advice','wealth-advice','Adviser preparation and client discussion support prompts.'),
('Marketing','marketing','Market commentary, fund updates and content prompts.'),
('Operations','operations','SOP, exception and process improvement prompts.'),
('Technology & Data','technology-data','SQL, Power BI, data engineering and architecture prompts.'),
('Executive / Management','executive-management','Board papers, strategy, decision memos and leadership prompts.')
on conflict (slug) do nothing;

insert into public.categories (name, slug) values
('Investment Research','investment-research'),('Portfolio Management','portfolio-management'),('Performance & Risk','performance-risk'),('Quantitative Research','quantitative-research'),('Client Services','client-services'),('Technology & Data','technology-data'),('Management','management')
on conflict (slug) do nothing;

insert into public.tags (name) values ('earnings'),('research'),('equities'),('ic'),('memo'),('performance'),('risk'),('client'),('email'),('sql'),('data-quality') on conflict (name) do nothing;

with t as (select id,name from public.teams), c as (select id,name from public.categories)
insert into public.prompts (title, slug, description, body, expected_output, model, risk, status, version, owner_name, team_id, category_id)
values
('Earnings Result Deep Dive','earnings-result-deep-dive','Turn a result release into investment-grade observations, risks and questions.','Analyse {{company}} latest earnings release. Focus on revenue quality, margin drivers, cash flow, guidance, balance sheet, management tone, market reaction, bull/base/bear interpretation, key follow-up questions and portfolio relevance. Do not invent facts. Flag missing evidence.','Executive summary, positives, concerns, thesis impact, questions for management.','Claude','medium','approved','1.0','Investment Enablement',(select id from t where name='Investment Research'),(select id from c where name='Investment Research')),
('Investment Committee Memo Builder','investment-committee-memo-builder','Creates a structured IC memo from source notes and analyst thesis.','Using the notes below, draft an investment committee memo. Include recommendation, thesis, valuation, catalysts, downside case, position sizing logic, liquidity, risk controls and what would make us wrong. Do not invent facts. Flag missing evidence.','IC-ready memo with explicit risks and missing evidence.','Claude','high','approved','1.0','Portfolio Office',(select id from t where name='Portfolio Management'),(select id from c where name='Portfolio Management')),
('Performance Attribution Narrative','performance-attribution-narrative','Explains fund performance drivers in clear language for governance or client-facing review.','Convert this attribution data into a clear narrative. Separate allocation, selection, currency, market beta and one-off effects. Highlight material contributors/detractors, data caveats and client-safe wording risks.','Clear performance narrative with data caveats.','ChatGPT','high','approved','1.0','Performance & Risk',(select id from t where name='Performance & Risk'),(select id from c where name='Performance & Risk')),
('Client Email Draft - Plain English','client-email-draft-plain-english','Drafts a helpful client response while avoiding personal financial advice leakage.','Draft a concise, empathetic client email using the facts provided. Keep it plain English. Do not provide personal financial advice. Escalate if the query requires advice, complaint handling, legal judgement or account-specific recommendations.','Client-safe response draft and escalation flag.','Copilot','high','approved','1.0','Client Services',(select id from t where name='Client Services'),(select id from c where name='Client Services')),
('SQL Logic Review','sql-logic-review','Reviews SQL for business logic, join grain, duplication, performance and maintainability.','Review this SQL. Identify grain issues, join duplication risk, incorrect filters, inefficient CTEs, naming problems, missing test cases and optimisation opportunities. Return severity, issue, evidence, fix recommendation.','Issue list with severity and fixes.','Claude','low','approved','1.0','Data Team',(select id from t where name='Technology & Data'),(select id from c where name='Technology & Data'))
on conflict (slug) do nothing;

with t as (select id,name from public.teams)
insert into public.collections (title, slug, description, team_id)
values
('Investment Committee Pack','investment-committee-pack','From raw research to IC-ready memo.',(select id from t where name='Investment Research')),
('Client Response Pack','client-response-pack','Reusable prompts for consistent, safe client communication.',(select id from t where name='Client Services')),
('Performance & Risk Pack','performance-risk-pack','Governance-ready performance and risk narratives.',(select id from t where name='Performance & Risk')),
('Data Quality Review Pack','data-quality-review-pack','Prompt set for SQL, lineage and analytics quality review.',(select id from t where name='Technology & Data'))
on conflict (slug) do nothing;
