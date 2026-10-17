"""Content-only adaptation of the retained static exhibition export.

Update HTML, React Flight payloads and client string literals together. Preserve
the original animation code, styles, section IDs and assets. Run once against
the snapshot in tmp/driestech-original to reproduce the adaptation.
"""
from pathlib import Path
from lxml import html as lh
import re, json, html, shutil, hashlib

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
BACKUP = ROOT / 'tmp/driestech-original'
BACKUP.mkdir(parents=True, exist_ok=True)
FILES = [Path('index.html')] + [p.relative_to(PUBLIC) for folder in ['_next/static/immutable/chunks','static/immutable/chunks'] for p in (PUBLIC/folder).glob('*.js')]
for rel in FILES:
    dest = BACKUP/rel
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(PUBLIC/rel, dest)

slugs = ['the-question','the-rules','the-promise','the-examples','the-scale','the-context','the-interface','the-choices']
titles = ['Who we are','Workflows','The fit','Applications','Enterprise systems','Infrastructure','Our process','Project scopes']
summaries = [
    'Custom software and business systems, built around the way your team works.',
    'Connect applications, business rules and the records shared between teams.',
    'Approval paths, access roles and business-specific exceptions shape the work.',
    'Customer portals, internal platforms and mobile applications.',
    'ERP, POS, HRMS and management systems for day-to-day operations.',
    'Deployment pipelines, environments, monitoring and real-time dashboards.',
    'Understand, design, build and connect, then deploy and refine.',
    'A focused engineering scope or the Full Digital Business Suite.',
]
paragraphs = [
    'DriesTech builds custom software and business systems for teams launching new platforms, replacing manual work or connecting how their business runs. The team started as engineering students and brings three to four years of hands-on experience. Its work includes applications, shared data platforms, websites, commerce stores, ERPs and management systems. New ventures may need an online presence and a first set of operational tools. Established businesses may need to replace paperwork or connect existing systems. The starting point is the work people need to do, the information they use and the tools already in place.',
    'A sale can involve several handoffs: updating stock, assigning fulfilment and reporting progress. When those steps live in separate tools, someone has to carry the information between them. DriesTech works on APIs, integrations and workflow automation that connect customer applications, internal tools and external services. Events and API calls carry updates; rules and approval paths decide what happens next. An order moving from POS to inventory, a fulfilment task and a dashboard is an example of that approach. The shape-sorting experiment above is a retained educational demo of explicit rules, not a customer implementation.',
    'A custom system starts with the details of the process: who can see a record, who approves a change and what happens when a request falls outside the usual path. DriesTech describes its approach in three parts. Fit to your process means accounting for those roles, approvals and exceptions. Connections by design means considering how important records move between departments. Engineering to production means planning deployment environments and monitoring alongside the application. These are decisions to make in the project scope. The right scope depends on what needs to change and which parts of the current setup can stay.',
    'Customer portals provide a place to submit requests, access services and track progress. Internal platforms bring team workflows and information into one application. Mobile applications put business data, approvals and key actions on a phone. DriesTech offers custom software and full-stack development across these kinds of applications. E-commerce work includes digital storefronts, commerce platforms, checkout and payments. The interfaces, records and integrations depend on the business brief. The classifier above remains an interactive learning experiment from the original exhibition; it is not a demonstration of a DriesTech product or a claim about client results.',
    'Enterprise systems organise the records and responsibilities shared across departments. Sales and commerce cover checkout, returns, stock and transaction reporting. Resources and finance include purchasing, inventory and resource planning. People and HR include employee records, attendance and leave. Business management covers projects, assets, tasks and service requests. DriesTech works with ERP, POS, HRMS and management-system scopes around these needs. A project can focus on one team or connect several functions, with the required roles, records and integration points defined before implementation.',
    'The application is one part of the operating setup. DriesTech also works on DevOps infrastructure: deployment pipelines, configured environments and monitoring. Real-time dashboards can surface queues, turnaround times and exceptions across a workflow. In an order process, that might mean showing fulfilment status, a stalled request or an integration failure. What appears on a dashboard depends on the information available from the connected systems. The word-and-context experiment above is retained from the original exhibition as an interactive illustration; it does not represent monitoring data or a DriesTech deployment.',
    'The development process has four stages. Understand covers users, business rules and current tools, producing a defined scope. Design covers interfaces, data models and integration points, producing a solution blueprint. Build and connect covers application logic, APIs and workflow testing, with reviewable increments. Deploy and refine covers production configuration and operating feedback, with a rollout plan. Each stage has a deliverable to review before the next step. A useful initial brief identifies the business priority, the current tools and the desired result.',
    'A focused engineering scope suits a specific team, process or application that needs improving while the rest of the setup remains in place. The Full Digital Business Suite brings internal operations and digital presence into the same business brief. Its operational foundation draws on the software, enterprise-system and infrastructure capabilities described here. Market presence includes branding and logo design, websites, technical SEO and social media presence. Branding, logo design and social media are exclusive to the Full Digital Business Suite. For either route, start with the business priority, the tools in use and the result you want to define.',
]

