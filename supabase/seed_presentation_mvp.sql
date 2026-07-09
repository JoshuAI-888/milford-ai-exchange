-- Presentation-ready MVP seed data for the current Milford AI Exchange schema.
-- This script is idempotent and uses only the existing tables/columns.
-- Note: the current schema's prompt_status enum allows draft, pending_review, approved, archived.

begin;

insert into public.teams (name, slug, description) values
  ('Investment Research','investment-research','Research, sector, macro and security workflows.'),
  ('Portfolio Management','portfolio-management','Portfolio construction and investment committee workflows.'),
  ('Performance & Risk','performance-risk','Performance attribution, risk and governance prompts.'),
  ('Quant / Data Science','quant-data-science','Quant research, modelling and analytics prompts.'),
  ('Client Services','client-services','Client communication and service responses.'),
  ('Wealth / Advice','wealth-advice','Adviser preparation and client discussion support.'),
  ('Marketing','marketing','Content, market commentary and campaign prompts.'),
  ('Executive / Management','executive-management','Board papers and executive decision support.')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.categories (name, slug) values
  ('Investment Research','investment-research'),
  ('Portfolio Management','portfolio-management'),
  ('Performance & Risk','performance-risk'),
  ('Quantitative Research','quantitative-research'),
  ('Client Services','client-services'),
  ('Technology & Data','technology-data'),
  ('Management','management')
on conflict (slug) do update set
  name = excluded.name;

insert into public.tags (name) values
  ('earnings'),('research'),('equities'),('ic'),('memo'),('performance'),('risk'),('governance'),
  ('client'),('email'),('service'),('sql'),('data-quality'),('analytics'),('modeling'),('strategy'),
  ('briefing'),('content'),('workflow'),('review')
on conflict (name) do nothing;

