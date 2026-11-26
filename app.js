const KEY = "viaturas-simples-v1";
const frota = [
  {id:1,nome:"EB 10-2231",modelo:"Marruá AM-1"},
  {id:2,nome:"EB 10-2232",modelo:"Marruá AM-1"},
  {id:3,nome:"EB 12-0417",modelo:"Mercedes-Benz 1519, caminhão"},
  {id:4,nome:"EB 11-0934",modelo:"Iveco Daily, furgão"},
  {id:5,nome:"EB 14-0102",modelo:"Guarani VBTP 6x6"},
  {id:6,nome:"EB 15-0056",modelo:"Ambulância Marruá"}
];
let uso = {};
try { uso = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
const salvar = () => { try { localStorage.setItem(KEY, JSON.stringify(uso)); } catch (e) {} };
const esc = t => String(t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let alvo = null;

function desenhar(){
  const n = Object.keys(uso).length;
  document.getElementById("resumo").textContent = `${frota.length - n} disponíveis, ${n} em uso`;
  document.getElementById("lista").innerHTML = frota.map(v => {
    const a = uso[v.id];
    return `<article class="card">
      <div><h2>${esc(v.nome)}</h2><p class="meta">${esc(v.modelo)}</p>
      ${a ? `<p class="meta">${esc(a.un)}, ${esc(a.rs)}. Destino: ${esc(a.ds)}</p>` : ""}</div>
      <span class="badge ${a ? "uso" : "livre"}">${a ? "Em uso" : "Disponível"}</span>
      <button class="btn ${a ? "sec" : ""}" data-id="${v.id}">${a ? "Registrar devolução" : "Alocar"}</button>
    </article>`;
  }).join("");
}

document.getElementById("lista").addEventListener("click", e => {
  const b = e.target.closest("button[data-id]"); if (!b) return;
  const id = b.dataset.id;
  if (uso[id]) { delete uso[id]; salvar(); desenhar(); return; }
  alvo = id;
  document.getElementById("dlgTitulo").textContent = "Alocar " + frota.find(v => v.id == id).nome;
  document.getElementById("form").reset();
  document.getElementById("dlg").showModal();
});
document.getElementById("cancela").onclick = () => document.getElementById("dlg").close();
document.getElementById("form").addEventListener("submit", () => {
  uso[alvo] = {
    un: document.getElementById("un").value.trim(),
    rs: document.getElementById("rs").value.trim(),
    ds: document.getElementById("ds").value.trim()
  };
  salvar(); desenhar();
});
document.getElementById("tema").onclick = () => {
  const r = document.documentElement;
  const escuro = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme = escuro ? "light" : "dark";
};
desenhar();