M = {
 'Intelligence':'Business',
 'An evolving history':'Custom software', 'of artificial intelligence.':'for connected operations.',
 '1936 — now':'DriesTech', 'And what comes after.':'Business systems.',
 'Every generation imagines':'Customer tools. Team workflows.',
 'intelligence in its own image.':'Shared records and connected systems.',
 'This is how the shape changed.':'Built around the work you do.',
 'Begin the story':'Explore DriesTech',
 'An exhibition':'Our approach', 'by Jamie McKaye':'at DriesTech',
 'First, we tried to':'Start with', 'write the rules.':'the process.',
 'Then, we let the':'Connect', 'examples speak.':'the records.',
 'And the question':'Build around', 'changed shape.':'your team.',
 'Eight chapters in the history of an idea.':'Eight chapters about DriesTech.',
 'Enter at the beginning. Follow what changes.':'The team, the services and the way we work.',
 'Explore the exhibition':'Explore DriesTech',
 'Eight chapters. Many overlapping histories.':'Capabilities, process and project scopes.',
 'An interactive sculpture by The Shape of Intelligence':'Original sculpture: The Shape of Intelligence',
 'Change the shape of an idea':'Explore three parts of the business',
 'Rules':'Tools','Learning':'Systems','Context':'Suite',
 'A structure prescribed in advance.':'Customer portals, internal platforms and mobile applications.',
 'A structure changed by experience.':'ERP, POS, HRMS and connected business records.',
 'A structure changed by its surroundings.':'Operations and digital presence in the Full Digital Business Suite.',
 'Can a machine think?':'Who is DriesTech?', 'Can a machine':'How we',
 'An anamorphic sculpture. An open question.':'A team with an engineering background.',
 'How far could explicitly programmed reasoning take us?':'Which handoffs still depend on a manual update?',
 'Why did expectations repeatedly outrun results?':'What does the system need to fit?',
 'promise.':'fit.', 'A promise takes shape.':'The process takes shape.',
 'What changed when machines learned from data?':'What do customers and teams need to do?',
 'examples.':'applications.',
 'What became possible when methods, computing and datasets converged?':'Shared records and clear responsibilities across departments.',
 'An impossible archive.':'A shared operating picture.',
 'How did attention and transformers change the picture?':'Deployment environments, monitoring and operational visibility.',
 'What happens when people can converse with generative systems?':'Each stage produces a deliverable you can review.',
 'Language becomes a way in.':'From a defined scope to a rollout plan.',
 'The scale.':'Enterprise systems.', 'The context.':'Infrastructure.',
 'The interface.':'Our process.', 'The choices.':'Project scopes.',
 'Read this chapter ':'View service details ',
 'Read this chapter':'View service details',
 'Inside the archive ':'Original exhibition archive ',
 'Inside the archive':'Original exhibition archive',
 'Selected moments':'AI history · retained reference',
 'Listen to this chapter':'Original AI-history narration',
 ' · the chapter text above is the transcript':' · retained exhibition audio',
 'Narration of The question, synthesised from Jamie McKaye\'s voice':'Original AI-history narration: The question, by Jamie McKaye',
 'Narration of The rules, synthesised from Jamie McKaye\'s voice':'Original AI-history narration: The rules, by Jamie McKaye',
 'An educational illustration: a small rule system written for this exhibition, not a reconstruction of any historical program.':'Retained exhibition demo: a small rule system for sorting shapes, not a DriesTech customer implementation.',
 'A small real classifier trained here in the browser; not the capacity or architecture of every system in this chapter.':'Retained exhibition demo: a real classifier trained in your browser, not a DriesTech product or customer result.',
 'Purpose':'Focused scope','Evidence':'Full suite','Consequences':'Your brief',
 'Who chooses what intelligence is for?':'A focused engineering scope',
 'Who defines the goal? Which measures count as success? What gets left outside the frame?':'A specific team, process or application needs improving. The rest of your setup can remain in place.',
 'What would make it worth trusting?':'Full Digital Business Suite',
 'What counts as evidence? Who checks the answer? Where does confidence end and understanding begin?':'Operations and digital presence need to launch or change together. Branding, logo design and social media belong to this suite.',
 'Who lives with the consequences?':'Start with the business brief',
 'Whose work makes it possible? Who gets the benefit? Who has a say when the costs fall elsewhere?':'Describe the business priority, your current tools and the desired result. Use these to define the scope and first deliverable.',
 'Choose where this goes.':'Start with what needs to change.',
 'Three paths. One unfolding form.':'One process, a wider setup or an initial brief.',
 'Choose the question you want to follow.':'Explore a starting point.',
 'Choose a question':'Choose a project scope',
 'Follow this question through the archive':'Retained references from the original exhibition',
 'Keep':'Start', 'questioning.':'with a brief.',
 'Every moment. An evolving story.':'A focused scope or a full suite.',
 'Explore the timeline ↗':'Explore project scopes ↗',
 'Take a closer look.':'Applications, systems and workflows.',
 'Read the exhibition ↗':'View the services ↗',
 'Trace every idea to its source.':'An engineering team. A defined process.',
 'Follow the evidence ↗':'Meet DriesTech ↗',
 'Read':'Services', 'Timeline':'AI archive', 'Sources':'References',
 'Read the exhibition':'Services', 'Explore the timeline':'Original AI archive',
 'Exhibition':'Explore', 'Made by':'Original exhibition by', 'Reviewed':'Archive reviewed',
 'Data':'Original archive data',
 'A history of the ideas that taught machines to learn.':'Custom software and business systems for connected operations.',
 'The Shape of Intelligence':'DriesTech',
 'The Shape of Intelligence — A history of the ideas that taught machines to learn.':'DriesTech — Custom software. Business systems.',
 'https://shapeofintelligence.com/og/?v=d2a7bca':'/images/logo.png',
 'An interactive exhibition about the history of artificial intelligence: the ideas, people, machines, setbacks and material conditions that changed what computers could do, with a sourced archive of 169 events.':'DriesTech builds custom applications, enterprise systems, connected workflows and digital business tools.',
 '/read/':'/services/', '/about/':'/company/',
 'llms.txt':'Original reading rooms','/llms.txt':'/read/',
 'MCP':'Exhibition credits','/api/mcp/':'/about/',
}
oldtitles = ['The question','The rules','The promise','The examples','The scale','The context','The interface','The choices']
oldyears = ['1936 — 1956','1956 — 1974','1973 — 1993','1986 — 2011','2012 — 2016','2017 — 2021','2022 — present','An open question']
years = ['Engineering background','APIs & automation','Roles & approvals','Web & mobile','ERP · POS · HRMS','DevOps & dashboards','Four stages','Focused scope or full suite']
oldsummary = [
 'Defining intelligence was part of the problem from the beginning.',
 'Explicit instructions achieve impressive results and stay brittle.',
 'Progress and investment did not move together.',
 'Learning depends on examples, objectives and model capacity.',
 'Results emerge from several interacting ingredients, not one discovery.',
 'Context shapes representations; prediction produces useful behaviour.',
 'Fluent output, factual reliability and successful action are different properties.',
 'People still choose goals, deployment conditions and measures of success.',
]
source = (BACKUP/'index.html').read_text(encoding='utf-8')
oldparagraphs = re.findall(r'<div class="prose"><p>(.*?)</p></div>', source)
assert len(oldparagraphs)==8
for i, slug in enumerate(slugs):
    M[oldtitles[i]]=titles[i]; M[oldyears[i]]=years[i]
    M[oldsummary[i]]=summaries[i]; M[html.unescape(oldparagraphs[i])]=paragraphs[i]
    M[f'/read/{slug}/']=f'/services/#{slug}'