with t as (select id, slug from public.teams), c as (select id, slug from public.categories)
insert into public.prompts (
  title, slug, description, body, expected_output, model, risk, status, version, owner_name, team_id, category_id
) values
  ('Earnings Result Deep Dive','earnings-result-deep-dive','Turn an earnings release into an investment-grade analysis.','Analyse the latest earnings release for {{company}}. Highlight revenue quality, margin trends, cash flow, guidance, management tone, risks and portfolio relevance. Do not invent facts.','Executive summary with positives, concerns, thesis impact and follow-up questions.','Claude','medium','approved','1.0','Investment Enablement',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Investment Committee Memo Builder','investment-committee-memo-builder','Build a structured IC memo from notes and an analyst thesis.','Draft an investment committee memo from the source notes below. Include thesis, recommendation, valuation, catalysts, downside case, liquidity, risk controls and what would make the view wrong. Flag missing evidence.','IC-ready memo with explicit risks and evidence gaps.','Claude','high','approved','1.0','Portfolio Office',(select id from t where slug='portfolio-management'),(select id from c where slug='portfolio-management')),
  ('Performance Attribution Narrative','performance-attribution-narrative','Translate performance data into a governance-ready narrative.','Convert attribution data into a concise narrative that separates allocation, selection, currency and beta effects. Highlight material drivers and client-safe caveats.','Clear narrative with key contributors and caveats.','ChatGPT','high','approved','1.0','Performance & Risk',(select id from t where slug='performance-risk'),(select id from c where slug='performance-risk')),
  ('Client Email Draft - Plain English','client-email-draft-plain-english','Draft a safe, helpful client email.','Create a concise client email using the facts provided. Keep the tone plain English, avoid personal financial advice and flag any escalation need.','Client-safe reply draft and escalation note.','Copilot','high','approved','1.0','Client Services',(select id from t where slug='client-services'),(select id from c where slug='client-services')),
  ('SQL Logic Review','sql-logic-review','Review SQL for correctness and maintainability.','Review the SQL provided. Identify grain issues, join duplication, filter gaps, inefficient CTEs and optimisation opportunities. Return severity and fixes.','Issue list with severity, evidence and fix suggestions.','Claude','low','approved','1.0','Data Team',(select id from t where slug='technology-data'),(select id from c where slug='technology-data')),
  ('Executive Briefing Summary','executive-briefing-summary','Summarise strategic information for an executive audience.','Turn the source material into a short executive briefing with key takeaways, implications and decisions required. Keep language crisp and action-oriented.','Executive summary with risk and decision points.','Claude','medium','approved','1.0','Executive Office',(select id from t where slug='executive-management'),(select id from c where slug='management')),
  ('Research Synthesis for New Theme','research-synthesis-new-theme','Summarise multiple research inputs into a single view.','Combine the notes below into a coherent summary of the investment case, evidence quality and likely implications for the portfolio.','Integrated summary with evidence gaps and next actions.','Claude','medium','pending_review','1.0','Research Operations',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Portfolio Position Review','portfolio-position-review','Review a position against the current thesis and risk budget.','Assess the position against the latest context. Cover thesis, sizing, catalysts, liquidity, downside risk and whether the existing view should change.','Position review with a clear recommendation.','Copilot','high','pending_review','1.0','Portfolio Office',(select id from t where slug='portfolio-management'),(select id from c where slug='portfolio-management')),
  ('Risk Dashboard Narrative','risk-dashboard-narrative','Turn risk metrics into a concise narrative.','Translate the risk metrics into plain language for a governance audience. Highlight surprises, concentration and management actions.','Short narrative with key risk messages.','ChatGPT','medium','pending_review','1.0','Risk Team',(select id from t where slug='performance-risk'),(select id from c where slug='performance-risk')),
  ('Quant Research Experiment Brief','quant-research-experiment-brief','Structure a quant experiment for review.','Turn this experiment summary into a one-page brief covering objective, method, assumptions, expected output and validation plan.','Structured experiment brief with clear next steps.','Claude','medium','pending_review','1.0','Quant Platform',(select id from t where slug='quant-data-science'),(select id from c where slug='quantitative-research')),
  ('Client Follow-Up Draft','client-follow-up-draft','Create a follow-up response for a client request.','Draft a professional follow-up email that acknowledges the request, summarises the next steps and avoids over-promising.','Clear follow-up draft with ownership and timing.','Copilot','medium','pending_review','1.0','Client Services',(select id from t where slug='client-services'),(select id from c where slug='client-services')),
  ('Data Quality Checklist','data-quality-checklist','Support a data quality review with a repeatable checklist.','Create a checklist for a data quality review including lineage, freshness, definitions, quality rules and exceptions.','Checklist with priority actions.','Claude','low','pending_review','1.0','Data Governance',(select id from t where slug='technology-data'),(select id from c where slug='technology-data')),
  ('Board Decision Memo','board-decision-memo','Draft a concise board decision memo.','Summarise the issue, options, recommendation and key risks for a board audience. Keep the memo concise and factual.','Board-ready decision memo.','Claude','high','draft','1.0','Executive Office',(select id from t where slug='executive-management'),(select id from c where slug='management')),
  ('Research Briefing Template','research-briefing-template','Kick off a consistent research briefing.','Create a reusable template for research briefs with sections for context, evidence, interpretation, risks and next steps.','Structured briefing template.','Claude','low','draft','1.0','Research Operations',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Portfolio Scenario Analysis','portfolio-scenario-analysis','Frame a scenario analysis for a portfolio review.','Outline the key scenarios, assumptions and sensitivities for a portfolio review. Highlight what would change the decision.','Scenario analysis summary.','Copilot','medium','draft','1.0','Portfolio Office',(select id from t where slug='portfolio-management'),(select id from c where slug='portfolio-management')),
  ('Risk Exception Summary','risk-exception-summary','Summarise a risk exception for governance.','Create a concise summary of a risk exception covering the event, impact, controls and remediation actions.','Governance-ready exception summary.','ChatGPT','medium','draft','1.0','Risk Team',(select id from t where slug='performance-risk'),(select id from c where slug='performance-risk')),
  ('Quant Backtest Review','quant-backtest-review','Review a backtest with a critical lens.','Review the described backtest for data leakage, overfitting, parameter selection and interpretation risks.','Backtest review with key concerns.','Claude','high','draft','1.0','Quant Platform',(select id from t where slug='quant-data-science'),(select id from c where slug='quantitative-research')),
  ('Service Recovery Response','service-recovery-response','Draft a service recovery response for a client issue.','Write a calm, empathetic service recovery response that acknowledges the issue, explains the next step and sets expectations.','Client-safe service recovery response.','Copilot','medium','draft','1.0','Client Services',(select id from t where slug='client-services'),(select id from c where slug='client-services')),
  ('Data Lineage Summary','data-lineage-summary','Create a succinct data lineage summary.','Summarise the lineage of the data product, including source systems, transformations and downstream impacts.','Lineage summary with owners and gaps.','Claude','low','draft','1.0','Data Governance',(select id from t where slug='technology-data'),(select id from c where slug='technology-data')),
  ('Management Decision Memo','management-decision-memo','Prepare a management decision memo.','Provide a concise decision memo with context, options, recommendation and dependencies.','Management decision memo.','Claude','medium','archived','1.0','Strategy Office',(select id from t where slug='executive-management'),(select id from c where slug='management')),
  ('Macro Research Brief','macro-research-brief','Create a macro research brief.','Summarise the macro backdrop, implications for the portfolio and key watchpoints in a concise briefing format.','Macro briefing with implications.','Claude','medium','archived','1.0','Macro Research',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Portfolio Rebalancing Note','portfolio-rebalancing-note','Draft a note on portfolio rebalancing.','Create a rebalancing note covering rationale, constraints, expected impact and implementation considerations.','Rebalancing note with action points.','Copilot','medium','archived','1.0','Portfolio Office',(select id from t where slug='portfolio-management'),(select id from c where slug='portfolio-management')),
  ('Risk Committee Update','risk-committee-update','Draft an update for the risk committee.','Summarise risk trends, notable exceptions and proposed actions for a committee update.','Risk committee update.','ChatGPT','high','archived','1.0','Risk Team',(select id from t where slug='performance-risk'),(select id from c where slug='performance-risk')),
  ('Quant Feature Review','quant-feature-review','Review a feature proposal for quant workflows.','Assess the proposed feature for clarity, robustness and implementation risk. Highlight what would need validation first.','Feature review notes.','Claude','medium','archived','1.0','Quant Platform',(select id from t where slug='quant-data-science'),(select id from c where slug='quantitative-research')),
  ('Client Complaint Acknowledgement','client-complaint-acknowledgement','Draft a client complaint acknowledgement.','Create a calm acknowledgement that recognises the concern, sets expectations and avoids admitting liability.','Complaint acknowledgement draft.','Copilot','high','archived','1.0','Client Services',(select id from t where slug='client-services'),(select id from c where slug='client-services')),
  ('Data Incident Summary','data-incident-summary','Summarise a data incident for stakeholders.','Write a concise incident summary covering impact, response, mitigation and follow-up actions.','Incident summary for stakeholder review.','Claude','medium','archived','1.0','Data Governance',(select id from t where slug='technology-data'),(select id from c where slug='technology-data')),
  ('Market Commentary Brief','market-commentary-brief','Create a market commentary brief for stakeholders.','Summarise the latest market moves, what matters and the likely implications for the portfolio in a concise brief.','Market commentary summary.','Claude','medium','pending_review','1.0','Marketing Team',(select id from t where slug='marketing'),(select id from c where slug='management')),
  ('Campaign Content Outline','campaign-content-outline','Outline a content piece for a marketing campaign.','Generate a concise campaign content outline with theme, audience, message and call-to-action.','Campaign outline and supporting points.','Copilot','low','pending_review','1.0','Marketing Team',(select id from t where slug='marketing'),(select id from c where slug='management')),
  ('Executive KPI Snapshot','executive-kpi-snapshot','Summarise key metrics for an executive review.','Transform the KPI inputs into a compact snapshot with highlights, risks and decisions required.','Executive KPI snapshot.','Claude','medium','pending_review','1.0','Strategy Office',(select id from t where slug='executive-management'),(select id from c where slug='management')),
  ('Wealth Planning Checklist','wealth-planning-checklist','Support adviser preparation with a checklist.','Create a checklist for a wealth planning conversation including objectives, constraints, risks and next steps.','Planning checklist with follow-up prompts.','Claude','low','draft','1.0','Adviser Team',(select id from t where slug='wealth-advice'),(select id from c where slug='management')),
  ('Client Q&A Prep','client-qa-prep','Prepare advisers for client Q&A.','Draft prep notes for client questions with likely themes, safe responses and escalation points.','Q&A prep notes.','Copilot','medium','draft','1.0','Adviser Team',(select id from t where slug='wealth-advice'),(select id from c where slug='management')),
  ('Marketing Email Draft','marketing-email-draft','Draft a marketing email for a campaign.','Write a concise marketing email that explains the offer, uses a clear CTA and avoids unsupported claims.','Marketing email draft.','Claude','low','draft','1.0','Marketing Team',(select id from t where slug='marketing'),(select id from c where slug='management')),
  ('Investment Thesis Checklist','investment-thesis-checklist','Create a reusable investment thesis checklist.','Build a checklist for validating a new investment thesis including evidence, risks and key assumptions.','Checklist for thesis review.','Claude','medium','approved','1.0','Research Operations',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Analyst Note Template','analyst-note-template','Create a reusable analyst note template.','Generate a structured analyst note template with sections for context, view, evidence, risks and next steps.','Analyst note template.','Claude','low','approved','1.0','Research Operations',(select id from t where slug='investment-research'),(select id from c where slug='investment-research')),
  ('Portfolio Review Summary','portfolio-review-summary','Summarise portfolio review actions.','Create a concise summary of the portfolio review with key observations, actions and open questions.','Portfolio review summary.','Copilot','medium','approved','1.0','Portfolio Office',(select id from t where slug='portfolio-management'),(select id from c where slug='portfolio-management')),
  ('Governance Update Note','governance-update-note','Summarise governance updates.','Draft a governance update note for internal stakeholders covering scope, recent changes and implications.','Governance update note.','ChatGPT','low','approved','1.0','Risk Team',(select id from t where slug='performance-risk'),(select id from c where slug='performance-risk')),
  ('Analytics Storyboard','analytics-storyboard','Create an analytics storyboard for stakeholders.','Turn the analysis into a simple storyboard directed at business stakeholders.','Analytics storyboard outline.','Claude','medium','approved','1.0','Analytics Team',(select id from t where slug='quant-data-science'),(select id from c where slug='quantitative-research')),
  ('Service Playbook Snippet','service-playbook-snippet','Create a reusable service playbook snippet.','Draft a short playbook snippet for common client service scenarios including language and escalation.','Playbook snippet.','Copilot','low','approved','1.0','Client Services',(select id from t where slug='client-services'),(select id from c where slug='client-services')),
  ('Data Quality Review Pack','data-quality-review-pack','Package a data quality review workflow.','Create a concise prompt pack for reviewing data quality issues and tracking remediation steps.','Ready-to-use data quality review pack.','Claude','medium','approved','1.0','Data Governance',(select id from t where slug='technology-data'),(select id from c where slug='technology-data')),
  ('Strategy Alignment Brief','strategy-alignment-brief','Align an initiative to a leadership strategy.','Translate the initiative notes into a concise strategy alignment brief covering purpose, priorities, dependencies and decision points.','Strategy-aligned brief with priorities and dependencies.','Claude','medium','approved','1.0','Strategy Office',(select id from t where slug='executive-management'),(select id from c where slug='management')),
  ('Adviser Follow-Up Checklist','adviser-follow-up-checklist','Support follow-up work for adviser conversations.','Create a checklist for follow-up actions after a client planning conversation, including documentation, next steps and risk flags.','Follow-up checklist with actions and risk notes.','Copilot','low','pending_review','1.0','Adviser Team',(select id from t where slug='wealth-advice'),(select id from c where slug='management')),
  ('Content QA Review','content-qa-review','Review marketing content before publication.','Review the content draft for clarity, factual support, clarity of CTA and compliance-sensitive wording.','QA review with suggested edits.','Claude','medium','draft','1.0','Marketing Team',(select id from t where slug='marketing'),(select id from c where slug='management'))
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  body = excluded.body,
  expected_output = excluded.expected_output,
  model = excluded.model,
  risk = excluded.risk,
  status = excluded.status,
  version = excluded.version,
  owner_name = excluded.owner_name,
  team_id = excluded.team_id,
  category_id = excluded.category_id,
  updated_at = now();

insert into public.collections (title, slug, description, team_id) values
  ('Research & Insights Pack','research-insights-pack','A starter collection for research synthesis and briefing workflows.',(select id from public.teams where slug='investment-research')),
  ('Portfolio Decision Pack','portfolio-decision-pack','A collection of prompts for portfolio review and decision support.',(select id from public.teams where slug='portfolio-management')),
  ('Risk Governance Pack','risk-governance-pack','A collection for governance-ready risk and performance narratives.',(select id from public.teams where slug='performance-risk')),
  ('Client Service Pack','client-service-pack','Reusable prompts for service, email and client follow-up.',(select id from public.teams where slug='client-services')),
  ('Data Quality Pack','data-quality-pack','A collection for SQL and data quality review workflows.',(select id from public.teams where slug='technology-data')),
  ('Executive Briefing Pack','executive-briefing-pack','Reusable prompts for leadership and board-ready summaries.',(select id from public.teams where slug='executive-management')),
  ('Marketing Enablement Pack','marketing-enablement-pack','Prompts for content and campaign creation.',(select id from public.teams where slug='marketing'))
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  team_id = excluded.team_id;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'earnings-result-deep-dive'
where c.slug = 'research-insights-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'research-synthesis-new-theme'
where c.slug = 'research-insights-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'research-briefing-template'
where c.slug = 'research-insights-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'investment-committee-memo-builder'
where c.slug = 'portfolio-decision-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'portfolio-position-review'
where c.slug = 'portfolio-decision-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'portfolio-review-summary'
where c.slug = 'portfolio-decision-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'performance-attribution-narrative'
where c.slug = 'risk-governance-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'risk-dashboard-narrative'
where c.slug = 'risk-governance-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'risk-committee-update'
where c.slug = 'risk-governance-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'client-email-draft-plain-english'
where c.slug = 'client-service-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'client-follow-up-draft'
where c.slug = 'client-service-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'service-recovery-response'
where c.slug = 'client-service-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'sql-logic-review'
where c.slug = 'data-quality-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'data-quality-checklist'
where c.slug = 'data-quality-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'data-lineage-summary'
where c.slug = 'data-quality-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'executive-briefing-summary'
where c.slug = 'executive-briefing-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'board-decision-memo'
where c.slug = 'executive-briefing-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'executive-kpi-snapshot'
where c.slug = 'executive-briefing-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 1
from public.collections c
join public.prompts p on p.slug = 'market-commentary-brief'
where c.slug = 'marketing-enablement-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 2
from public.collections c
join public.prompts p on p.slug = 'campaign-content-outline'
where c.slug = 'marketing-enablement-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.collection_prompts (collection_id, prompt_id, sort_order)
select c.id, p.id, 3
from public.collections c
join public.prompts p on p.slug = 'marketing-email-draft'
where c.slug = 'marketing-enablement-pack'
on conflict (collection_id, prompt_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('earnings','research','equities')
where p.slug in ('earnings-result-deep-dive','research-synthesis-new-theme','investment-thesis-checklist')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('ic','memo','portfolio')
where p.slug in ('investment-committee-memo-builder','portfolio-position-review','portfolio-review-summary')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('performance','risk','governance')
where p.slug in ('performance-attribution-narrative','risk-dashboard-narrative','risk-committee-update','governance-update-note')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('client','email','service')
where p.slug in ('client-email-draft-plain-english','client-follow-up-draft','service-recovery-response','client-complaint-acknowledgement')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('sql','data-quality','analytics')
where p.slug in ('sql-logic-review','data-quality-checklist','data-lineage-summary','analytics-storyboard','data-quality-review-pack')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('strategy','briefing','workflow')
where p.slug in ('executive-briefing-summary','board-decision-memo','executive-kpi-snapshot','management-decision-memo','research-briefing-template','strategy-alignment-brief')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('content','review','modeling')
where p.slug in ('market-commentary-brief','campaign-content-outline','marketing-email-draft','quant-research-experiment-brief','quant-backtest-review','content-qa-review')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_tags (prompt_id, tag_id)
select p.id, t.id
from public.prompts p
join public.tags t on t.name in ('workflow','review')
where p.slug in ('wealth-planning-checklist','client-qa-prep','adviser-follow-up-checklist')
on conflict (prompt_id, tag_id) do nothing;

insert into public.prompt_versions (prompt_id, version, body, change_note, created_by, created_at)
select p.id, '1.0', p.body, 'Initial seeded version', null, now()
from public.prompts p
where p.status in ('approved','pending_review','draft','archived')
  and not exists (
    select 1 from public.prompt_versions pv where pv.prompt_id = p.id and pv.version = '1.0'
  );

with seed_profiles as (
  select id from public.profiles limit 5
)
insert into public.comments (prompt_id, profile_id, body, resolved, created_at)
select p.id, sp.id, 'Helpful seeded review comment for presentation.', false, now()
from seed_profiles sp
join public.prompts p on p.status in ('approved','pending_review')
where p.id in (
  select id from public.prompts order by created_at limit 8
)
  and not exists (
    select 1 from public.comments c where c.prompt_id = p.id and c.profile_id = sp.id
  );

with seed_profiles as (
  select id from public.profiles limit 5
)
insert into public.ratings (prompt_id, profile_id, rating, created_at)
select p.id, sp.id, case when p.status = 'approved' then 5 else 4 end, now()
from seed_profiles sp
join public.prompts p on p.status in ('approved','pending_review')
where p.id in (
  select id from public.prompts order by created_at limit 10
)
  and not exists (
    select 1 from public.ratings r where r.prompt_id = p.id and r.profile_id = sp.id
  )
on conflict (prompt_id, profile_id) do nothing;

with seed_profiles as (
  select id from public.profiles limit 5
)
insert into public.favourites (prompt_id, profile_id, created_at)
select p.id, sp.id, now()
from seed_profiles sp
join public.prompts p on p.status = 'approved'
where p.id in (
  select id from public.prompts order by created_at limit 6
)
  and not exists (
    select 1 from public.favourites f where f.prompt_id = p.id and f.profile_id = sp.id
  )
on conflict (prompt_id, profile_id) do nothing;

select 'teams' as table_name, count(*) as row_count from public.teams
union all
select 'categories', count(*) from public.categories
union all
select 'tags', count(*) from public.tags
union all
select 'prompts', count(*) from public.prompts
union all
select 'collections', count(*) from public.collections
union all
select 'collection_prompts', count(*) from public.collection_prompts
union all
select 'prompt_tags', count(*) from public.prompt_tags
union all
select 'prompt_versions', count(*) from public.prompt_versions
union all
select 'comments', count(*) from public.comments
union all
select 'ratings', count(*) from public.ratings
union all
select 'favourites', count(*) from public.favourites;

select status as prompt_status, count(*) as row_count
from public.prompts
group by status
order by status;

commit;
