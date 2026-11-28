/* ==========================================================================
   Complete Interactive Engine — ALL 41 PDFs & ALL 10 Topics (SBC 201 / 801)
   ========================================================================== */
(function () {
  const D = window.SBC_DATA;
  let presetIndex = 0;
  let lastResult = null;
  let activeTopicNum = "01";

  const $ = (id) => document.getElementById(id);

  function init() {
    renderSidebarTopics();
    populateOccupancySelect();
    renderInteractiveExceptions();
    renderTopicDetail("01");
    renderAllFilesTable();
    renderReferenceTable();
    renderCatalogExceptions();
    renderRoadmap();
    bindNavigation();
    bindInputs();
    loadPreset(0);
  }

  function renderSidebarTopics() {
    const nav = $("topicsNavList");
    nav.innerHTML = D.topics.map((t) => `
      <button class="nav-btn topic-nav-btn" data-view="viewTopicDetail" data-topic="${t.num}">
        <span>📘</span>
        <span>${t.shortTitle}</span>
        <span class="nav-badge">${t.files.length}</span>
      </button>
    `).join("");
  }

  function populateOccupancySelect() {
    const sel = $("in_occ");
    sel.innerHTML = D.occupancies.map(
      (o) => `<option value="${o.id}">${o.group} — ${o.label}</option>`
    ).join("");
  }

  function renderInteractiveExceptions() {
    const activeIds = ["EX-01", "EX-03", "EX-04", "EX-05", "EX-07", "EX-14"];
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

  function switchView(viewId, topicNum) {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    if (viewId === "viewTopicDetail" && topicNum) {
      activeTopicNum = topicNum;
      const btn = document.querySelector(`.topic-nav-btn[data-topic="${topicNum}"]`);
      if (btn) btn.classList.add("active");
      renderTopicDetail(topicNum);
    } else {
      const btn = document.querySelector(`.nav-btn[data-view="${viewId}"]:not(.topic-nav-btn)`);
      if (btn) btn.classList.add("active");
    }
    document.querySelectorAll(".view-panel").forEach((p) => p.classList.remove("active"));
    $(viewId).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindNavigation() {
    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".nav-btn");
      if (btn) {
        switchView(btn.dataset.view, btn.dataset.topic);
      }
      const roadCard = ev.target.closest(".topic-card[data-topic]");
      if (roadCard) {
        switchView("viewTopicDetail", roadCard.dataset.topic);
      }
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
    $("allFilesSearch").addEventListener("input", renderAllFilesTable);
    $("allFilesTopicFilter").addEventListener("change", renderAllFilesTable);
  }

  function loadPreset(idx) {
    const p = D.presets[idx];
    const v = p.values;
    $("in_occ").value = v.occ;
    $("in_area").value = v.area;
    $("in_extraOL").value = v.extraOL;
    $("in_convOL").value = v.convOL;
    $("in_commonPath").value = v.commonPath;
    $("in_travelDist").value = v.travelDist;
    $("in_deadEnd").value = v.deadEnd;
    $("in_diagonal").value = v.diagonal;
    $("in_actualSep").value = v.actualSep;
    $("in_sprinkler").value = v.sprinkler;
    $("in_evacs").value = v.evacs;
    $("in_stories").value = v.stories;
    $("in_heightM").value = v.heightM;
    $("in_mezzArea").value = v.mezzArea;
    $("in_horizDoorW").value = v.horizDoorW;
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
    const extraOL = num("in_extraOL");
    const convOL = num("in_convOL");
    const commonPath = num("in_commonPath");
    const travelDist = num("in_travelDist");
    const deadEnd = num("in_deadEnd");
    const diagonal = num("in_diagonal");
    const actualSep = num("in_actualSep");
    const sprinkler = $("in_sprinkler").value;
    const evacs = $("in_evacs").value === "yes";
    const stories = Math.max(1, Math.floor(num("in_stories")));
    const heightM = num("in_heightM");
    const mezzArea = num("in_mezzArea");
    const horizDoorW = num("in_horizDoorW");
    const provExits = Math.max(1, Math.floor(num("in_provExits")));
    const provStairW = num("in_provStairW");
    const provDoorW = num("in_provDoorW");

    const hasSprinkler = sprinkler !== "none";
    const fullSprinkler = sprinkler === "nfpa13";
    const exFoyer = $("chk_EX-03") && $("chk_EX-03").checked;
    const exMech = $("chk_EX-04") && $("chk_EX-04").checked;
    const exSingleStory = $("chk_EX-05") && $("chk_EX-05").checked;
    const exExtBalcony = $("chk_EX-07") && $("chk_EX-07").checked;
    const exScissor = $("chk_EX-14") && $("chk_EX-14").checked;

    const cpLimit = hasSprinkler ? occ.cpS : occ.cpNS;
    const baseTdLimit = hasSprinkler ? occ.tdS : occ.tdNS;
    const tdLimit = baseTdLimit === 0 ? 0 : baseTdLimit + (exExtBalcony ? 30 : 0);
    const deadEndLimit = fullSprinkler ? 15 : 6;

    $("occBanner").innerHTML = `
      <strong>الإشغال المختار: ${occ.group} (${occ.label})</strong> — معامل الإشغال: <strong>${occ.olf} م²/شخص (${occ.basis})</strong> |
      حد المخرج الواحد: <strong>${occ.maxSingleOL} شخص</strong> |
      المسار المشترك: <strong>${cpLimit} م</strong> |
      مسافة الانتقال القصوى: <strong>${tdLimit === 0 ? "غير مسموح بدون رش" : tdLimit + " م"}</strong>
      <div class="banner-sub">⚠️ ${occ.note}</div>
    `;

    // Topic 01: Occupant Load, Exits, Widths, Remoteness
    const olArea = area > 0 ? Math.ceil(area / occ.olf) : 0;
    const olTotal = olArea + extraOL;
    const olForExitsCount = exFoyer ? olArea : olTotal;
    const olDesignCapacity = Math.max(olTotal, convOL);

    let reqExits = 1;
    let exitReason = "ضمن حدود المخرج الواحد (Table 1006.2.1)";
    if (olForExitsCount > 1000) { reqExits = 4; exitReason = "حمل الإشغال > 1000 شخص (1006.2.1.1)"; }
    else if (olForExitsCount > 500) { reqExits = 3; exitReason = "حمل الإشغال 501–1000 شخص (1006.2.1.1)"; }
    else if (olForExitsCount > occ.maxSingleOL) { reqExits = 2; exitReason = `تجاوز حد المخرج الواحد (${occ.maxSingleOL} شخص)`; }
    else if (!exMech && commonPath > cpLimit) { reqExits = 2; exitReason = `تجاوز المسار المشترك (${cpLimit} م)`; }
    else if (stories > 1 && !exSingleStory) { reqExits = 2; exitReason = "طابق متكرر يتطلب مخرجين (1006.3.3)"; }

    const effectiveExits = exScissor ? 1 : provExits;
    const exitsPass = effectiveExits >= reqExits;

    const canReduceFactor = hasSprinkler && evacs && occ.allowWidthReduction;
    const stairFactor = canReduceFactor ? 5.08 : 7.62;
    const doorFactor = canReduceFactor ? 3.81 : 5.08;

    const reqTotalStairW = Math.ceil(olDesignCapacity * stairFactor);
    const minStairCode = olDesignCapacity < 50 ? 900 : 1100;
    const reqEachStairW = Math.max(minStairCode, Math.ceil(reqTotalStairW / effectiveExits));
    const stair50Rule = reqExits > 1 ? (effectiveExits - 1) * provStairW >= 0.5 * reqTotalStairW : true;
    const stairPass = provStairW >= reqEachStairW && stair50Rule;

    const reqTotalDoorW = Math.ceil(olDesignCapacity * doorFactor);
    const reqEachDoorW = Math.max(800, Math.ceil(reqTotalDoorW / effectiveExits));
    const door50Rule = reqExits > 1 ? (effectiveExits - 1) * provDoorW >= 0.5 * reqTotalDoorW : true;
    const doorPass = provDoorW >= 800 && provDoorW <= 1200 && effectiveExits * provDoorW >= reqTotalDoorW && door50Rule;

    const reqSep = reqExits >= 2 ? +(diagonal * (hasSprinkler ? 1 / 3 : 0.5)).toFixed(2) : 0;
    const sepPass = reqExits < 2 ? true : actualSep >= reqSep;

    // Topic 02: Travel Distance & Dead End
    const tdPass = tdLimit > 0 && travelDist <= tdLimit;
    const dePass = reqExits < 2 ? true : deadEnd <= deadEndLimit;
    const t2Pass = tdPass && dePass;

    // Topic 03 & 09: Height, High-Rise, Stair Rating
    const isHighRise = heightM > 23;
    const stairRating = (isHighRise || stories >= 4) ? "2 ساعة" : "1 ساعة";

    // Topic 05: Horizontal Exit Refuge Area
    let refugeAreaReq = 0;
    if (horizDoorW > 0) {
      const doorCapPeople = Math.ceil(horizDoorW / 5.08);
      const arriving = Math.min(olTotal, doorCapPeople);
      const areaPerPerson = occ.group.startsWith("I-2") ? 2.8 : 0.28;
      refugeAreaReq = +(arriving * areaPerPerson).toFixed(1);
    }

    // Topic 07: Mezzanine
    const mezzLimitRatio = fullSprinkler ? 0.5 : 1 / 3;
    const mezzRatio = area > 0 ? mezzArea / area : 0;
    const mezzPass = mezzArea === 0 || mezzRatio <= mezzLimitRatio;

    // Topic 08: Elevators
    let elevReq = "مصعد ركاب قياسي";
    if (heightM > 128) elevReq = "مصعدا دفاع مدني (FSAE) + مصاعد إخلاء (OEE) + نقالة";
    else if (heightM > 36) elevReq = "مصعدا دفاع مدني (FSAE >=1600 كجم) + نقالة + إتاحة";
    else if (stories >= 4) elevReq = "مصعد طوارئ بنقالة (600×2100مم) + مصعد إتاحة";

    // Topic 10: Standpipe
    let standpipeReq = "غير مطلوب (ارتفاع <= 9م وإشغال <= 1000)";
    if (heightM > 9) {
      standpipeReq = hasSprinkler ? "Class I (بديل Class III لوجود رش آلي)" : "Class III إلزامي (ارتفاع > 9م)";
    } else if (olTotal > 1000 && occ.isAssembly) {
      standpipeReq = "Class I / II (تجمعي > 1000 شخص)";
    }

    // Update KPI Cards
    $("kpi_ol_val").textContent = `${olTotal} شخص`;
    $("kpi_ol_sub").textContent = `مساحة (${olArea}) + إضافي (${extraOL}) | سعة السلم: ${olDesignCapacity}`;

    $("kpi_exits_val").textContent = `${reqExits} مخرج | ${reqEachStairW}/${reqEachDoorW} مم`;
    $("kpi_exits_sub").textContent = `${exitReason} | تباعد: ${reqSep} م`;
    const t1Ok = exitsPass && stairPass && doorPass && sepPass;
    setCardStatus("card_t1", "kpi_t1_badge", t1Ok, t1Ok ? "الموضوع 01 مطابق بالكامل" : "الموضوع 01 يحتاج مراجعة");

    $("kpi_td_val").textContent = `${travelDist} / ${tdLimit} م`;
    $("kpi_td_sub").textContent = `نهاية مسدودة: ${deadEnd} / ${deadEndLimit} م (Sec. 1017 & 1020.5)`;
    setCardStatus("card_t2", "kpi_t2_badge", t2Pass, t2Pass ? "مسافات الانتقال مطابقة" : "تجاوز مسافة الانتقال أو النهاية المسدودة");

    $("kpi_hr_val").textContent = isHighRise ? `مبنى عالٍ (${heightM} م)` : `عادي (${heightM} م)`;
    $("kpi_hr_sub").textContent = `عزل السلم: ${stairRating} | ${standpipeReq.split("(")[0].trim()}`;
    setCardStatus("card_t9", "kpi_t9_badge", mezzPass, isHighRise ? "تطبق اشتراطات Sec. 403" : "ارتفاع قياسي (<=23م)");

    // Detailed Multi-Topic Table
    const rows = [
      ["01 • حمل الإشغال", `${olTotal} شخص (حاكم السعة: ${olDesignCapacity})`, `Area/${occ.olf} + إضافي`, "SBC 1004.5 / 1005.6", "مرجعي"],
      ["01 • عدد المخارج وتباعدها", `المطلوب: ${reqExits} (المتوفر: ${effectiveExits}) | تباعد: ${reqSep} م`, exitReason, "SBC 1006 & 1007", exitsPass && sepPass ? "مطابق" : "غير مطابق"],
      ["01 • عروض السلالم والأبواب", `سلم: ${reqEachStairW} مم (متوفر ${provStairW}) | باب: ${reqEachDoorW} مم (متوفر ${provDoorW})`, `معامل ${stairFactor} / ${doorFactor} مم + قاعدة 50%`, "SBC 1005 / 1010 / 1011", stairPass && doorPass ? "مطابق" : "غير مطابق"],
      ["02 • مسافة الانتقال والنهاية المسدودة", `انتقال: ${travelDist} / ${tdLimit} م | نهاية مسدودة: ${deadEnd} / ${deadEndLimit} م`, `Table 1017.2 & Sec. 1020.5`, "SBC 1017 & 1020", t2Pass ? "مطابق" : "غير مطابق"],
      ["03/09 • عزل السلم والمبنى العالي", `عزل السلم: ${stairRating} | ${isHighRise ? "مبنى عالٍ > 23م (سلم مضغوط 909.20)" : "غير عالٍ <= 23م"}`, `${stories} أدوار / ارتفاع ${heightM} م`, "SBC 403 & 1023.2", "إلزامي"],
      ["05 • المخرج الأفقي ومنطقة اللجوء", horizDoorW > 0 ? `مساحة منطقة اللجوء المطلوبة: ${refugeAreaReq} م²` : "غير مفعل (أدخل عرض باب المخرج الأفقي لحسابه)", `MIN(الإشغال, سعة الباب) × ${occ.group.startsWith("I-2") ? "2.8" : "0.28"} م²`, "SBC 1026.4.1", horizDoorW > 0 ? "محسوب" : "اختياري"],
      ["07 • نسبة الميزانين", mezzArea > 0 ? `${mezzArea} م² (${(mezzRatio * 100).toFixed(1)}% من الدور — الحد ${(mezzLimitRatio * 100).toFixed(0)}%)` : "لا يوجد ميزانين", "Sec. 505.2.1 (1/3 أو 1/2 مرشوش)", "SBC 505.2", mezzPass ? "مطابق" : "غير مطابق"],
      ["08 • المصاعد المطلوبة", elevReq, "1009.2.1 / 3002.4 / 403.6.1 / 3008", "SBC Ch. 30", "إلزامي"],
      ["10 • الأعمدة الصاعدة (Standpipes)", standpipeReq, "SBC 801 Sec. 905.3 (ارتفاع > 9م أو تجمعي > 1000)", "SBC 801 Sec. 905", "إلزامي"]
    ];
    $("resultsTableBody").innerHTML = rows.map(([name, val, eq, code, st]) => `
      <tr>
        <td><strong>${name}</strong></td>
        <td>${val}</td>
        <td>${eq}</td>
        <td class="ltr-cell">${code}</td>
        <td><span class="status-pill ${st === "مطابق" || st === "محسوب" ? "status-pass" : st === "غير مطابق" ? "status-fail" : "status-warn"}">${st}</span></td>
      </tr>
    `).join("");

    // Dynamic Engineering Alerts across all 10 topics
    const notes = [];
    if (occ.isAssembly) notes.push({ type: "warn", text: "الموضوع 01 (SBC 1004.9): إلزامي تعليق لوحة دائمة غير قابلة للتعديل بعدد الشاغلين قرب المخرج الرئيسي." });
    if (hasSprinkler && evacs && !occ.allowWidthReduction) notes.push({ type: "warn", text: "الموضوع 01 (SBC 1005.3): لا يُسمح بتخفيض معاملات العرض لإشغالات Group H و Group I-2 رغم وجود الرش الآلي." });
    if (exScissor) notes.push({ type: "danger", text: "الموضوع 01 (SBC 1007.1.1): السلالم المتشابكة (Scissor Stairs) تُحسب كمخرج واحد فقط!" });
    if (isHighRise) notes.push({ type: "warn", text: "الموضوع 03 و 06 و 09 (SBC 403 / 1023.12 / 1025): المبنى يتجاوز 23م (High-Rise) — يُلزم بتضغيط السلالم (909.20)، مركز قيادة حريق، وشرائط مسار هروب مضيئة (إذا كان A,B,E,I-1,M,R-1)." });
    if (stories > 3 && (!fullSprinkler || occ.group.startsWith("I") || isHighRise)) notes.push({ type: "warn", text: "الموضوع 08 (SBC 3006.2): بئر المصعد يربط أكثر من 3 أدوار — يجب حماية فتحات البئر أو توفير ردهة مصعد مغلقة (Elevator Lobby)." });
    if (occ.group === "R-1") notes.push({ type: "warn", text: "الموضوع 06 (SBC 1013.2): إلزامي تركيب لوحات EXIT منخفضة على ارتفاع 250–450 مم في ممرات غرف الفندق." });
    if (occ.group === "R-2" && stories <= 4) notes.push({ type: "warn", text: "الموضوع 05 (SBC 1031): إلزامي توفير فتحات إنقاذ طارئ (EERO >= 0.53 م²) في كل غرفة نوم وقبو دون الدور الرابع." });
    if (notes.length === 0) notes.push({ type: "ok", text: "جميع اشتراطات الكود السعودي للمواضيع العشرة متوافقة مع المدخلات الحالية." });

    $("dynamicNotes").innerHTML = notes.map((n) => `<div class="note-item ${n.type}">${n.text}</div>`).join("");
    lastResult = { occ, area, olTotal, olDesignCapacity, reqExits, effectiveExits, reqEachStairW, provStairW, reqEachDoorW, provDoorW, reqSep, actualSep, travelDist, tdLimit, deadEnd, deadEndLimit, heightM, stories, elevReq, standpipeReq };
  }

  function setCardStatus(cardId, badgeId, isPass, text) {
    const card = $(cardId);
    const badge = $(badgeId);
    card.classList.remove("pass", "fail", "warn");
    card.classList.add(isPass ? "pass" : "fail");
    badge.className = `status-pill ${isPass ? "status-pass" : "status-fail"}`;
    badge.textContent = text;
  }

  function renderTopicDetail(topicNum) {
    const t = D.topics.find((item) => item.num === topicNum) || D.topics[0];
    $("topicDetailTitle").textContent = `الموضوع ${t.num}: ${t.title}`;
    $("topicDetailCode").textContent = t.sections;
    $("topicDetailScope").innerHTML = `
      <div><strong>🏢 الإشغالات المطبقة قبل البدء:</strong> ${t.occupancies}</div>
      <div style="margin-top:5px"><strong>🎯 متى أستخدم هذا القسم؟</strong> ${t.whenToUse}</div>
    `;
    $("topicPdfChips").innerHTML = t.files.map((f) => `
      <div class="pdf-chip">
        <div class="pdf-chip-name">📄 ${f.name}</div>
        <div class="pdf-chip-sec">${f.sec}</div>
        <div class="pdf-chip-desc">${f.summary}</div>
      </div>
    `).join("");

    $("topicRulesList").innerHTML = t.rules.map((r) => `
      <div class="rule-card">
        <div class="rule-card-head">
          <div class="rule-card-title"><span class="ex-code">${r.id}</span> ${r.sub}</div>
          <div>
            <span class="ex-sec">${r.file}</span>
            <span class="code-pill">${r.code}</span>
          </div>
        </div>
        <div class="rule-grid">
          <div class="rule-box">
            <div class="rule-box-lbl">🏢 الإشغالات المطبقة</div>
            <div>${r.occ}</div>
          </div>
          <div class="rule-box">
            <div class="rule-box-lbl">⚡ متى يُستخدم / شرط التفعيل</div>
            <div>${r.trigger}</div>
          </div>
          <div class="rule-box full">
            <div class="rule-box-lbl">📐 الاشتراطات الهندسية التفصيلية</div>
            <div>${r.req}</div>
          </div>
          <div class="rule-box eq">
            <div class="rule-box-lbl">🧮 المتغيرات والمعادلات</div>
            <div>${r.eq}</div>
          </div>
          <div class="rule-box exc">
            <div class="rule-box-lbl">🛡️ الاستثناءات (Exceptions)</div>
            <div>${r.exc}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderAllFilesTable() {
    const q = ($("allFilesSearch").value || "").trim().toLowerCase();
    const tf = $("allFilesTopicFilter").value;
    let rows = [];
    let idx = 1;
    D.topics.forEach((t) => {
      t.files.forEach((f) => {
        rows.push({ idx: idx++, topicNum: t.num, topicTitle: `${t.num} - ${t.title}`, name: f.name, sec: f.sec, occ: t.occupancies, summary: f.summary });
      });
    });

    const filtered = rows.filter((r) => {
      const matchTopic = tf === "all" || r.topicNum === tf;
      const matchText = !q || `${r.name} ${r.sec} ${r.topicTitle} ${r.summary} ${r.occ}`.toLowerCase().includes(q);
      return matchTopic && matchText;
    });

    $("allFilesTableBody").innerHTML = filtered.map((r) => `
      <tr>
        <td style="text-align:center;font-weight:700">${r.idx}</td>
        <td><a href="#" onclick="return false" class="topic-jump" data-topic="${r.topicNum}" style="color:#0284c7;font-weight:700;text-decoration:none">${r.topicTitle}</a></td>
        <td class="ltr-cell" style="font-size:0.78rem;color:#0f766e">${r.name}</td>
        <td class="ltr-cell" style="font-size:0.78rem">${r.sec}</td>
        <td>${r.summary}</td>
      </tr>
    `).join("");

    document.querySelectorAll(".topic-jump").forEach((a) => {
      a.addEventListener("click", () => switchView("viewTopicDetail", a.dataset.topic));
    });
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
        <td class="ltr-cell">${o.tdNS === 0 ? "NP" : o.tdNS + " م"} / ${o.tdS} م</td>
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
      <div class="topic-card" data-topic="${t.num}">
        <div class="topic-card-top">
          <h4>الموضوع ${t.num}: ${t.title}</h4>
          <span class="status-pill status-pass">مكتمل (${t.files.length} PDF)</span>
        </div>
        <p><strong>الفقرات:</strong> <span dir="ltr">${t.sections}</span> | <strong>عدد البنود:</strong> ${t.rules.length}</p>
        <p style="margin-top:6px;direction:ltr;text-align:right;font-size:0.74rem;color:#475569">${t.files.map((f) => f.name).join(" • ")}</p>
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
      ["عدد المخارج المطلوبة", r.reqExits, `المتوفر: ${r.effectiveExits}`],
      ["العرض المطلوب للسلم / الباب (مم)", `${r.reqEachStairW} / ${r.reqEachDoorW}`, `المتوفر: ${r.provStairW} / ${r.provDoorW}`],
      ["مسافة التباعد الدنيا (م)", r.reqSep, `المتوفرة: ${r.actualSep} م`],
      ["مسافة الانتقال الفعلية / القصوى (م)", `${r.travelDist} / ${r.tdLimit}`, "SBC Table 1017.2"],
      ["النهاية المسدودة الفعلية / القصوى (م)", `${r.deadEnd} / ${r.deadEndLimit}`, "SBC 1020.5"],
      ["الارتفاع / عدد الأدوار", `${r.heightM} م / ${r.stories} أدوار`, r.heightM > 23 ? "مبنى عالٍ High-Rise" : "عادي"],
      ["المصاعد المطلوبة", r.elevReq, "SBC Ch. 30"],
      ["نظام الأعمدة الصاعدة (Standpipe)", r.standpipeReq, "SBC 801 Sec. 905.3"]
    ];
    const csv = "\uFEFF" + lines.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "SBC_Complete_41_PDFs_Report.csv";
    a.click();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