def convert(x):
    if isinstance(x,str): return M.get(x,x)
    if isinstance(x,list): return [convert(v) for v in x]
    if isinstance(x,dict):
        x={k:convert(v) for k,v in x.items()}
        if x.get('property',x.get('name')) in ['og:image:width','og:image:height','twitter:image:width','twitter:image:height']: x['content']='150'
        return x
    return x

doc = lh.document_fromstring(source)
# The retained export has an incorrect branded structured-data attribution.
schema = json.dumps({'@context':'https://schema.org','@type':'Organization','name':'DriesTech','description':'Custom software and business systems.'},ensure_ascii=False,separators=(',',':'))
for el in doc.iter():
    if el.tag in ['script','style']: continue
    if el.text: el.text = M.get(el.text,el.text)
    if el.tail: el.tail = M.get(el.tail,el.tail)
    for k,v in list(el.attrib.items()): el.set(k,M.get(v,v))
for el in doc.xpath('//script[@type="application/ld+json"]'): el.text=schema
for el in doc.xpath('//meta'):
    if el.get('property',el.get('name')) in ['og:image:width','og:image:height','twitter:image:width','twitter:image:height']: el.set('content','150')
# Match the original two-line title structure, and keep all fracture layers.
# The final CTA links have separate purposes from the retained archive links.
for el,href in zip(doc.xpath('//div[contains(@class,"__ending")]//a'),['/services/#the-choices','/services/','/company/']): el.set('href',href)

