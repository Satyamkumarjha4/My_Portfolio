#!/usr/bin/env python3
"""Real-browser performance measurement of the deployed site (not Lighthouse's simulation).

  pip install playwright   # and have Google Chrome installed
  python3 scripts/measure-prod.py https://<site>.vercel.app [runs]

Mobile viewport, 4x CPU slowdown, 150 ms RTT / 1.6 Mbps, cache disabled, median of
`runs` (default 5). Prints LCP, CLS, INP (one tap + one key press), document TTFB,
transferred KiB, blocking time (long tasks after FCP) and the LCP candidate chain
for / and /projects. Run it from a normal network, not over a VPN.
"""
import statistics as st, json, sys
from playwright.sync_api import sync_playwright
OBS = """() => { window.__lcp=[]; window.__cls=0; window.__lt=[]; window.__ev=[];
 new PerformanceObserver(l=>{for(const e of l.getEntries()) __lcp.push({t:e.startTime,size:e.size,el:e.element?(e.element.tagName+'.'+String(e.element.className).split(' ').slice(0,3).join('.')):'(removed)',url:e.url?e.url.split('/').pop():'',load:e.loadTime,render:e.renderTime})}).observe({type:'largest-contentful-paint',buffered:true});
 new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) __cls+=e.value}).observe({type:'layout-shift',buffered:true});
 new PerformanceObserver(l=>{for(const e of l.getEntries()) __lt.push([e.startTime,e.duration])}).observe({type:'longtask',buffered:true});
 new PerformanceObserver(l=>{for(const e of l.getEntries()) if(e.interactionId) __ev.push(e.duration)}).observe({type:'event',buffered:true,durationThreshold:16}); }"""
def one(b, url, heading):
    ctx=b.new_context(viewport={'width':412,'height':823},device_scale_factor=2.6,is_mobile=True,has_touch=False)
    pg=ctx.new_page(); c=ctx.new_cdp_session(pg)
    c.send('Network.enable'); c.send('Network.setCacheDisabled',{'cacheDisabled':True})
    c.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':1.6*1024*1024/8,'uploadThroughput':750*1024/8})
    c.send('Emulation.setCPUThrottlingRate',{'rate':4})
    total={'b':0}; c.on('Network.loadingFinished',lambda e: total.__setitem__('b',total['b']+e['encodedDataLength']))
    pg.add_init_script(OBS.replace('() => {','(() => {',1)[:-1]+'})()')
    pg.goto(url,wait_until='load'); pg.wait_for_timeout(6000)
    h=pg.locator(heading).first; h.scroll_into_view_if_needed(); h.click(); pg.wait_for_timeout(300); pg.keyboard.press('Tab'); pg.wait_for_timeout(1500)
    r=pg.evaluate("""() => { const nav=performance.getEntriesByType('navigation')[0]; const fcp=(performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0;
      return {lcp:__lcp, cls:__cls, ttfb:nav.responseStart, tbt:__lt.filter(([s])=>s>=fcp).reduce((a,[s,d])=>a+Math.max(0,d-50),0), inp:__ev.length?Math.max(...__ev):0,
       lcpRes:(()=>{const last=__lcp[__lcp.length-1]; if(!last||!last.url) return null; const e=performance.getEntriesByType('resource').find(x=>x.name.endsWith(last.url)); return e?{start:Math.round(e.startTime),end:Math.round(e.responseEnd),type:e.initiatorType}:null})()} }""")
    r['bytes']=total['b']; ctx.close(); return r
def run(url, heading, n=5):
    with sync_playwright() as p:
        b=p.chromium.launch(channel='chrome',args=['--no-sandbox'])
        rs=[one(b,url,heading) for _ in range(n)]; b.close()
    med=lambda k: st.median(r[k] for r in rs)
    last=[r['lcp'][-1] for r in rs if r['lcp']]
    return {'LCP':round(st.median(l['t'] for l in last)),'CLS':round(med('cls'),3),'INP':round(med('inp')),'TTFB':round(med('ttfb')),'KiB':round(med('bytes')/1024),'TBT':round(med('tbt')),
            'lcp_el':last[len(last)//2]['el'],'lcp_url':last[len(last)//2]['url'],'lcp_res':rs[len(rs)//2]['lcpRes'],'candidates':[(round(c['t']),c['size'],c['el'],c['url']) for c in rs[len(rs)//2]['lcp']]}
base = sys.argv[1].rstrip('/')
runs = int(sys.argv[2]) if len(sys.argv) > 2 else 5
for path, heading in [('/', 'text=Featured Projects'), ('/projects', 'text=Featured Projects')]:
    r = run(base + path, heading, runs)
    print(path, json.dumps(r, indent=2))
