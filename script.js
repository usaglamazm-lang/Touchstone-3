"use strict";
// Client-side course prototype. No order or contact information is transmitted.
const PRODUCTS = [
  {id:"signature",name:"Signature Loaf",category:"bread",price:"$9 sample"},
  {id:"sourdough",name:"Sourdough Bread",category:"bread",price:"$6–$12 sample range"},
  {id:"pastrybox",name:"Pastry & Cookie Box",category:"pastry",price:"$18–$30 sample range"},
  {id:"cake",name:"Celebration Cake",category:"cake",price:"$35–$80 sample range"}
];
const KEYS = {favorites:"northstar-favorites-v1",category:"northstar-category-v1"};
function readSaved(key,fallback){try{const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value);}catch{return fallback;}}
function saveValue(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{const note=document.getElementById("favorite-summary");if(note)note.textContent="Your browser could not save preferences; selections work until you leave.";}}
function favorites(){const saved=readSaved(KEYS.favorites,[]);return Array.isArray(saved)?saved.filter(id=>PRODUCTS.some(p=>p.id===id)):[];}
function renderFavorites(){
 const holder=document.getElementById("favorite-items");if(!holder)return;
 const category=document.getElementById("category-choice").value;
 holder.replaceChildren();
 PRODUCTS.filter(p=>category==="all"||p.category===category).forEach(product=>{
   const card=document.createElement("div");card.className="favorite-item";
   const title=document.createElement("strong");title.textContent=product.name;
   const price=document.createElement("span");price.textContent=product.price;
   const button=document.createElement("button");button.type="button";
   const selected=favorites().includes(product.id);button.setAttribute("aria-pressed",String(selected));
   button.textContent=selected?"♥ Saved — remove":"♡ Save favorite";
   button.addEventListener("click",()=>toggleFavorite(product.id));
   card.append(title,price,button);holder.append(card);
 });
 const chosen=favorites();document.getElementById("favorite-summary").textContent=chosen.length?`${chosen.length} saved: ${PRODUCTS.filter(p=>chosen.includes(p.id)).map(p=>p.name).join(", ")}.`:"No favorites saved yet.";
}
function toggleFavorite(id){const saved=favorites();saveValue(KEYS.favorites,saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]);renderFavorites();}
function setupPlanner(){const select=document.getElementById("category-choice");if(!select)return;const stored=readSaved(KEYS.category,"all");select.value=["all","bread","pastry","cake"].includes(stored)?stored:"all";select.addEventListener("change",()=>{saveValue(KEYS.category,select.value);renderFavorites();});document.getElementById("clear-favorites").addEventListener("click",()=>{saveValue(KEYS.favorites,[]);renderFavorites();});renderFavorites();}
const RULES = [
 {id:"customer-name",check:v=>v.trim().length>0,message:"Please enter your name."},
 {id:"email",check:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),message:"Enter a valid email address, such as name@example.com."},
 {id:"request-type",check:v=>v!=="",message:"Please select a request type."},
 {id:"item-details",check:v=>v.trim().length>=10,message:"Please enter at least 10 characters describing your request."}
];
function validateField(rule){const field=document.getElementById(rule.id);const valid=rule.check(field.value);document.getElementById(rule.id+"-error").textContent=valid?"":rule.message;field.setAttribute("aria-invalid",String(!valid));return valid;}
function setupForm(){const form=document.getElementById("inquiry-form");if(!form)return;
 const selected=PRODUCTS.filter(p=>favorites().includes(p.id)).map(p=>p.name);
 const note=document.getElementById("saved-favorites-note");note.textContent=selected.length?"Your saved favorites: "+selected.join(", ")+". You can mention these in your inquiry.":"Browse Products to save favorites for a future inquiry.";
 RULES.forEach(rule=>{const field=document.getElementById(rule.id);field.addEventListener("input",()=>{if(field.getAttribute("aria-invalid")==="true")validateField(rule);});field.addEventListener("change",()=>validateField(rule));});
 form.addEventListener("submit",event=>{event.preventDefault();const results=RULES.map(validateField);const status=document.getElementById("form-status");if(results.some(v=>!v)){status.textContent="Please correct the highlighted fields. Nothing was sent.";document.getElementById(RULES[results.indexOf(false)].id).focus();return;}status.textContent="Your sample inquiry passed validation. This course demo does not send or save requests.";});
}
document.addEventListener("DOMContentLoaded",()=>{setupPlanner();setupForm();});