flight=[]
scripts=doc.xpath('//script[starts-with(text(),"self.__next_f.push(")]')
for el in scripts:
    a=json.loads(el.text[len('self.__next_f.push('):-1])
    if len(a)>1 and isinstance(a[1],str): flight.append(a[1])
raw=''.join(flight)
# Flight text rows are byte-counted, not newline-delimited. The schema is JSON;
# parse its actual extent instead of trusting the stale length in this export.
out=[]; pos=0; decoder=json.JSONDecoder()
while pos<len(raw):
    if raw.startswith(':HL',pos):
        end=raw.index('\n',pos); out.append(raw[pos:end+1]); pos=end+1; continue
    m=re.match(r'([0-9a-f]+):',raw[pos:]); assert m,raw[pos:pos+100]
    key=m[1]; pos+=m.end()
    if raw[pos]=='T':
        h=re.match(r'T[0-9a-f]+,',raw[pos:]); pos+=h.end()
        obj,n=decoder.raw_decode(raw[pos:]); pos+=n
        val=schema if key=='3' else json.dumps(convert(obj),ensure_ascii=False,separators=(',',':'))
        out.append(f'{key}:T{len(val.encode("utf-8")):x},{val}')
    else:
        end=raw.find('\n',pos)
        if end<0:end=len(raw)
        line=raw[pos:end]; pos=end+1
        prefix='I' if line.startswith('I') else ''
        obj=json.loads(line[len(prefix):]); obj=convert(obj)
        # Keep the CTA destinations consistent with the HTML.
        def ending(v):
            if isinstance(v,dict):
                if '__ending' in str(v.get('className','')):
                    links=v['children'][1][3]['children']
                    for link,href in zip(links,['/services/#the-choices','/services/','/company/']):link[3]['href']=href
                for z in v.values():ending(z)
            elif isinstance(v,list):
                for z in v:ending(z)
        ending(obj)
        out.append(key+':'+prefix+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n')
for el in scripts: el.getparent().remove(el)
boot=lh.Element('script');boot.text='(self.__next_f=self.__next_f||[]).push([0])';doc.find('body').append(boot)
payload=lh.Element('script');payload.text='self.__next_f.push('+json.dumps([1,''.join(out)],ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+')';doc.find('body').append(payload)
# Remove the earlier bootstrap so that the stream is initialised once.
for el in doc.xpath('//script[starts-with(text(),"(self.__next_f=self.__next_f||[]).push([0])")]')[:-1]:el.getparent().remove(el)
(PUBLIC/'index.html').write_text('<!DOCTYPE html>'+lh.tostring(doc,encoding='unicode',method='html'),encoding='utf-8')

# Only string literals change in client bundles; function bodies remain intact.
for rel in FILES[1:]:
    if rel.name not in ['0nvsl7zby200v.js','407iim5h71uzs.js']:
        shutil.copyfile(BACKUP/rel,PUBLIC/rel)
        continue
    s=(BACKUP/rel).read_text(encoding='utf-8')
    def literal(m):
        try: val=json.loads(m[0])
        except ValueError:return m[0]
        return json.dumps(M[val],ensure_ascii=False) if val in M else m[0]
    s=re.sub(r'"(?:[^"\\]|\\.)*"',literal,s)
    (PUBLIC/rel).write_bytes(s.encode('utf-8'))

# Quiet, readable companion pages use the same fonts and brand palette.
style='''@font-face{font-family:Diatype;src:url(/fonts/diatype-regular.woff2)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f2f4f1;color:#202623;font:18px/1.6 Diatype,Arial,sans-serif}a{color:inherit;text-underline-offset:5px}header,footer{padding:28px 5vw;display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #20262329}nav{display:flex;gap:24px;flex-wrap:wrap}header a{text-decoration:none}main{max-width:1120px;margin:0 auto;padding:90px 5vw}h1{font-size:clamp(48px,8vw,104px);line-height:1;letter-spacing:-.06em;font-weight:400;margin:20px 0 45px}h2{font-size:clamp(30px,4vw,48px);line-height:1.1;font-weight:400;letter-spacing:-.03em}.eyebrow{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:#008c70}section{padding:45px 0;border-top:1px solid #20262329;scroll-margin-top:24px}p{max-width:72ch}.intro{font-size:24px;max-width:48ch}.index{display:flex;flex-wrap:wrap;gap:12px 24px;margin:45px 0 65px}.note{font-size:14px;color:#52615b}footer{border-top:1px solid #20262329;font-size:14px}@media(max-width:600px){header,footer{flex-direction:column}main{padding-top:45px}nav{gap:16px}.intro{font-size:21px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'''
def page(title,body):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} — DriesTech</title><meta name="description" content="DriesTech custom software, enterprise systems, workflow automation and development process."><link rel="icon" href="/images/emblem.png"><style>{style}</style></head><body><header><a href="/">DriesTech · Connected Business</a><nav aria-label="Primary"><a href="/">Explore</a><a href="/services/">Services</a><a href="/company/">About</a></nav></header><main>{body}</main><footer><span>DriesTech · Custom software. Business systems.</span><a href="/about/">Original exhibition credits</a></footer></body></html>'''
services='<p class="eyebrow">DriesTech / Capabilities</p><h1>What we build.</h1><p class="intro">Applications, operational systems and connected workflows. A focused scope or the Full Digital Business Suite.</p><nav class="index" aria-label="Service sections">'+''.join(f'<a href="#{s}">{t}</a>' for s,t in zip(slugs,titles))+'</nav>'
for i,(slug,title) in enumerate(zip(slugs,titles)):
    services+=f'<section id="{slug}"><span class="eyebrow">0{i+1} / {html.escape(years[i])}</span><h2>{title}</h2><p class="intro">{html.escape(summaries[i])}</p><p>{html.escape(paragraphs[i].split(" The shape-sorting")[0].split(" The classifier")[0].split(" The word-and-context")[0])}</p></section>'
services+='<section id="project-brief"><p class="eyebrow">Start here</p><h2>Describe the work.</h2><p>Business priority. Current tools. Desired result. These are the starting points for defining a project brief and its first deliverable.</p><p class="note">Contact details will be added here once confirmed.</p></section>'
company=f'<p class="eyebrow">About DriesTech</p><h1>Custom software.<br>Business systems.</h1><p class="intro">For teams launching new platforms, replacing manual work or connecting the way their business runs.</p><section><h2>Who we are</h2><p>{paragraphs[0]}</p></section><section><h2>How we work</h2><p>{paragraphs[6]}</p><a href="/services/">Explore the services ↗</a></section><section><h2>About this experience</h2><p>This site adapts The Shape of Intelligence exhibition. Its sculptures, interactive experiments, AI-history archive and original narration are retained. Those materials are illustrations and references, not DriesTech projects or customer results.</p><a href="/about/">Original exhibition and credits ↗</a></section>'
for slug,title,body in [('services','Services',services),('company','About',company)]:
    (PUBLIC/slug).mkdir(exist_ok=True); (PUBLIC/slug/'index.html').write_text(page(title,body),encoding='utf-8')

report={'changed':[str(p) for p in FILES if (PUBLIC/p).read_bytes()!=(BACKUP/p).read_bytes()], 'source':'DriesTech_Company_and_Services_Story_and_Mobile.pdf', 'preserved':'All existing CSS, model, image, audio and dataset files; animation code and section IDs.'}
(ROOT/'tmp/driestech-change-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
