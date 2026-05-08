/**
 * Wizard Spellbook Integration for character-sheet.html
 */

"use strict";

import { WizardSpellbookAPI } from './spellbook.js';

  function isPrimaryWizard() {
    return !!C && String(C.className || "").toLowerCase() === "wizard";
  }

  function resolveWizardTarget(targetKey) {
    const key = String(targetKey || "primary");
    if (!C) return null;

    if (!key || key === "primary") {
      if (String(C.className || "").toLowerCase() !== "wizard") return null;
      const lv = Number(C.classLevel || C.level || 1);
      const sub = String(C.subclassShortName || "").trim();
      return {
        key: "primary",
        bucket: C,
        level: lv,
        label: `Wizard Lv.${lv}${sub ? ` · ${sub}` : ""}`,
      };
    }

    const m = key.match(/^ec:(\d+)$/);
    if (!m) return null;
    const idx = Number(m[1]);
    if (!Number.isFinite(idx) || idx < 0) return null;
    const ec = (C.extraClasses || [])[idx];
    if (!ec || String(ec.name || "").toLowerCase() !== "wizard") return null;
    const lv = Number(ec.level || 1);
    const sub = String(ec.subclassShortName || "").trim();
    return {
      key: `ec:${idx}`,
      bucket: ec,
      level: lv,
      label: `Wizard MC${idx + 1} Lv.${lv}${sub ? ` · ${sub}` : ""}`,
    };
  }

  function getWizardLevel() {
    return Number(C?.classLevel || C?.level || 1);
  }

  function getIntModSafe() {
    if (typeof getMod === "function" && typeof getFinal === "function") {
      return getMod(getFinal("int")) || 0;
    }
    return 0;
  }

  function getSpellcastingProfileSafe(className, subclassShortName, clsSnap) {
    if (typeof getSpellcastingProfile === "function") {
      return getSpellcastingProfile(className || "", subclassShortName || "", clsSnap || {}) || {};
    }
    return {};
  }

  function getWizardPreparedCap(target, intMod) {
    if (!target) return 0;
    const bucket = target.bucket || {};
    const lv = Number(target.level || 1);
    const profile = getSpellcastingProfileSafe(
      bucket === C ? C?.className : bucket?.name,
      bucket === C ? C?.subclassShortName : bucket?.subclassShortName,
      bucket?.clsSnapshot || {}
    );
    const progFromSnap = Array.isArray(bucket?.clsSnapshot?.preparedSpellsProgression)
      ? bucket.clsSnapshot.preparedSpellsProgression[lv - 1]
      : null;
    const progFromProfile = Array.isArray(profile?.preparedSpellsProgression)
      ? profile.preparedSpellsProgression[lv - 1]
      : null;
    let cap = Number.isFinite(progFromSnap) ? progFromSnap : (Number.isFinite(progFromProfile) ? progFromProfile : null);
    if (!Number.isFinite(cap) && profile?.preparedFormula && typeof applyPreparedFormula === "function" && typeof getMod === "function" && typeof getFinal === "function") {
      const ab = String(profile.preparedFormula.ability || "int").toLowerCase();
      const mod = ab === "int" ? Number(intMod || 0) : (getMod(getFinal(ab)) || 0);
      cap = applyPreparedFormula(profile.preparedFormula, mod, lv);
    }
    if (!Number.isFinite(cap)) cap = lv + Number(intMod || 0);
    return Math.max(0, Number(cap || 0));
  }

  function getWizardCantripCap(target) {
    if (!target) return 0;
    const bucket = target.bucket || {};
    const lv = Number(target.level || 1);
    const profile = getSpellcastingProfileSafe(
      bucket === C ? C?.className : bucket?.name,
      bucket === C ? C?.subclassShortName : bucket?.subclassShortName,
      bucket?.clsSnapshot || {}
    );
    const fromSnap = Array.isArray(bucket?.clsSnapshot?.cantripProgression)
      ? bucket.clsSnapshot.cantripProgression[lv - 1]
      : null;
    const fromProfile = Array.isArray(profile?.cantripKnown)
      ? profile.cantripKnown[lv - 1]
      : null;
    const cap = Number.isFinite(fromSnap) ? fromSnap : (Number.isFinite(fromProfile) ? fromProfile : 0);
    return Math.max(0, Number(cap || 0));
  }

  function getWizardMaxLearnLevel(target) {
    if (!target) return 0;
    const bucket = target.bucket || {};
    const lv = Number(target.level || 1);
    const profile = getSpellcastingProfileSafe(
      bucket === C ? C?.className : bucket?.name,
      bucket === C ? C?.subclassShortName : bucket?.subclassShortName,
      bucket?.clsSnapshot || {}
    );
    const prog = String(bucket?.clsSnapshot?.casterProgression || profile?.casterProgression || "full");
    if (typeof getMaxCastableLevel === "function") return Math.min(9, Math.max(0, Number(getMaxCastableLevel(prog, lv) || 0)));
    return Math.min(9, Math.max(0, lv));
  }

  function normSpellKeyLocal(name) {
    if (typeof _normSpellKey === "function") return _normSpellKey(name);
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function escHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escJsSingle(value) {
    return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  function getSortedLevelSpells(sourceByLevel, level) {
    const arr = Array.isArray(sourceByLevel?.[level]) ? sourceByLevel[level].filter(Boolean) : [];
    return [...new Set(arr)].sort((a, b) => String(a).localeCompare(String(b)));
  }

  function ensureWizardUiStyles() {
    if (document.getElementById("wizard-ui-shared-styles")) return;
    const st = document.createElement("style");
    st.id = "wizard-ui-shared-styles";
    st.textContent = `
      #wizard-spellbook-manager-modal .wiz-chip{
        padding:3px 10px;border:1px solid var(--bdr);border-radius:999px;background:transparent;
        color:var(--text2);font-family:var(--ff-display);font-size:var(--fs-xs);font-weight:600;
        letter-spacing:.08em;cursor:pointer;transition:all .12s;line-height:1.25;
      }
      #wizard-spellbook-manager-modal .wiz-chip:hover{border-color:var(--bdr2);color:var(--text);}
      #wizard-spellbook-manager-modal .wiz-chip.on{background:var(--gdim);border-color:var(--gold);color:var(--gold2);}
      #wizard-spellbook-manager-modal .wiz-chip.danger{border-color:var(--red2);color:var(--red2);}
    `;
    document.head.appendChild(st);
  }

  function getModalShell(id, maxWidth) {
    ensureWizardUiStyles();
    let modal = document.getElementById(id);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = id;
      modal.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:2100;padding:1rem;overflow:auto;";
      modal.addEventListener("click", (ev) => {
        if (ev.target === modal) modal.style.display = "none";
      });
      document.body.appendChild(modal);
    }

    return {
      modal,
      cardOpen: `<div style="max-width:${maxWidth}px;margin:0 auto;background:var(--bg2);border:1px solid var(--bdr2);border-radius:var(--rl);box-shadow:0 10px 35px rgba(0,0,0,.45)">`,
    };
  }

  function getWizardLookupSet() {
    if (typeof getClassSpells === "function") {
      const wiz = getClassSpells("Wizard");
      if (Array.isArray(wiz) && wiz.length) {
        return new Set(
          wiz.map((s) => normSpellKeyLocal(s?.name))
            .filter(Boolean)
        );
      }
    }
    if (typeof _sheetClassSpellSets !== "undefined" && _sheetClassSpellSets && _sheetClassSpellSets.wizard) {
      return _sheetClassSpellSets.wizard;
    }
    return null;
  }

  function levelTabsHtml(currentLevel, callbackName, inputId, targetKey) {
    const safeKey = escJsSingle(targetKey || "primary");
    let out = `<button class="af-btn${!currentLevel ? " on" : ""}" onclick="${callbackName}((document.getElementById('${inputId}')||{}).value, 0, '${safeKey}')">All</button>`;
    for (let lv = 1; lv <= 9; lv++) {
      out += `<button class="af-btn${currentLevel === lv ? " on" : ""}" onclick="${callbackName}((document.getElementById('${inputId}')||{}).value, ${lv}, '${safeKey}')">${lv}</button>`;
    }
    return out;
  }

  async function openWizardPrepareModal(searchTerm, levelFilter, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target) {
      alert("Invalid Wizard target.");
      return;
    }
    if (typeof WizardSpellbookAPI === "undefined") {
      alert("WizardSpellbookAPI not available.");
      return;
    }

    const query = String(searchTerm || "").toLowerCase().trim();
    const lvFilterNum = Number(levelFilter || 0);
    const lvFilter = lvFilterNum;
    const targetKeyNorm = target.key;
    const bucket = target.bucket;
    const maxLearnLevel = getWizardMaxLearnLevel(target);
    const intMod = getIntModSafe();
    const clsLv = Number(target.level || getWizardLevel());
    const maxPrepared = getWizardPreparedCap(target, intMod);
    const maxCantrips = getWizardCantripCap(target);
    if (!Array.isArray(bucket.selectedCantrips)) bucket.selectedCantrips = [];
    const selectedCantrips = new Set((bucket.selectedCantrips || []).filter(Boolean));
    const preparedCount = Object.values(bucket.selectedSpells || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);

    const cantripPool = getSortedLevelSpells(bucket.wizardSpellbook, 0)
      .filter((n) => !query || String(n).toLowerCase().includes(query))
      .map((name) => ({ name }));

    const shell = getModalShell("wizard-prepare-modal", 1020);

    let shownRows = 0;
    let html = `${shell.cardOpen}
      <div style="display:flex;align-items:center;gap:.6rem;padding:1rem 1.1rem;border-bottom:1px solid var(--bdr)">
        <div style="font-family:var(--ff-display);font-size:var(--fs-ui-lg);letter-spacing:.07em;color:var(--gold)">Prepare Spells (${escHtml(target.label)})</div>
        <div style="margin-left:auto;font-size:var(--fs-meta);color:var(--text3)">Prepared <b style="color:var(--teal)">${preparedCount}/${maxPrepared}</b></div>
        <button onclick="document.getElementById('wizard-prepare-modal').style.display='none'" style="background:none;border:none;color:var(--text2);font-size:20px;cursor:pointer;line-height:1">&times;</button>
      </div>

      <div style="padding:1rem 1.1rem .75rem">
        <div style="background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:.62rem .72rem;margin-bottom:.7rem;font-size:var(--fs-meta);color:var(--text2)">
          Wizard prepared limit (class progression): <b style="color:var(--gold2)">${maxPrepared}</b><br>
          Known cantrips: <b style="color:var(--gold2)">${selectedCantrips.size}/${maxCantrips}</b><br>
          Wizard Level ${clsLv} · INT Mod ${intMod >= 0 ? "+" : ""}${intMod}
        </div>
        <input id="wiz-prep-search" data-level="${Number.isFinite(lvFilter) ? lvFilter : 0}" data-target="${escHtml(targetKeyNorm)}" value="${escHtml(searchTerm || "")}" oninput="openWizardPrepareModal(this.value, ${Number.isFinite(lvFilter) ? lvFilter : 0}, '${escJsSingle(targetKeyNorm)}')" placeholder="Search your spellbook..." style="width:100%;padding:8px 10px;background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);color:var(--text);margin-bottom:.6rem" />
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:.65rem">${levelTabsHtml(lvFilter, "openWizardPrepareModal", "wiz-prep-search", targetKeyNorm)}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.58rem;max-height:56vh;overflow:auto;padding-right:3px">`;

    html += `<div style="background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:.52rem .58rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
        <span style="font-family:var(--ff-display);font-size:var(--fs-label);letter-spacing:.08em;color:var(--gold)">Cantrip</span>
        <span style="font-size:var(--fs-label);color:var(--text3)">${selectedCantrips.size}/${maxCantrips}</span>
      </div>`;
    if (cantripPool.length) {
      cantripPool.forEach((sp) => {
        const on = selectedCantrips.has(sp.name);
        const safeName = escJsSingle(sp.name);
        const _wSlug = sp.name.toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        html += `<div onclick="toggleWizardCantrip('${safeName}', '${escJsSingle(targetKeyNorm)}')"
          style="display:flex;align-items:center;gap:6px;width:100%;margin:.18rem 0;padding:.36rem .45rem;border-radius:6px;border:1px solid ${on ? "var(--green)" : "var(--bdr)"};background:${on ? "var(--gbg)" : "transparent"};color:${on ? "var(--green)" : "var(--text2)"};cursor:pointer;font-size:var(--fs-meta)">
          <span style="width:14px;flex-shrink:0;display:inline-block">${on ? "&#10003;" : ""}</span>
          <a href="https://5e.tools/spells/${_wSlug}-xphb.html" target="_blank" onclick="event.stopPropagation()" style="color:inherit;text-decoration:underline dotted;text-underline-offset:2px">${escHtml(sp.name)}</a>
        </div>`;
      });
    } else {
      html += `<div style="font-size:var(--fs-label);color:var(--text3)">No cantrips in your spellbook with this filter.</div>`;
    }
    html += `</div>`;

    for (let lv = 1; lv <= 9; lv++) {
      if (lvFilter && lv !== lvFilter) continue;
      const spellbook = getSortedLevelSpells(bucket.wizardSpellbook, lv);
      if (!spellbook.length) continue;

      const preparedSet = new Set(getSortedLevelSpells(bucket.selectedSpells, lv));
      const rows = spellbook.filter((sp) => !query || String(sp).toLowerCase().includes(query));
      if (!rows.length) continue;

      shownRows += rows.length;
      html += `<div style="background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:.52rem .58rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <span style="font-family:var(--ff-display);font-size:var(--fs-label);letter-spacing:.08em;color:var(--gold)">Level ${lv}</span>
          <span style="font-size:var(--fs-label);color:var(--text3)">${preparedSet.size}/${spellbook.length} prepared</span>
        </div>`;

      rows.forEach((spell) => {
        const on = preparedSet.has(spell);
        const safeName = escJsSingle(spell);
        const _wSlug = spell.toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        const _wMeta = Array.isArray(sheetSpellDb) ? sheetSpellDb.find(x => String(x.name||'').toLowerCase() === spell.toLowerCase()) : null;
        const _wConc = _wMeta?.concentration;
        const _wRit  = _wMeta?.ritual;
        html += `<div onclick="toggleWizardPreparedSpell('${safeName}', ${lv}, '${escJsSingle(targetKeyNorm)}')"
          style="display:flex;align-items:center;gap:6px;width:100%;margin:.18rem 0;padding:.36rem .45rem;border-radius:6px;border:1px solid ${on ? "var(--green)" : "var(--bdr)"};background:${on ? "var(--gbg)" : "transparent"};color:${on ? "var(--green)" : "var(--text2)"};cursor:pointer;font-size:var(--fs-meta)">
          <span style="width:14px;flex-shrink:0;display:inline-block">${on ? "&#10003;" : ""}</span>
          <a href="https://5e.tools/spells/${_wSlug}-xphb.html" target="_blank" onclick="event.stopPropagation()" style="color:inherit;text-decoration:underline dotted;text-underline-offset:2px">${escHtml(spell)}</a>
          ${_wConc ? `<span style="color:var(--purple);font-size:.75em;margin-left:auto">C</span>` : ''}
          ${_wRit  ? `<span style="color:var(--teal);font-size:.75em${_wConc ? '' : ';margin-left:auto'}">R</span>` : ''}
        </div>`;
      });

      html += `</div>`;
    }

    if (!shownRows && !cantripPool.length) {
      html += `<div class="phmsg" style="grid-column:1/-1">No results. ${
        query ? "Try a different filter." : "Add spells to your spellbook first."
      }</div>`;
    }

    html += `</div>
        <div style="margin-top:.5rem;font-size:var(--fs-label);color:var(--text3)">Cantrips and prepared spells are managed here; leveled spells require being in your spellbook.</div>
      </div>
      <div style="display:flex;justify-content:flex-end;padding:.75rem 1.1rem;border-top:1px solid var(--bdr)">
        <button onclick="document.getElementById('wizard-prepare-modal').style.display='none'" style="padding:7px 12px;border:1px solid var(--bdr2);border-radius:var(--r);background:var(--bg3);color:var(--text2);cursor:pointer">Close</button>
      </div>
    </div>`;

    shell.modal.innerHTML = html;
    shell.modal.style.display = "block";
  }
  function toggleWizardCantrip(spellName, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target) return;
    const bucket = target.bucket;
    if (!Array.isArray(bucket.selectedCantrips)) bucket.selectedCantrips = [];
    const cap = getWizardCantripCap(target);
    const idx = bucket.selectedCantrips.indexOf(spellName);
    if (idx >= 0) {
      bucket.selectedCantrips.splice(idx, 1);
    } else {
      if (bucket.selectedCantrips.length >= cap) {
        alert(`You have already chosen the maximum of ${cap} cantrips.`);
        return;
      }
      bucket.selectedCantrips.push(spellName);
    }
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
    if (typeof renderSpellsTab === "function") renderSpellsTab();
    if (typeof renderActionsTab === "function") renderActionsTab();

    const input = document.getElementById("wiz-prep-search");
    const q = (input || {}).value || "";
    const lv = Number((input && input.dataset && input.dataset.level) || 0);
    const key = String((input && input.dataset && input.dataset.target) || target.key || "primary");
    openWizardPrepareModal(q, Number.isFinite(lv) ? lv : 0, key);
  }
