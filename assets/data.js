/* ==========================================================================
   Structured Engineering Dataset — SBC 201 & SBC 801
   Topic 01 (Complete 5-PDF Module) + Master Roadmap of All 41 PDFs / 10 Topics
   ========================================================================== */
window.SBC_DATA = {
  occupancies: [
    { id: "A_tables", group: "A-2 / A-3", label: "تجمعي — طاولات وكراسي (مطاعم / قاعات)", basis: "صافي (Net)", olf: 1.40, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: true, note: "يلزم تعليق لوحة دائمة بعدد الشاغلين قرب المخرج الرئيسي (Sec. 1004.9)." },
    { id: "A_conc", group: "A-3", label: "تجمعي — كراسي غير ثابتة كثيفة (قاعات محاضرات)", basis: "صافي (Net)", olf: 0.65, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: true, note: "أعلى كثافة للمقاعد غير الثابتة؛ يلزم تعليق لوحة عدد الشاغلين (1004.9)." },
    { id: "A_stand", group: "A-3", label: "تجمعي — مساحات وقوف", basis: "صافي (Net)", olf: 0.46, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: true, note: "للمناطق المزدحمة بدون مقاعد؛ يلزم تعليق لوحة عدد الشاغلين (1004.9)." },
    { id: "B_gen", group: "B", label: "إداري ومكاتب عامة (Group B)", basis: "إجمالي (Gross)", olf: 14.00, maxSingleOL: 49, cpNS: 23, cpS: 30, allowWidthReduction: true, isAssembly: false, note: "في SBC 201-2018 معامل المكاتب 14 م² إجمالي؛ والرش الشامل يرفع المسار المشترك لـ 30م." },
    { id: "B_conc", group: "B", label: "إداري كثيف / مراكز اتصال (Concentrated B)", basis: "إجمالي (Gross)", olf: 4.60, maxSingleOL: 49, cpNS: 23, cpS: 30, allowWidthReduction: true, isAssembly: false, note: "يطبق على مراكز الاتصال وصالات التداول والمكاتب عالية الكثافة." },
    { id: "E_class", group: "E", label: "تعليمي — فصول دراسية (Group E)", basis: "صافي (Net)", olf: 1.90, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: false, note: "عرض الممرات التعليمية يصل 1830 مم عند إشغال >= 100 شخص (1020.2)." },
    { id: "E_shop", group: "E", label: "تعليمي — ورش ومعامل مهنية (Group E)", basis: "صافي (Net)", olf: 4.60, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: false, note: "الورش والمعامل التدريبية داخل المدارس والجامعات." },
    { id: "F_ind", group: "F-1 / F-2", label: "صناعي ومصانع (Group F)", basis: "إجمالي (Gross)", olf: 9.30, maxSingleOL: 49, cpNS: 23, cpS: 30, allowWidthReduction: true, isAssembly: false, note: "الرش الآلي الشامل يرفع المسار المشترك إلى 30م." },
    { id: "H_123", group: "H-1 / H-2 / H-3", label: "خطورة عالية جداً (H-1 / H-2 / H-3)", basis: "إجمالي (Gross)", olf: 9.30, maxSingleOL: 3, cpNS: 7.6, cpS: 7.6, allowWidthReduction: false, isAssembly: false, note: "حد المخرج الواحد 3 أشخاص فقط و7.6م؛ ولا يُسمح بتخفيض معامل العرض (Sec. 1005.3)." },
    { id: "H_45", group: "H-4 / H-5", label: "خطورة عالية (H-4 / H-5)", basis: "إجمالي (Gross)", olf: 9.30, maxSingleOL: 10, cpNS: 23, cpS: 23, allowWidthReduction: false, isAssembly: false, note: "حد المخرج الواحد 10 أشخاص؛ ولا يُسمح بتخفيض معامل العرض (Sec. 1005.3)." },
    { id: "I2_sleep", group: "I-2", label: "مؤسسي / مستشفيات — غرف نوم مرضى (I-2)", basis: "إجمالي (Gross)", olf: 11.00, maxSingleOL: 10, cpNS: 23, cpS: 23, allowWidthReduction: false, isAssembly: false, note: "لا يُسمح بتخفيض معامل العرض في I-2 (Sec. 1005.3)؛ راجع استثناء أجنحة الرعاية 407.4." },
    { id: "I2_treat", group: "I-2", label: "مؤسسي / مستشفيات — علاج داخلي (I-2 Inpatient)", basis: "إجمالي (Gross)", olf: 22.00, maxSingleOL: 10, cpNS: 23, cpS: 23, allowWidthReduction: false, isAssembly: false, note: "الممرات الناقلة للأسرة تتطلب عرضاً لا يقل عن 2440 مم؛ ولا يُخفض معامل العرض." },
    { id: "M_sales", group: "M", label: "تجاري ومعارض بيع (Group M)", basis: "إجمالي (Gross)", olf: 5.60, maxSingleOL: 49, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: false, note: "في SBC 201-2018 تم توحيد معامل مساحات البيع التجارية إلى 5.6 م² إجمالي." },
    { id: "R1_hotel", group: "R-1", label: "فندقي وإيواء مؤقت (Group R-1)", basis: "إجمالي (Gross)", olf: 18.60, maxSingleOL: 10, cpNS: 23, cpS: 23, allowWidthReduction: true, isAssembly: false, note: "حد المخرج الواحد للفراغ 10 أشخاص ومسار مشترك 23م." },
    { id: "R2_apt", group: "R-2", label: "سكني متعدد الوحدات (Group R-2)", basis: "إجمالي (Gross)", olf: 18.60, maxSingleOL: 20, cpNS: 23, cpS: 38, allowWidthReduction: true, isAssembly: false, note: "يسمح بمخرج واحد للطابق حتى 4 أدوار و4 وحدات/دور مع رش آلي ومسافة <= 38م (Table 1006.3.4(1))." },
    { id: "S_store", group: "S-1 / S-2", label: "مستودعات وتخزين وميكانيكا (Group S)", basis: "إجمالي (Gross)", olf: 28.00, maxSingleOL: 29, cpNS: 23, cpS: 30, allowWidthReduction: true, isAssembly: false, note: "حد المخرج الواحد 29 شخصاً؛ والرش الآلي يرفع المسار المشترك إلى 30م." }
  ],

  exceptions: [
    { id: "EX-01", sec: "SBC 1004.5", file: "OCCUPANT LOAD CALCULATION.pdf", title: "اعتماد عدد الشاغلين الفعلي بموافقة الدفاع المدني", desc: "يجوز استخدام العدد الفعلي المصمم له الفراغ حتى لو كان أقل من القيمة المحسوبة بجدول 1004.5 بشرط اعتماد الجهة المختصة.", effect: "توثيق مرجعي بالنتيجة" },
    { id: "EX-02", sec: "SBC 1004.7", file: "OCCUPANT LOAD CALCULATION.pdf", title: "استثناء الساحات الخارجية للخدمة فقط أو السكني R-3/R-2", desc: "ساحات الخدمة فقط يكفيها مخرج واحد، وتستثنى الساحات التابعة لـ R-3 والوحدات الفردية بـ R-2.", effect: "إعفاء الساحات الخارجية" },
    { id: "EX-03", sec: "SBC 1005.3.1 & 1005.3.2", file: "Means of Egress Width.pdf", title: "تخفيض معاملات العرض (5.1 مم للسلالم / 3.8 مم للأبواب)", desc: "ينطبق تلقائياً عند وجود نظام رش آلي شامل + نظام إنذار صوتي للطوارئ (EVACS) لجميع الإشغالات ما عدا Group H و Group I-2.", effect: "يُفعّل تلقائياً من مدخلات الرش والإنذار الصوتي" },
    { id: "EX-04", sec: "SBC 1006.2.1 (Ex. 1)", file: "Number Of Exits.pdf", title: "البهو والردهات (Foyers / Lobbies / Vestibules)", desc: "لا يُشترط حساب عدد مخارج الردهة على الحمل التراكمي للمناطق المفرّغة خلالها، لكن يجب تصميم سعة المخارج (العرض) على الحمل التراكمي.", effect: "يحسب عدد المخارج على حمل الفراغ ذاته فقط" },
    { id: "EX-05", sec: "SBC 1006.2.1 (Ex. 2)", file: "Number Of Exits.pdf", title: "أجنحة الرعاية في المستشفيات I-2 (Sec. 407.4)", desc: "تخضع أجنحة الرعاية المطابقة لفقرة 407.4 لاشتراطات مخارجها المخصصة بدلاً من جدول 1006.2.1 العام.", effect: "مرجع خاص بإشغال I-2" },
    { id: "EX-06", sec: "SBC 1006.2.1 (Ex. 3)", file: "Number Of Exits.pdf", title: "غرف الميكانيكا والسطح الفني غير المأهولة", desc: "لا يُشترط فيها الالتزام بقياس مسافة المسار المشترك للخروج (Common Path).", effect: "يلغي تفعيل مخرج ثانٍ بسبب طول المسار المشترك" },
    { id: "EX-07", sec: "SBC 1006.3.4", file: "Number Of Exits.pdf", title: "حالات السماح بمخرج واحد للطابق (R-2 / R-3 / R-4 / ركن آلي)", desc: "يُسمح بمخرج واحد للمباني السكنية R-2 (حتى 4 أدوار و4 وحدات/دور مرشوشة ومسافة <=38م)، أو R-3/R-4، أو مواقف الركن الآلي، أو فراغات تفرغ مباشرة للخارج.", effect: "يسمح بمخرج واحد عند تحقق الشروط" },
    { id: "EX-08", sec: "SBC 1007.1.1 (Ex. 1)", file: "EXIT AND EXIT ACCESS DOORWAY CONFIGURATION.pdf", title: "قياس التباعد عبر ممر مقاوم للحريق 1 ساعة (Sec. 1020)", desc: "عند الربط بين سلالم الخروج الداخلية بممر معزول 1 ساعة، تُقاس مسافة التباعد على أقصر خط انتقال داخل الممر بدلاً من الخط المستقيم.", effect: "تغيير طريقة قياس مسافة التباعد" },
    { id: "EX-09", sec: "SBC 1007.1.1 (Ex. 2)", file: "EXIT AND EXIT ACCESS DOORWAY CONFIGURATION.pdf", title: "تخفيض مسافة التباعد إلى ثلث القطر (D/3) مع الرش الشامل", desc: "عند تجهيز المبنى بالكامل بنظام رش آلي (903.3.1.1 أو 903.3.1.2)، تنخفض المسافة الدنيا بين المخرجين من 1/2 إلى 1/3 أقصى قطر مائل.", effect: "يُفعّل تلقائياً عند اختيار نظام الرش الآلي" },
    { id: "EX-10", sec: "SBC 1006.3.2", file: "Number Of Exits.pdf", title: "المرور بأكثر من طابق مجاور (7 حالات استثنائية)", desc: "يُسمح بعبور أكثر من دور مجاور في: الوحدات السكنية حتى 4 أدوار (R-1/2/3)، الأتريوم (404)، المواقف المفتوحة، شرفات المسارح، والسلالم الخارجية بين الأسطح المأهولة.", effect: "استثناء قاعدة الطابق المجاور الواحد" },
    { id: "EX-11", sec: "SBC 1006.2.2.1", file: "Number Of Exits.pdf", title: "غرف الغلايات والمحارق والأفران (>45م² و >422,000 kJ)", desc: "يلزم بابان بتباعد >= 1/2 القطر؛ ويُسمح بأن يكون أحد البابين سلماً ثابتاً أو درجاً متعاقباً.", effect: "استخدام خاص يفرض مخرجين" },
    { id: "EX-12", sec: "SBC 1006.2.2.2", file: "Number Of Exits.pdf", title: "غرف ماكينات التبريد (>100م²)", desc: "يلزم مخرجان بتباعد >= 1/2 البعد الأفقي الأقصى، ومسافة <=45م، وأبواب تفتح للخارج بأقفال ذعر Panic Hardware وذاتية الإغلاق.", effect: "استخدام خاص يفرض مخرجين + Panic Hardware" },
    { id: "EX-13", sec: "SBC 1006.2.2.3", file: "Number Of Exits.pdf", title: "الغرف المبردة (>100م² وأقل من 20°م)", desc: "يلزم مخرجان ومسافة <=45م (غير مرشوش)، ويستثنى عند محدودية كمية الفريون وفق SBC 501.", effect: "استخدام خاص يفرض مخرجين" },
    { id: "EX-14", sec: "SBC 1007.1.1", file: "EXIT AND EXIT ACCESS DOORWAY CONFIGURATION.pdf", title: "السلالم المتشابكة (Scissor Stairs) تُحسب كمخرج واحد", desc: "أي سلمين متداخلين داخل نفس البئر يُعدان مخرجاً واحداً فقط ولا يحققان اشتراط وجود مخرجين منفصلين.", effect: "تنبيه تصميمي حرج" }
  ],

  presets: [
    {
      name: "قاعة مؤتمرات ومطعم (A-3) — 420 م²",
      values: { occ: "A_tables", area: 420, fixedSeats: 0, wheelchairs: 2, benchLen: 0, extraOL: 35, convOL: 0, level: "ground", commonPath: 18, diagonal: 36, actualSep: 14, sprinkler: "nfpa13", evacs: "yes", specialUse: "none", provExits: 2, provStairW: 1200, provDoorW: 1000 }
    },
    {
      name: "جناح مستشفى (I-2) — 650 م² (بدون تخفيض عرض)",
      values: { occ: "I2_sleep", area: 650, fixedSeats: 0, wheelchairs: 4, benchLen: 0, extraOL: 0, convOL: 110, level: "upper", commonPath: 21, diagonal: 45, actualSep: 16, sprinkler: "nfpa13", evacs: "yes", specialUse: "none", provExits: 2, provStairW: 1200, provDoorW: 1100 }
    },
    {
      name: "مبنى إداري مكاتب (B) + ميزانين — 850 م²",
      values: { occ: "B_gen", area: 850, fixedSeats: 0, wheelchairs: 1, benchLen: 0, extraOL: 25, convOL: 0, level: "upper", commonPath: 26, diagonal: 48, actualSep: 15, sprinkler: "none", evacs: "no", specialUse: "none", provExits: 2, provStairW: 1120, provDoorW: 900 }
    }
  ],

  topics: [
    { num: "01", title: "الأسس وحمل الإشغال وعدد وعرض وتباعد المخارج", sections: "SBC 1001–1007", count: 5, done: true, files: ["Means of Egress Components.pdf", "OCCUPANT LOAD CALCULATION.pdf", "Means of Egress Width.pdf", "Number Of Exits.pdf", "EXIT AND EXIT ACCESS DOORWAY CONFIGURATION.pdf"] },
    { num: "02", title: "مسار الوصول للمخرج ومسافات الانتقال والممرات", sections: "SBC 1016–1021", count: 5, done: false, files: ["Section_1016_Exit_Access.pdf", "Section_1017_Exit_Access_Travel_Distance.pdf", "Section_1018_Aisles.pdf", "Section_1020_Corridors.pdf", "Section 1021 Egress Balconies.pdf"] },
    { num: "03", title: "السلالم والمنحدرات ومستويات الارتفاع", sections: "SBC 1003, 1011, 1012, 1019, 1023", count: 6, done: false, files: ["Section 1011 Stairways.pdf", "Section 1012 Ramps.pdf", "Section_1019_Exit_Access_Stairways_and_Ramps.pdf", "Section 1023 Interior Exit Stairways and Ramps.pdf", "Elevation Change.pdf", "Means of Egress Allowable Height.pdf"] },
    { num: "04", title: "الأبواب والبوابات والدرابزين والحواجز الواقية", sections: "SBC 1010, 1014, 1015", count: 3, done: false, files: ["Section 1010 Doors Gates Turnstiles.pdf", "Handrails.pdf", "Guards.pdf"] },
    { num: "05", title: "ممرات الخروج المحمية والمخارج الأفقية والإنقاذ", sections: "SBC 1024, 1026, 1031, 3104", count: 4, done: false, files: ["Section 1024 Exit Passageways.pdf", "Section 1026 Horizontal Exits.pdf", "Pedestrian Walkway and Tunnels.pdf", "Section_1031_Emergency Escape and Rescue.pdf"] },
    { num: "06", title: "الإضاءة ولوحات الخروج والعلامات المضيئة والعنونة", sections: "SBC 1008, 1013, 1025, 505", count: 4, done: false, files: ["MEANS OF EGRESS ILLUMINATION.pdf", "Section 1013 Exit Signs.pdf", "LUMINOUS EGRESS PATH MARKINGS.pdf", "Address Identification.pdf"] },
    { num: "07", title: "إتاحة ذوي الإعاقة والميزانين والأسطح المأهولة", sections: "SBC 1009, 505, 503.1.4", count: 3, done: false, files: ["Accessible Means of Egress.pdf", "MEZZANINE.pdf", "Occupied External Roofs.pdf"] },
    { num: "08", title: "المصاعد وردهاتها والسلالم المتحركة", sections: "SBC Ch. 30 (3002–3008)", count: 6, done: false, files: ["Elevators General Requirements.pdf", "Elevator Types Required.pdf", "ELEVATOR LOBBIES AND HOISTWAY OPENING PROTECTION.pdf", "Fire Service Access Elevator Requirements.pdf", "Occupant Evacuation Elevator.pdf", "Escalator and Moving Walks Shaft Enclosure Req..pdf"] },
    { num: "09", title: "الارتفاعات والمساحات المسموحة والمباني العالية", sections: "SBC Ch. 4 & 5 (403, 504, 506)", count: 4, done: false, files: ["Allowable Building Area.pdf", "Allowable Building Height.pdf", "Allowable Number of Stories Above Grade Plane.pdf", "High Rise and Building Heights.pdf"] },
    { num: "10", title: "أنظمة الإطفاء الرأسية (الأعمدة الصاعدة Standpipes)", sections: "SBC 801 Sec. 905.3", count: 1, done: false, files: ["When Standpipe is required.pdf"] }
  ]
};
