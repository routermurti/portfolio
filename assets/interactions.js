(() => {
 'use strict';
 if(!window.RmUi) return;
 const t=window.RmUi.t;
 const picker=document.querySelector('.service-picker');let selectedService=0;
 function showService(){
  if(!picker)return;
  const source=document.querySelectorAll('.service-directory>details')[selectedService];if(!source)return;
  picker.querySelector('[data-service-title]').textContent=source.querySelector('.entry-title').textContent;
  picker.querySelector('[data-service-copy]').textContent=source.querySelector('.entry-body p').textContent;
  picker.querySelector('.studio-index').textContent=String(selectedService+1).padStart(2,'0');
  picker.querySelector('[data-service-link]').href='#service-'+(selectedService+1);
  picker.querySelectorAll('[data-service]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.service)===selectedService)));
 }
 picker?.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  selectedService=Number(button.dataset.service);showService();const panel=picker.querySelector('.service-insight');panel.classList.remove('is-changing');requestAnimationFrame(()=>panel.classList.add('is-changing'));
 }));
 picker?.querySelector('[data-service-link]').addEventListener('click',()=>{document.getElementById('service-'+(selectedService+1)).open=true;});
 showService();
 const projects=document.querySelector('#project-list');let projectFilter='all';
 function filterProjects(){
  if(!projects)return;let count=0;
  projects.querySelectorAll('details').forEach(row=>{row.hidden=projectFilter!=='all'&&row.dataset.status!==projectFilter;if(!row.hidden)count++;});
  const visible=Array.from(projects.querySelectorAll('details')).filter(row=>!row.hidden);
  if(visible.length&&!visible.some(row=>row.open))visible[0].open=true;
  document.querySelector('[data-filter-count]').textContent=t('x.shownProjects',{count});
  document.querySelectorAll('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.projectFilter===projectFilter)));
 }
 document.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{projectFilter=button.dataset.projectFilter;filterProjects();}));filterProjects();
 const process=document.querySelector('[data-process]');
 function syncProcess(){if(!process)return;const steps=Array.from(process.querySelectorAll('[data-step]'));const current=steps.findIndex(b=>b.getAttribute('aria-pressed')==='true');process.querySelectorAll('[data-process-move]').forEach(b=>{b.disabled=Number(b.dataset.processMove)<0?current===0:current===steps.length-1;});}
 process?.querySelectorAll('[data-process-move]').forEach(button=>button.addEventListener('click',()=>{const steps=Array.from(process.querySelectorAll('[data-step]')),current=steps.findIndex(b=>b.getAttribute('aria-pressed')==='true');steps[current+Number(button.dataset.processMove)]?.click();syncProcess();}));
 if(process?.querySelector('[data-process-move]'))new MutationObserver(syncProcess).observe(process.querySelector('.process-steps'),{subtree:true,attributes:true,attributeFilter:['aria-pressed']});syncProcess();
 const request=document.getElementById('project-request');
 function updateBrief(){if(!request)return;const state=[document.getElementById('request-detail').value.trim().length>=10,document.getElementById('request-consent').checked,document.getElementById('request-scope').value!=='undecided'];request.querySelectorAll('[data-brief-item]').forEach((el,i)=>el.dataset.ready=String(state[i]));request.querySelector('[data-brief-count]').textContent=t('x.briefCount',{count:state.filter(Boolean).length});}
 request?.addEventListener('input',updateBrief);request?.addEventListener('change',updateBrief);updateBrief();
 const samples={valid:['css','.title {\n  color: #C4EB72;\n  font-size: 24px;\n}'],broken:['css','.title {\n  color: #C4EB72;\n  font-size: 24px;\n'],html:['html','<section>\n  <h2>Router Murti</h2>\n  <span>Smart Code Check\n</section>']};
 document.querySelectorAll('[data-lab]').forEach(button=>button.addEventListener('click',()=>{
  const [type,code]=samples[button.dataset.lab],form=document.getElementById('rmAnalysisForm');
  form.querySelector('input[value="code"]').checked=true;document.getElementById('rmCodeType').value=type;document.getElementById('rmCode').value=code;document.getElementById('rmSafeConsent').checked=false;
  form.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('rmCode').focus();
 }));
 document.addEventListener('rm:language',()=>{showService();filterProjects();updateBrief();});
})();