function toggleWizardPreparedSpell(spellName, spellLevel, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target || typeof WizardSpellbookAPI === "undefined") return;

    const bucket = target.bucket;
    const targetKeyNorm = target.key;
    const intMod = getIntModSafe();
    const clsLv = Number(target.level || getWizardLevel());
    const maxPrepared = getWizardPreparedCap(target, intMod);
    const wasPrepared = !!(bucket.selectedSpells && bucket.selectedSpells[spellLevel] && bucket.selectedSpells[spellLevel].includes(spellName));
    const ok = WizardSpellbookAPI.togglePreparedSpell(bucket, spellName, spellLevel, clsLv, intMod, maxPrepared);

    if (!ok && !wasPrepared) {
      if (!WizardSpellbookAPI.isInSpellbook(bucket, spellName, spellLevel)) {
        alert("You can only prepare spells that are in your spellbook.");
        return;
      }
      alert(`You have already prepared the maximum of ${maxPrepared} spells.`);
      return;
    }

    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
    if (typeof renderSpellsTab === "function") renderSpellsTab();
    if (typeof renderActionsTab === "function") renderActionsTab();

    const modal = document.getElementById("wizard-prepare-modal");
    if (modal && modal.style.display === "block") {
      const input = document.getElementById("wiz-prep-search");
      const q = (input || {}).value || "";
      const lv = Number((input && input.dataset && input.dataset.level) || 0);
      const key = String((input && input.dataset && input.dataset.target) || targetKeyNorm || "primary");
      openWizardPrepareModal(q, Number.isFinite(lv) ? lv : 0, key);
    }
  }

  function spellMatchesWizardList(spell, wizardSet) {
    if (!spell || !spell.name) return false;
    if (wizardSet && wizardSet.has(normSpellKeyLocal(spell.name))) return true;
    return false;
  }

  async function openWizardSpellbookManager(searchTerm, levelFilter, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target) return;

    const shell = getModalShell("wizard-spellbook-manager-modal", 900);
    const query = String(searchTerm || "").toLowerCase().trim();
    const lvFilterNum = Number(levelFilter || 0);
    const targetKeyNorm = target.key;
    const bucket = target.bucket;
    const maxLearnLevel = getWizardMaxLearnLevel(target);

    if ((typeof sheetSpellDb === "undefined" || !Array.isArray(sheetSpellDb) || !sheetSpellDb.length) && typeof _loadSheetSpells === "function") {
      await _loadSheetSpells();
    }
    if (typeof sheetSpellDb === "undefined" || !Array.isArray(sheetSpellDb) || !sheetSpellDb.length) {
      alert("Spell database not available.");
      return;
    }

    const known = new Set();
    const knownByLevel = {};
    if (bucket.wizardSpellbook) {
      Object.entries(bucket.wizardSpellbook).forEach(([lvRaw, spells]) => {
        const lv = Number(lvRaw || 0);
        if (!Array.isArray(spells)) return;
        if (!knownByLevel[lv]) knownByLevel[lv] = [];
        spells.forEach((s) => {
          known.add(s);
          knownByLevel[lv].push(s);
        });
      });
    }

    const wizardSet = getWizardLookupSet();
    const hasWizardLookup = !!(wizardSet && wizardSet.size);
    const needsQueryGate = !hasWizardLookup && !query && !lvFilterNum;

    const available = sheetSpellDb.filter((s) => {
      if (!s || known.has(s.name) || s.level < 0 || s.level > 9) return false;
      if (s.level > 0 && s.level > maxLearnLevel) return false;
      if (lvFilterNum === -1 && s.level !== 0) return false;
      if (lvFilterNum > 0 && s.level !== lvFilterNum) return false;
      if (query && !String(s.name || "").toLowerCase().includes(query)) return false;
      if (hasWizardLookup && !spellMatchesWizardList(s, wizardSet)) return false;
      if (needsQueryGate) return false;
      return true;
    });

    const SCHOOL_SHORT = { A: "Abiu", C: "Amm", D: "Div", E: "Evo", I: "Ill", N: "Nec", T: "Tras", V: "Vegg" };
    const byLevel = {};
    available.forEach((s) => {
      if (!byLevel[s.level]) byLevel[s.level] = [];
      byLevel[s.level].push(s);
    });
    let tabs = `<button class="wiz-chip${!lvFilterNum ? " on" : ""}" onclick="openWizardSpellbookManager((document.getElementById('wiz-book-search')||{}).value,0,'${escJsSingle(targetKeyNorm)}')">All</button>`;
    tabs += `<button class="wiz-chip${lvFilterNum===-1 ? " on" : ""}" onclick="openWizardSpellbookManager((document.getElementById('wiz-book-search')||{}).value,-1,'${escJsSingle(targetKeyNorm)}')">C</button>`;
    for (let lv = 1; lv <= 9; lv++) {
      tabs += `<button class="wiz-chip${lvFilterNum===lv ? " on" : ""}" onclick="openWizardSpellbookManager((document.getElementById('wiz-book-search')||{}).value,${lv},'${escJsSingle(targetKeyNorm)}')">${lv}</button>`;
    }

    let html = `${shell.cardOpen}
      <div style="padding:1rem">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.7rem">
          <div style="font-family:var(--ff-display);font-size:var(--fs-ui-lg);color:var(--gold);flex:1">${luci('book-open')} Spellbook Wizard</div>
          <span style="font-size:var(--fs-label);color:var(--text3)">${escHtml(target.label)}</span>
          <button onclick="document.getElementById('wizard-spellbook-manager-modal').style.display='none'" style="background:none;border:none;color:var(--text2);font-size:20px;cursor:pointer;line-height:1">&times;</button>
        </div>
        <div style="font-size:var(--fs-label);color:var(--text3);margin-bottom:.5rem">You can only add spells up to level ${maxLearnLevel}.</div>
        <input id="wiz-book-search" data-level="${Number.isFinite(lvFilterNum) ? lvFilterNum : 0}" data-target="${escHtml(targetKeyNorm)}" value="${escHtml(searchTerm || "")}" oninput="openWizardSpellbookManager(this.value, ${Number.isFinite(lvFilterNum) ? lvFilterNum : 0}, '${escJsSingle(targetKeyNorm)}')" placeholder="Search spells..." style="width:100%;padding:8px 10px;background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);color:var(--text);margin-bottom:.58rem" />
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:.55rem">${tabs}</div>
        <details open style="background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:.55rem .6rem;margin-bottom:.62rem">
          <summary style="cursor:pointer;user-select:none;font-family:var(--ff-display);font-size:var(--fs-label);letter-spacing:.08em;color:var(--gold)">Spells in your spellbook</summary>
          <div style="margin-top:.45rem">
            ${(() => {
              let rows = "";
              for (let lv = 0; lv <= 9; lv++) {
                const list = Array.from(new Set((knownByLevel[lv] || []).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
                if (!list.length) continue;
                const lvLabel = lv === 0 ? "Cantrip" : `Level ${lv}`;
                rows += `<div style="margin-bottom:.35rem">
                  <div style="font-size:var(--fs-label);color:var(--text3);margin-bottom:.2rem">${lvLabel} (${list.length})</div>
                  ${list.map((sp) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:.4rem;padding:.16rem 0;border-bottom:1px dashed rgba(255,255,255,.06)">
                    <span style="font-size:var(--fs-meta);color:var(--text2)">${escHtml(sp)}</span>
                    <button class="wiz-chip danger" onclick="removeWizardSpellFromSpellbook('${escJsSingle(sp)}', ${lv}, '${escJsSingle(targetKeyNorm)}')">Remove</button>
                  </div>`).join("")}
                </div>`;
              }
              return rows || `<div style="font-size:var(--fs-label);color:var(--text3)">Empty spellbook.</div>`;
            })()}
          </div>
        </details>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:.58rem;max-height:58vh;overflow:auto;padding-right:2px">`;

    let hasAny = false;
    const _allLevels = [0,1,2,3,4,5,6,7,8,9];
    for (const lv of _allLevels) {
      const spells = (byLevel[lv] || []).sort((a, b) => String(a.name).localeCompare(String(b.name)));
      if (!spells.length) continue;
      hasAny = true;
      const lvlLabel = lv === 0 ? "Cantrip" : `Level ${lv}`;

      html += `<div style="background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:.52rem .58rem">
        <div style="font-family:var(--ff-display);font-size:var(--fs-label);letter-spacing:.08em;color:var(--gold);margin-bottom:.35rem">${lvlLabel} (${spells.length})</div>`;

      spells.slice(0, 50).forEach((s) => {
        const safe = escJsSingle(s.name);
        const _wSlug = s.name.toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        const _wSrc  = (s.source || 'xphb').toLowerCase();
        html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:.4rem;padding:.22rem 0;border-bottom:1px dashed rgba(255,255,255,.06)">
          <span style="font-size:var(--fs-meta);color:var(--text2);display:flex;align-items:center;gap:.3rem"><a href="https://5e.tools/spells/${_wSlug}-${_wSrc}.html" target="_blank" style="color:inherit;text-decoration:underline dotted;text-underline-offset:2px">${escHtml(s.name)}</a> <span style="color:var(--text3)">(${escHtml(SCHOOL_SHORT[s.school] || s.school || "")})</span>${s.concentration ? `<span style="color:var(--purple);font-size:.75em">C</span>` : ''}${s.ritual ? `<span style="color:var(--teal);font-size:.75em">R</span>` : ''}</span>
          <button class="wiz-chip" onclick="addWizardSpellToSpellbook('${safe}', ${s.level}, '${escJsSingle(targetKeyNorm)}')">Learn</button>
        </div>`;
      });

      if (spells.length > 50) {
        html += `<div style="font-size:var(--fs-label);color:var(--text3);margin-top:.3rem">Showing 50/${spells.length}. Narrow with search.</div>`;
      }

      html += "</div>";
    }

    if (!hasAny) {
      html += `<div class="phmsg" style="grid-column:1/-1">${
        needsQueryGate
          ? "Enter a search or select a level to begin."
          : "No spells available with this filter."
      }</div>`;
    }

    html += `</div></div>`;

    shell.modal.innerHTML = html;
    shell.modal.style.display = "block";
  }

  function addWizardSpellToSpellbook(spellName, spellLevel, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target || typeof WizardSpellbookAPI === "undefined") return;
    const maxLearnLevel = getWizardMaxLearnLevel(target);
    if (Number(spellLevel || 0) > maxLearnLevel) {
      alert(`Cannot add level ${spellLevel} spells (current max: ${maxLearnLevel}).`);
      return;
    }
    WizardSpellbookAPI.addToSpellbook(target.bucket, spellName, spellLevel);
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
    if (typeof renderSpellsTab === "function") renderSpellsTab();
    const input = document.getElementById("wiz-book-search");
    const q = (input || {}).value || "";
    const lv = Number((input && input.dataset && input.dataset.level) || 0);
    const key = String((input && input.dataset && input.dataset.target) || target.key || "primary");
    openWizardSpellbookManager(q, Number.isFinite(lv) ? lv : 0, key);
  }

  function removeWizardSpellFromSpellbook(spellName, spellLevel, targetKey) {
    const target = resolveWizardTarget(targetKey);
    if (!target || typeof WizardSpellbookAPI === "undefined") return;
    const bucket = target.bucket;
    WizardSpellbookAPI.removeFromSpellbook(bucket, spellName, spellLevel);
    if (Number(spellLevel) === 0 && Array.isArray(bucket?.selectedCantrips)) {
      bucket.selectedCantrips = bucket.selectedCantrips.filter((sp) => sp !== spellName);
    }
    if (Array.isArray(bucket?.selectedSpells?.[spellLevel])) {
      bucket.selectedSpells[spellLevel] = bucket.selectedSpells[spellLevel].filter((sp) => sp !== spellName);
    }
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
    if (typeof renderSpellsTab === "function") renderSpellsTab();
    if (typeof renderActionsTab === "function") renderActionsTab();
    const input = document.getElementById("wiz-book-search");
    const q = (input || {}).value || "";
    const lv = Number((input && input.dataset && input.dataset.level) || 0);
    const key = String((input && input.dataset && input.dataset.target) || target.key || "primary");
    openWizardSpellbookManager(q, Number.isFinite(lv) ? lv : 0, key);
  }

  function openWizardSpellMasteryModal() {
    if (!isPrimaryWizard()) return;
    if (getWizardLevel() < 18) {
      alert("Spell Mastery is available from Level 18.");
      return;
    }

    let modal = document.getElementById("wizard-mastery-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "wizard-mastery-modal";
      modal.className = "modal";
      document.body.appendChild(modal);
    }

    const currentL1 = C.wizardSpellMastery?.[1]?.[0] || "";
    const currentL2 = C.wizardSpellMastery?.[2]?.[0] || "";
    const spellbookL1 = C.wizardSpellbook?.[1] || [];
    const spellbookL2 = C.wizardSpellbook?.[2] || [];

    modal.innerHTML = `<div class="modal-content" style="max-width: 520px;">
      <div class="modal-header">
        <h2>Spell Mastery (L18)</h2>
        <span class="close" onclick="document.getElementById('wizard-mastery-modal').style.display='none'">&times;</span>
      </div>
      <div class="modal-body">
        <p style="color:#666;font-size:var(--fs-label)">Choose 1 level 1 spell and 1 level 2 spell.</p>
        <label style="display:block;margin-bottom:12px"><strong>Level 1:</strong>
          <select onchange="setWizardSpellMasteryL1(this.value)" style="width:100%;padding:6px;margin-top:4px">
            <option value="">-- Select --</option>
            ${spellbookL1.map((s) => `<option value="${escHtml(s)}" ${s === currentL1 ? "selected" : ""}>${escHtml(s)}</option>`).join("")}
          </select>
        </label>
        <label style="display:block"><strong>Level 2:</strong>
          <select onchange="setWizardSpellMasteryL2(this.value)" style="width:100%;padding:6px;margin-top:4px">
            <option value="">-- Select --</option>
            ${spellbookL2.map((s) => `<option value="${escHtml(s)}" ${s === currentL2 ? "selected" : ""}>${escHtml(s)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="modal-footer"><button onclick="document.getElementById('wizard-mastery-modal').style.display='none'" style="padding:8px 16px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer">Close</button></div>
    </div>`;
    modal.style.display = "block";
  }

  function setWizardSpellMasteryL1(spellName) {
    if (!isPrimaryWizard() || typeof WizardSpellbookAPI === "undefined") return;
    const l2 = C.wizardSpellMastery?.[2]?.[0] || "";
    WizardSpellbookAPI.setSpellMastery(C, spellName, l2);
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
  }

  function setWizardSpellMasteryL2(spellName) {
    if (!isPrimaryWizard() || typeof WizardSpellbookAPI === "undefined") return;
    const l1 = C.wizardSpellMastery?.[1]?.[0] || "";
    WizardSpellbookAPI.setSpellMastery(C, l1, spellName);
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
  }

  function openWizardSignatureModal() {
    if (!isPrimaryWizard()) return;
    if (getWizardLevel() < 20) {
      alert("Signature Spells is available from Level 20.");
      return;
    }

    let modal = document.getElementById("wizard-signature-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "wizard-signature-modal";
      modal.className = "modal";
      document.body.appendChild(modal);
    }

    const current = C.wizardSignatureSpells?.[3] || [];
    const spellbookL3 = C.wizardSpellbook?.[3] || [];

    modal.innerHTML = `<div class="modal-content" style="max-width:520px;">
      <div class="modal-header"><h2>Signature Spells (L20)</h2><span class="close" onclick="document.getElementById('wizard-signature-modal').style.display='none'">&times;</span></div>
      <div class="modal-body">
        <p style="color:#666;font-size:var(--fs-label)">Choose 2 level 3 spells always prepared.</p>
        <div style="margin-bottom:12px"><strong>Spell 1:</strong>
          <select onchange="setWizardSignatureSpell1(this.value)" style="width:100%;padding:6px;margin-top:4px">
            <option value="">-- Select --</option>
            ${spellbookL3.map((s) => `<option value="${escHtml(s)}" ${s === current[0] ? "selected" : ""}>${escHtml(s)}</option>`).join("")}
          </select>
        </div>
        <div><strong>Spell 2:</strong>
          <select onchange="setWizardSignatureSpell2(this.value)" style="width:100%;padding:6px;margin-top:4px">
            <option value="">-- Select --</option>
            ${spellbookL3.map((s) => `<option value="${escHtml(s)}" ${s === current[1] ? "selected" : ""}>${escHtml(s)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="modal-footer"><button onclick="document.getElementById('wizard-signature-modal').style.display='none'" style="padding:8px 16px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer">Close</button></div>
    </div>`;
    modal.style.display = "block";
  }

  function setWizardSignatureSpell1(spellName) {
    if (!isPrimaryWizard() || typeof WizardSpellbookAPI === "undefined") return;
    const s2 = C.wizardSignatureSpells?.[3]?.[1] || "";
    WizardSpellbookAPI.setSignatureSpells(C, spellName, s2);
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
  }

  function setWizardSignatureSpell2(spellName) {
    if (!isPrimaryWizard() || typeof WizardSpellbookAPI === "undefined") return;
    const s1 = C.wizardSignatureSpells?.[3]?.[0] || "";
    WizardSpellbookAPI.setSignatureSpells(C, s1, spellName);
    if (typeof localStorage !== "undefined") localStorage.setItem("5e_current_char", JSON.stringify(C));
  }

export const WizardUIIntegration = {
    openWizardPrepareModal,
    toggleWizardCantrip,
    toggleWizardPreparedSpell,
    openWizardSpellMasteryModal,
    setWizardSpellMasteryL1,
    setWizardSpellMasteryL2,
    openWizardSignatureModal,
    setWizardSignatureSpell1,
    setWizardSignatureSpell2,
    openWizardSpellbookManager,
    addWizardSpellToSpellbook,
    removeWizardSpellFromSpellbook,

    init: function () {
      if (typeof window !== "undefined") {
        window.openWizardPrepareModal = openWizardPrepareModal;
        window.toggleWizardCantrip = toggleWizardCantrip;
        window.openWizardSpellMasteryModal = openWizardSpellMasteryModal;
        window.openWizardSignatureModal = openWizardSignatureModal;
        window.openWizardSpellbookManager = openWizardSpellbookManager;
        window.setWizardSpellMasteryL1 = setWizardSpellMasteryL1;
        window.setWizardSpellMasteryL2 = setWizardSpellMasteryL2;
        window.setWizardSignatureSpell1 = setWizardSignatureSpell1;
        window.setWizardSignatureSpell2 = setWizardSignatureSpell2;
        window.addWizardSpellToSpellbook = addWizardSpellToSpellbook;
        window.removeWizardSpellFromSpellbook = removeWizardSpellFromSpellbook;
        window.toggleWizardPreparedSpell = toggleWizardPreparedSpell;
      }
      return true;
    },
  };

