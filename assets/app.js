/* ==========================================================================
   Interactive Calculation Engine & Dashboard Logic — Topic 01 (SBC 1001–1007)
   ========================================================================== */
(function () {
  const D = window.SBC_DATA;
  let presetIndex = 0;
  let lastResult = null;

  const $ = (id) => document.getElementById(id);

  function init() {
    populateOccupancySelect();
    renderInteractiveExceptions();
    renderReferenceTable();
    renderCatalogExceptions();
    renderRoadmap();
    bindNavigation();
    bindInputs();
    loadPreset(0);
  }

  function populateOccupancySelect() {
    const sel = $("in_occ");
    sel.innerHTML = D.occupancies.map(
      (o) => `<option value="${o.id}">${o.group} — ${o.label}</option>`
    ).join("");
  }

  function renderInteractiveExceptions() {
    const activeIds = ["EX-01", "EX-04", "EX-06", "EX-07", "EX-08", "EX-14"];
    const box = $("interactiveExceptions");
    box.innerHTML = D.exceptions
      .filter((e) => activeIds.includes(e.id))
      .map(
        (e) => `
      <label class="ex-item" data-ex="${e.id}">
        <input type="checkbox" id="chk_${e.id}" />
        <div class="ex-meta">
          <div class="ex-top">
            <span class="ex-code">${e.id}</span>
            <span class="ex-sec">${e.sec}</span>
            <span class="ex-title">${e.title}</span>
          </div>
          <div class="ex-desc">${e.desc}</div>
        </div>
      </label>`
      ).join("");

    box.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
      chk.addEventListener("change", (ev) => {
        ev.target.closest(".ex-item").classList.toggle("checked", ev.target.checked);
        calculate();
      });
    });
  }

  function bindNavigation() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.dataset.view;
        document.querySelectorAll(".view-panel").forEach((p) => p.classList.remove("active"));
        $(target).classList.add("active");
      });
    });

    $("btnPreset").addEventListener("click", () => {
      presetIndex = (presetIndex + 1) % D.presets.length;
      loadPreset(presetIndex);
    });
    $("btnExportCSV").addEventListener("click", exportCSV);
    $("btnPrint").addEventListener("click", () => window.print());
  }

  function bindInputs() {
    document.querySelectorAll("#calcForm input, #calcForm select").forEach((el) => {
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
    });

    $("exSearch").addEventListener("input", renderCatalogExceptions);
    $("exFileFilter").addEventListener("change", renderCatalogExceptions);
  }

  function loadPreset(idx) {
    const p = D.presets[idx];
    const v = p.values;
    $("in_occ").value = v.occ;
    $("in_area").value = v.area;
    $("in_fixedSeats").value = v.fixedSeats;
    $("in_wheelchairs").value = v.wheelchairs;
    $("in_benchLen").value = v.benchLen;
    $("in_extraOL").value = v.extraOL;
    $("in_convOL").value = v.convOL;
    $("in_level").value = v.level;
    $("in_commonPath").value = v.commonPath;
    $("in_diagonal").value = v.diagonal;
    $("in_actualSep").value = v.actualSep;
    $("in_sprinkler").value = v.sprinkler;
    $("in_evacs").value = v.evacs;
    $("in_specialUse").value = v.specialUse;
    $("in_provExits").value = v.provExits;
    $("in_provStairW").value = v.provStairW;
    $("in_provDoorW").value = v.provDoorW;
    $("btnPreset").textContent = `✨ مثال جاهز (${idx + 1}/${D.presets.length}): ${p.name.split("—")[0].trim()}`;
    calculate();
  }

  function num(id) {
    const v = parseFloat($(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    const occ = D.occupancies.find((o) => o.id === $("in_occ").value) || D.occupancies[0];
    const area = num("in_area");
    const fixedSeats = num("in_fixedSeats");
    const wheelchairs = num("in_wheelchairs");
    const benchLen = num("in_benchLen");
    const extraOL = num("in_extraOL");
    const convOL = num("in_convOL");
    const level = $("in_level").value;
    const commonPath = num("in_commonPath");
    const diagonal = num("in_diagonal");
    const actualSep = num("in_actualSep");
    const sprinkler = $("in_sprinkler").value;
    const evacs = $("in_evacs").value === "yes";
    const specialUse = $("in_specialUse").value;
    const provExits = Math.max(1, Math.floor(num("in_provExits")));
    const provStairW = num("in_provStairW");
    const provDoorW = num("in_provDoorW");

    const hasSprinkler = sprinkler !== "none";
    const exMech = $("chk_EX-06") && $("chk_EX-06").checked;
    const exFoyer = $("chk_EX-04") && $("chk_EX-04").checked;
    const exSingleStory = $("chk_EX-07") && $("chk_EX-07").checked;
    const exRatedCorr = $("chk_EX-08") && $("chk_EX-08").checked;
    const exScissor = $("chk_EX-14") && $("chk_EX-14").checked;

    // 1. Dynamic Info Banner
    const cpLimit = hasSprinkler ? occ.cpS : occ.cpNS;
    $("occBanner").innerHTML = `
      <strong>الإشغال المختار: ${occ.group} (${occ.label})</strong> — معامل الإشغال: <strong>${occ.olf} م²/شخص (${occ.basis})</strong> |
      حد المخرج الواحد: <strong>${occ.maxSingleOL} شخص</strong> |
      حد المسار المشترك: <strong>${cpLimit} م</strong> (Table 1004.5 & Table 1006.2.1)
      <div class="banner-sub">⚠️ ${occ.note}</div>
    `;

    // 2. Occupant Load (Sec. 1004)
    const olArea = area > 0 ? Math.ceil(area / occ.olf) : 0;
    const olBench = benchLen > 0 ? Math.ceil(benchLen / 0.45) : 0;
    const olSpaceOnly = olArea + fixedSeats + wheelchairs * 2 + olBench;
    const olTotal = olSpaceOnly + extraOL;
    const olForExitsCount = exFoyer ? olSpaceOnly : olTotal;
    const olDesignCapacity = Math.max(olTotal, convOL);

    // 3. Required Number of Exits (Sec. 1006)
    let reqExits = 1;
    let exitReason = "ضمن حدود المخرج الواحد (Table 1006.2.1)";

    if (olForExitsCount > 1000) {
      reqExits = 4;
      exitReason = "حمل الإشغال > 1000 شخص (Sec. 1006.2.1.1 & Table 1006.3.3)";
    } else if (olForExitsCount > 500) {
      reqExits = 3;
      exitReason = "حمل الإشغال بين 501 و 1000 شخص (Sec. 1006.2.1.1)";
    } else if (olForExitsCount > occ.maxSingleOL) {
      reqExits = 2;
      exitReason = `تجاوز حد المخرج الواحد (${occ.maxSingleOL} شخص) — Table 1006.2.1`;
    } else if (!exMech && commonPath > cpLimit) {
      reqExits = 2;
      exitReason = `تجاوز طول المسار المشترك المسموح (${cpLimit} م) — Table 1006.2.1`;
    } else if (level !== "ground" && !exSingleStory) {
      reqExits = 2;
      exitReason = "طابق متكرر/قبو/سطح مأهول يتطلب مخرجين ما لم تتحقق شروط مخرج واحد (1006.3.4)";
    }

    if (specialUse === "boiler" && area > 45) {
      reqExits = Math.max(reqExits, 2);
      exitReason = "غرفة غلايات/أفران > 45 م² (Sec. 1006.2.2.1)";
    } else if (specialUse === "refrig_mach" && area > 100) {
      reqExits = Math.max(reqExits, 2);
      exitReason = "غرفة ماكينات تبريد > 100 م² (Sec. 1006.2.2.2)";
    } else if (specialUse === "cold_room" && area > 100) {
      reqExits = Math.max(reqExits, 2);
      exitReason = "غرفة مبردة > 100 م² وحرارة < 20°م (Sec. 1006.2.2.3)";
    } else if (specialUse === "elec") {
      reqExits = Math.max(reqExits, 2);
      exitReason = "غرفة كهرباء (راجع NFPA 70 Sec. 110.26 / 110.33 & SBC 1006.2.2.4)";
    }

    const effectiveProvidedExits = exScissor ? 1 : provExits;
    const exitsPass = effectiveProvidedExits >= reqExits;

    // 4. Widths & Capacity Factors (Sec. 1005)
    const canReduceFactor = hasSprinkler && evacs && occ.allowWidthReduction;
    const stairFactor = canReduceFactor ? 5.1 : 7.6;
    const doorFactor = canReduceFactor ? 3.8 : 5.1;

    const reqTotalStairW = Math.ceil(olDesignCapacity * stairFactor);
    const minSingleStairCode = olDesignCapacity < 50 ? 915 : 1120;
    const reqEachStairW = Math.max(minSingleStairCode, Math.ceil(reqTotalStairW / effectiveProvidedExits));
    const stair50Rule = reqExits > 1 ? (effectiveProvidedExits - 1) * provStairW >= 0.5 * reqTotalStairW : true;
    const stairPass = provStairW >= reqEachStairW && stair50Rule;

    const reqTotalDoorW = Math.ceil(olDesignCapacity * doorFactor);
    const reqEachDoorW = Math.max(815, Math.ceil(reqTotalDoorW / effectiveProvidedExits));
    const door50Rule = reqExits > 1 ? (effectiveProvidedExits - 1) * provDoorW >= 0.5 * reqTotalDoorW : true;
    const doorPass = provDoorW >= 815 && provDoorW <= 1220 && effectiveProvidedExits * provDoorW >= reqTotalDoorW && door50Rule;

    // 5. Exit Separation / Remoteness (Sec. 1007)
    const sepRatio = hasSprinkler ? 1 / 3 : 0.5;
    const reqSep = reqExits >= 2 ? +(diagonal * sepRatio).toFixed(2) : 0;
    const sepPass = reqExits < 2 ? true : actualSep >= reqSep;

    // Update KPI Cards
    $("kpi_ol_val").textContent = `${olTotal} شخص`;
    $("kpi_ol_sub").textContent = convOL > olTotal
      ? `حمل التقاء السلم الحاكم: ${olDesignCapacity} شخص (Sec. 1005.6)`
      : `مساحة (${olArea}) + ثابت (${fixedSeats}) + متحرك×2 (${wheelchairs * 2}) + متداخل (${extraOL})`;

    $("kpi_exits_val").textContent = `${reqExits} مخرج`;
    $("kpi_exits_sub").textContent = exitReason;
    setCardStatus("card_exits", "kpi_exits_badge", exitsPass, exitsPass ? `مطابق (المتوفر: ${effectiveProvidedExits})` : `غير مطابق (المتوفر الفعلي: ${effectiveProvidedExits})`);

    $("kpi_width_val").textContent = `${reqEachStairW} / ${reqEachDoorW} مم`;
    $("kpi_width_sub").textContent = `معامل السلم ${stairFactor} مم | معامل الباب ${doorFactor} مم | الإجمالي المطلوب: ${reqTotalStairW} / ${reqTotalDoorW} مم`;
    const widthBothPass = stairPass && doorPass;
    setCardStatus("card_width", "kpi_width_badge", widthBothPass, widthBothPass ? "مطابق + يحقق قاعدة 50%" : "غير مطابق — راجع عرض السلم/الباب أو قاعدة 50%");

    $("kpi_sep_val").textContent = reqExits < 2 ? "لا ينطبق" : `${reqSep} م`;
    $("kpi_sep_sub").textContent = reqExits < 2
      ? "المشروع يتطلب مخرجاً واحداً فقط"
      : `${hasSprinkler ? "ثلث القطر (D/3) لوجود رش آلي" : "نصف القطر (D/2) بدون رش آلي"} | المتوفر: ${actualSep} م`;
    setCardStatus("card_sep", "kpi_sep_badge", sepPass, reqExits < 2 ? "مخرج واحد" : sepPass ? "تباعد مطابق (Sec. 1007)" : `أقل من المطلوب بـ ${(reqSep - actualSep).toFixed(2)} م`);

    // Detailed Summary Table
    const rows = [
      ["حمل الإشغال التصميمي", `${olTotal} شخص (حاكم السعة: ${olDesignCapacity})`, `Area/${occ.olf} + مقاعد + متداخل`, "SBC 1004.2 / 1004.5 / 1004.6", "مرجعي"],
      ["عدد المخارج المطلوبة", `${reqExits} مخرج (المتوفر الفعلي: ${effectiveProvidedExits})`, exitReason, "SBC 1006.2 / 1006.3", exitsPass ? "مطابق" : "غير مطابق"],
      ["عرض السلالم الصافي", `المطلوب للسلم: ${reqEachStairW} مم (المتوفر: ${provStairW} مم)`, `${olDesignCapacity} × ${stairFactor} مم + قاعدة 50%`, "SBC 1005.3.1 / 1005.5 / 1011.2", stairPass ? "مطابق" : "غير مطابق"],
      ["عرض الأبواب الصافي", `المطلوب للباب: ${reqEachDoorW} مم (المتوفر: ${provDoorW} مم)`, `${olDesignCapacity} × ${doorFactor} مم (حد الضلفة 815–1220 مم)`, "SBC 1005.3.2 / 1005.5 / 1010.1.1", doorPass ? "مطابق" : "غير مطابق"],
      ["مسافة التباعد بين المخارج", reqExits < 2 ? "لا ينطبق" : `الدنيا: ${reqSep} م (المتوفرة: ${actualSep} م)`, `${diagonal} × ${hasSprinkler ? "1/3" : "1/2"}${exRatedCorr ? " (تقاس داخل الممر 1س)" : ""}`, "SBC 1007.1.1", sepPass ? "مطابق" : "غير مطابق"]
    ];
    $("resultsTableBody").innerHTML = rows.map(([name, val, eq, code, st]) => `
      <tr>
        <td><strong>${name}</strong></td>
        <td>${val}</td>
        <td>${eq}</td>
        <td class="ltr-cell">${code}</td>
        <td><span class="status-pill ${st === "مطابق" ? "status-pass" : st === "مرجعي" ? "status-warn" : "status-fail"}">${st}</span></td>
      </tr>
    `).join("");

    // Dynamic Engineering Notes
    const notes = [];
    if (occ.isAssembly) notes.push({ type: "warn", text: "إلزامي (SBC 1004.9): تعليق لوحة دائمة غير قابلة لتعديل الأرقام توضح عدد الشاغلين المسموح به قرب المخرج الرئيسي للإشغال التجمعي." });
    if (hasSprinkler && evacs && !occ.allowWidthReduction) notes.push({ type: "warn", text: "تنبيه (SBC 1005.3.1): رغم وجود رش آلي وإنذار صوتي، لا يسمح الكود بتخفيض معاملات العرض لإشغالات Group H و Group I-2 (يبقى 7.6 مم للسلم و5.1 مم للأبواب)." });
    if (exScissor) notes.push({ type: "danger", text: "تنبيه حرج (SBC 1007.1.1): تم تفعيل خيار السلالم المتشابكة (Scissor Stairs) — الكود يعتبرهما مخرجاً واحداً فقط!" });
    if (specialUse === "refrig_mach") notes.push({ type: "warn", text: "غرفة ماكينات التبريد (SBC 1006.2.2.2): إلزامي فتح الأبواب للخارج + أجهزة Panic Hardware + محكمة وذاتية الإغلاق + مسافة انتقال <= 45م." });
    if (specialUse === "veh_ramp") notes.push({ type: "danger", text: "منحدر المركبات (SBC 1006.2.2.5): لا يُعد منحدر وصول للمخرج إلا في حال توفير رصيف ومرافق مخصصة للمشاة." });
    if (provDoorW > 1220) notes.push({ type: "danger", text: "عرض ضلفة الباب يتجاوز الحد الأقصى المسموح في الكود السعودي (1220 مم — SBC 1010.1.1)." });
    if (exRatedCorr && reqExits >= 2) notes.push({ type: "ok", text: "استثناء (SBC 1007.1.1 Ex.1): عند الربط بممر مقاوم للحريق 1 ساعة (Sec. 1020) تُقاس مسافة التباعد على أقصر خط انتقال داخل الممر." });
    if (notes.length === 0) notes.push({ type: "ok", text: "جميع المعايير الهندسية للموضوع 01 (SBC 1001–1007) واضحة ولا توجد محاذير إضافية على المدخلات الحالية." });

    $("dynamicNotes").innerHTML = notes.map((n) => `<div class="note-item ${n.type}">${n.text}</div>`).join("");

    lastResult = { occ, area, olTotal, olDesignCapacity, reqExits, effectiveProvidedExits, stairFactor, doorFactor, reqEachStairW, provStairW, reqEachDoorW, provDoorW, reqSep, actualSep, exitsPass, stairPass, doorPass, sepPass };
  }

  function setCardStatus(cardId, badgeId, isPass, text) {
    const card = $(cardId);
    const badge = $(badgeId);
    card.classList.remove("pass", "fail", "warn");
    card.classList.add(isPass ? "pass" : "fail");
    badge.className = `status-pill ${isPass ? "status-pass" : "status-fail"}`;
    badge.textContent = text;
  }

  function renderReferenceTable() {
    $("refTableBody").innerHTML = D.occupancies.map((o) => `
      <tr>
        <td class="ltr-cell">${o.group}</td>
        <td><strong>${o.label}</strong></td>
        <td>${o.basis}</td>
        <td class="ltr-cell">${o.olf.toFixed(2)}</td>
        <td class="ltr-cell">${o.maxSingleOL}</td>
        <td class="ltr-cell">${o.cpNS} م / ${o.cpS} م</td>
        <td>${o.allowWidthReduction ? '<span class="status-pill status-pass">مسموح</span>' : '<span class="status-pill status-fail">ممنوع (H/I-2)</span>'}</td>
        <td>${o.note}</td>
      </tr>
    `).join("");
  }

  function renderCatalogExceptions() {
    const q = ($("exSearch").value || "").trim().toLowerCase();
    const f = $("exFileFilter").value;
    const filtered = D.exceptions.filter((e) => {
      const matchFile = f === "all" || e.file === f;
      const matchText = !q || `${e.id} ${e.sec} ${e.title} ${e.desc} ${e.file}`.toLowerCase().includes(q);
      return matchFile && matchText;
    });
    $("catalogTableBody").innerHTML = filtered.map((e) => `
      <tr>
        <td class="ltr-cell">${e.id}</td>
        <td class="ltr-cell">${e.sec}</td>
        <td><strong>${e.title}</strong></td>
        <td>${e.desc}</td>
        <td class="ltr-cell" style="font-size:0.76rem">${e.file}</td>
      </tr>
    `).join("");
  }

  function renderRoadmap() {
    $("topicsGrid").innerHTML = D.topics.map((t) => `
      <div class="topic-card ${t.done ? "done" : ""}">
        <div class="topic-card-top">
          <h4>الموضوع ${t.num}: ${t.title}</h4>
          <span class="status-pill ${t.done ? "status-pass" : "status-warn"}">${t.done ? "مكتمل (نموذج فعّال)" : `جاهز (${t.count} ملفات)`}</span>
        </div>
        <p><strong>الفقرات:</strong> <span dir="ltr">${t.sections}</span> | <strong>عدد الملفات:</strong> ${t.count} PDF</p>
        <p style="margin-top:6px;direction:ltr;text-align:right;font-size:0.75rem;color:#475569">${t.files.join(" • ")}</p>
      </div>
    `).join("");
  }

  function exportCSV() {
    if (!lastResult) return;
    const r = lastResult;
    const lines = [
      ["البند", "القيمة المحسوبة / المتوفرة", "الحالة / المرجع"],
      ["نوع الإشغال", `${r.occ.group} - ${r.occ.label}`, "SBC Table 1004.5"],
      ["المساحة (م2)", r.area, "SBC 1004.5"],
      ["حمل الإشغال التصميمي (شخص)", r.olTotal, `السعة الحاكمة: ${r.olDesignCapacity}`],
      ["عدد المخارج المطلوبة", r.reqExits, r.exitsPass ? "مطابق" : "غير مطابق"],
      ["معامل عرض السلالم (مم/شخص)", r.stairFactor, "SBC 1005.3.1"],
      ["العرض المطلوب للسلم (مم)", r.reqEachStairW, `المتوفر: ${r.provStairW} مم (${r.stairPass ? "مطابق" : "غير مطابق"})`],
      ["معامل عرض الأبواب (مم/شخص)", r.doorFactor, "SBC 1005.3.2"],
      ["العرض المطلوب للباب (مم)", r.reqEachDoorW, `المتوفر: ${r.provDoorW} مم (${r.doorPass ? "مطابق" : "غير مطابق"})`],
      ["مسافة التباعد الدنيا بين المخارج (م)", r.reqSep, `المتوفرة: ${r.actualSep} م (${r.sepPass ? "مطابق" : "غير مطابق"})`]
    ];
    const csv = "\uFEFF" + lines.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "SBC_Topic01_Egress_Report.csv";
    a.click();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
