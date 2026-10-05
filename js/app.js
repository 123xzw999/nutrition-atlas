/* =========================================================================
   营养学全集 · 交互层
   ========================================================================= */
(function () {
  'use strict';
  var NA = window.NA || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 图标：手绘细线，1.4 描边 ---------- */
  var I = {
    search: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 17 17"/></svg>',
    arrow:  '<svg class="arw" width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M0 4.5h12M8.6 1 12 4.5 8.6 8"/></svg>',
    muscle: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c0-4 2.5-7 6.5-7 2 0 3 .6 3.6 1.6"/><path d="M4 15c0 2.6 1.6 4 4 4 3.4 0 6-2 7.6-4.6"/><path d="M14.1 9.6c1.3-1.6 3-2.2 4.6-1.5 1.6.7 1.9 2.4 1.2 4.2-.7 1.8-2.6 3.4-4.3 3.4"/><path d="M6.5 12.2c.9-.6 2-.7 2.8-.2"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4 5 6v5.4c0 4.3 2.9 7.7 7 9.2 4.1-1.5 7-4.9 7-9.2V6z"/><path d="M9.2 11.8l2 2 3.6-3.9"/></svg>',
    heart:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.2s-7.4-4.5-7.4-9.4A4.2 4.2 0 0 1 12 8.3a4.2 4.2 0 0 1 7.4 2.5c0 4.9-7.4 9.4-7.4 9.4z"/><path d="M3.2 12.4h3.4l1.4-2.6 2.1 5 1.8-3.6 1.2 1.2h4.7"/></svg>',
    hair:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6 21V10.5A6 6 0 0 1 18 10.5V21"/><path d="M9 21v-8M12 21v-9.5M15 21v-8"/><path d="M6 12.5c-1.6-.8-2.4-2.4-2-4M18 12.5c1.6-.8 2.4-2.4 2-4"/></svg>',
    bolt:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M13.6 2.6 5.4 13.4h5.1l-1.1 8 8.2-10.8h-5.1z"/></svg>',
    glass:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6.4 3h11.2l-1.1 6.2a4.6 4.6 0 0 1-9 0z"/><path d="M12 13.8V20M8.6 20.4h6.8"/><path d="M8.2 6.6h7.6"/></svg>'
  };

  /* ---------- 图片名回退（营养素 id 对应示意食物） ---------- */
  var IMG_FALLBACK = {
    iron: ['红肉', 'img/iron.jpg'], zinc: ['牡蛎', 'img/zinc.jpg'],
    calcium: ['奶酪', 'img/calcium.jpg'], magnesium: ['南瓜子', 'img/magnesium.jpg'],
    potassium: ['香蕉 / 牛油果', 'img/potassium.jpg'], chromium: ['西兰花', 'img/chromium.jpg'],
    folate: ['深绿叶菜', 'img/folate.jpg'], 'vitamin-a': ['胡萝卜', 'img/vitamin-a.jpg'],
    'vitamin-b1': ['全麦谷物', 'img/vitamin-b1.jpg'], 'vitamin-b2': ['奶制品', 'img/vitamin-b2.jpg'],
    'vitamin-c': ['猕猴桃', 'img/vitamin-c.jpg'], 'vitamin-d': ['三文鱼', 'img/vitamin-d.jpg'],
    'vitamin-e': ['杏仁', 'img/vitamin-e.jpg'], 'vitamin-k': ['羽衣甘蓝', 'img/vitamin-k.jpg'],
    sodium: ['海盐', 'img/sodium.jpg']
  };
  var FOOD_BY_ID = {};
  (NA.foods || []).forEach(function (f) { FOOD_BY_ID[f.id] = f; });

  function foodChip(id) {
    var f = FOOD_BY_ID[id];
    var name, img;
    if (f) { name = f.name; img = f.img; }
    else if (IMG_FALLBACK[id]) { name = IMG_FALLBACK[id][0]; img = IMG_FALLBACK[id][1]; }
    else { return ''; }
    return '<span class="foodstrip__i"><img src="' + img + '" alt="' + name + '" loading="lazy"><span>' + name + '</span></span>';
  }
  function foodStrip(ids) {
    return '<div class="foodstrip">' + (ids || []).map(foodChip).join('') + '</div>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  /* ---------- 页头 / 抽屉 ---------- */
  function header() {
    var mh = $('.masthead'), burger = $('.burger'), drawer = $('.drawer');
    if (mh) {
      var onScroll = function () { mh.classList.toggle('is-stuck', window.scrollY > 8); };
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    }
    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        drawer.classList.toggle('is-open', !open);
      });
    }
  }

  /* ---------- 滚动揭示 ----------
     三重保障：IO 观察 + 视口即时揭示 + load/resize 重测。
     任何一环失效，内容都不会被永久隐藏。 */
  var _io = null;
  function revealInit() {
    var els = $$('.rv');
    if (!els.length) return;
    document.documentElement.classList.add('js-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    if (!_io) {
      _io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); _io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    }
    els.forEach(function (e) { if (!e.classList.contains('in')) _io.observe(e); });
    revealVisible();
  }

  function revealVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    var limit = vh * 0.96;
    $$('.rv:not(.in)').forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (r.top < limit && r.bottom > -vh) {
        e.classList.add('in');
        if (_io) _io.unobserve(e);
      }
    });
  }

  function reveal() {
    revealInit();
    requestAnimationFrame(revealVisible);
  }

  var _rt = null;
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { revealInit(); revealVisible(); });
    setTimeout(revealVisible, 400);
  });
  window.addEventListener('resize', function () {
    clearTimeout(_rt); _rt = setTimeout(revealVisible, 160);
  }, { passive: true });

  /* ---------- 手风琴 ---------- */
  function accordion(rootSel, itemSel, barSel, panelSel, single) {
    var root = $(rootSel); if (!root) return;
    root.addEventListener('click', function (ev) {
      var bar = ev.target.closest(barSel); if (!bar || !root.contains(bar)) return;
      var item = bar.closest(itemSel);
      var panel = $(panelSel, item);
      var open = item.classList.contains('is-open');
      if (single) {
        $$(itemSel + '.is-open', root).forEach(function (o) {
          if (o === item) return;
          o.classList.remove('is-open');
          var p = $(panelSel, o); p.style.height = p.scrollHeight + 'px';
          requestAnimationFrame(function () { p.style.height = '0px'; });
        });
      }
      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function () { panel.style.height = '0px'; });
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
        panel.style.height = panel.scrollHeight + 'px';
        panel.addEventListener('transitionend', function te(e) {
          if (e.propertyName !== 'height') return;
          if (item.classList.contains('is-open')) panel.style.height = 'auto';
          panel.removeEventListener('transitionend', te);
        });
      }
    });
  }

  /* =======================================================================
     首页
     ======================================================================= */
  function initHome() {
    var toc = $('#toc'); if (!toc) return;
    var rows = [
      { no: '01', t: '营养素图鉴', d: '13 种矿物质 + 10 种维生素，从生理作用到缺乏体征逐条拆解', href: 'nutrients.html', img: 'img/hero-nutrients.jpg' },
      { no: '02', t: '身体信号自查', d: '36 类常见症状对应可能缺乏的营养素，附食补方向与就医红线', href: 'symptoms.html', img: 'img/hero-symptoms.jpg' },
      { no: '03', t: '食补图鉴', d: '33 种高营养密度食材，标注关键营养素与实际含量', href: 'foods.html', img: 'img/hero-foods.jpg' },
      { no: '04', t: '男性营养', d: '肌肉、前列腺、心血管、精力与酒精透支的六条主线', href: 'male.html', img: 'img/hero-male.jpg' },
      { no: '05', t: '女性营养', d: '青春期到绝经后的五段生命周期，需求曲线完全不同', href: 'female.html', img: 'img/hero-female.jpg' }
    ];
    toc.innerHTML = rows.map(function (r) {
      return '<a class="toc__row rv" href="' + r.href + '">' +
        '<span class="toc__no">' + r.no + '</span>' +
        '<span class="toc__t">' + r.t + '</span>' +
        '<span class="toc__d">' + r.d + '</span>' +
        '<span class="toc__thumb"><img src="' + r.img + '" alt="" loading="lazy"></span>' +
        '</a>';
    }).join('');

    /* 首页营养素速览：取前 8 个矿物质 */
    var quick = $('#quickNutrients');
    if (quick) {
      quick.innerHTML = (NA.minerals || []).slice(0, 8).map(function (n) {
        return '<a class="qcard rv" href="nutrients.html#' + n.id + '">' +
          '<span class="qcard__sym num">' + n.symbol + '</span>' +
          '<span class="qcard__nm">' + n.name + '</span>' +
          '<span class="qcard__tg">' + n.tagline + '</span>' +
          '</a>';
      }).join('');
    }

    /* 首页症状抽样 */
    var sp = $('#quickSymptoms');
    if (sp) {
      var pick = ['fatigue', 'hairloss', 'cramp', 'insomnia', 'mouthulcer', 'immunity'];
      sp.innerHTML = pick.map(function (id) {
        var s = (NA.symptoms || []).filter(function (x) { return x.id === id; })[0];
        if (!s) return '';
        var top = s.likely.slice(0, 3).map(function (l) { return '<span class="tag">' + l.n + '</span>'; }).join('');
        return '<a class="scard rv" href="symptoms.html#' + s.id + '">' +
          '<span class="scard__cat">' + s.cat + '</span>' +
          '<span class="scard__nm">' + s.name + '</span>' +
          '<span class="scard__tags">' + top + '</span>' +
          '</a>';
      }).join('');
    }
  }

  /* =======================================================================
     营养素页
     ======================================================================= */
  function initNutrients() {
    var list = $('#nlist'); if (!list) return;
    var all = (NA.minerals || []).concat(NA.vitamins || []);
    var GROUPLBL = { trace: '微量元素', macro: '常量元素', vitamin: '维生素' };
    var GROUPTAG = { trace: 'tag--green', macro: 'tag--gold', vitamin: 'tag--clay' };

    function render(filter) {
      var data = all.filter(function (n) { return !filter || filter === 'all' || n.group === filter; });
      list.innerHTML = data.map(function (n) {
        return '<div class="nitem" id="' + n.id + '" data-g="' + n.group + '">' +
          '<button class="nitem__bar" aria-expanded="false">' +
            '<span class="nitem__sym">' + n.symbol + '<em>' + esc(n.en) + '</em></span>' +
            '<span><span class="nitem__nm">' + n.name + '</span><span class="nitem__tg">' + n.tagline + '</span></span>' +
            '<span class="nitem__tags">' +
              '<span class="tag ' + (GROUPTAG[n.group] || '') + '">' + GROUPLBL[n.group] + '</span>' +
              '<span class="tag">缺：' + n.deficiency[0].replace(/（.*?）/, '') + '</span>' +
            '</span>' +
            '<span class="plus"></span>' +
          '</button>' +
          '<div class="nitem__panel"><div class="nitem__inner">' +
            '<div class="nitem__media">' +
              '<div><img class="nitem__img" src="' + n.img + '" alt="' + n.name + '" loading="lazy">' +
              '<div class="nitem__imgcap">' + GROUPLBL[n.group] + ' · ' + n.symbol + '</div></div>' +
              '<div class="nitem__rda"><b>推荐摄入量</b><span>' + n.rda + '</span></div>' +
            '</div>' +
            '<div>' +
              '<p class="lead" style="margin-bottom:22px">' + n.lead + '</p>' +
              '<div class="nitem__cols">' +
                '<div class="blk"><div class="blk__h">生理作用</div><ul>' +
                  n.roles.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>' +
                '<div class="blk blk--warn"><div class="blk__h">缺乏时会出现</div><ul>' +
                  n.deficiency.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>' +
                '<div class="blk"><div class="blk__h">高危人群</div><ul>' +
                  n.groups.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>' +
              '</div>' +
              '<div class="blk"><div class="blk__h">食补方向</div>' + foodStrip(n.foods) + '</div>' +
              '<div class="quote">' + n.note + '</div>' +
              '<div class="metric"><b>参考指标 · </b>' + n.metric + '</div>' +
            '</div>' +
          '</div></div>' +
        '</div>';
      }).join('');
      bindFilters();
    }

    function bindFilters() {
      $$('#nfilters .chip').forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.dataset.f === (curFilter)));
      });
    }

    var curFilter = 'all';
    render(curFilter);

    var fw = $('#nfilters');
    if (fw) {
      fw.addEventListener('click', function (e) {
        var c = e.target.closest('.chip'); if (!c) return;
        curFilter = c.dataset.f; render(curFilter);
        history.replaceState(null, '', curFilter === 'all' ? location.pathname : '#' + curFilter);
      });
    }

    accordion('#nlist', '.nitem', '.nitem__bar', '.nitem__panel', true);

    /* 深链：nutrients.html#iron 或 #trace */
    function openHash() {
      var h = decodeURIComponent(location.hash.replace('#', ''));
      if (!h) return;
      if (['trace', 'macro', 'vitamin'].indexOf(h) >= 0) {
        curFilter = h; render(h); return;
      }
      var el = document.getElementById(h);
      if (!el) return;
      var bar = $('.nitem__bar', el);
      if (bar && !el.classList.contains('is-open')) bar.click();
      setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 90);
    }
    openHash();
    window.addEventListener('hashchange', openHash);
  }

  /* =======================================================================
     症状自查页
     ======================================================================= */
  function initSymptoms() {
    var list = $('#slist'); if (!list) return;
    var sicon = $('#sicon'); if (sicon) sicon.innerHTML = I.search;
    var cats = ['全部'].concat(Array.from(new Set((NA.symptoms || []).map(function (s) { return s.cat; }))));
    var fw = $('#sfilters');
    if (fw) {
      fw.innerHTML = '<span class="filters__lbl">分类</span>' + cats.map(function (c, i) {
        return '<button class="chip" data-c="' + (c === '全部' ? 'all' : c) + '" aria-pressed="' + (i === 0) + '">' + c + '</button>';
      }).join('');
    }
    var state = { q: '', cat: 'all' };

    function render() {
      var q = state.q.trim().toLowerCase();
      var data = (NA.symptoms || []).filter(function (s) {
        if (state.cat !== 'all' && s.cat !== state.cat) return false;
        if (!q) return true;
        var hay = (s.name + ' ' + s.keys + ' ' + s.cat + ' ' + s.likely.map(function (l) { return l.n; }).join(' ')).toLowerCase();
        return hay.indexOf(q) >= 0;
      });
      if (!data.length) {
        list.innerHTML = '<div class="empty"><h3>没有匹配的结果</h3><p>试试更简短的关键词，例如「脱发」「抽筋」「失眠」。</p></div>';
        return;
      }
      list.innerHTML = data.map(function (s) {
        var hint = s.likely.slice(0, 2).map(function (l) { return '<span class="tag ' + (l.lv === 3 ? 'tag--clay' : '') + '">' + l.n + '</span>'; }).join('');
        var rows = s.likely.map(function (l) {
          var m = [1, 2, 3].map(function (i) {
            return '<i class="' + (i <= l.lv ? 'on' : '') + '" data-lv="' + l.lv + '"></i>';
          }).join('');
          return '<div class="sig__r"><span class="sig__n">' + l.n + '</span>' +
            '<span class="sig__meter">' + m + '</span>' +
            '<span class="sig__why">' + l.why + '</span></div>';
        }).join('');
        return '<div class="sitem" id="' + s.id + '">' +
          '<button class="sitem__bar" aria-expanded="false">' +
            '<span class="sitem__cat">' + s.cat + '</span>' +
            '<span class="sitem__nm">' + s.name + '</span>' +
            '<span class="sitem__hint">' + hint + '</span>' +
            '<span class="plus"></span>' +
          '</button>' +
          '<div class="sitem__panel"><div class="sitem__inner">' +
            '<div>' +
              '<div class="blk"><div class="blk__h">可能缺乏（颜色越深，关联越强）</div><div class="sig">' + rows + '</div></div>' +
              '<div class="blk"><div class="blk__h">食补方向</div>' + foodStrip(s.foods) + '</div>' +
            '</div>' +
            '<div class="sitem__side">' +
              '<div class="blk"><div class="blk__h">建议</div><p style="font-size:.9rem;line-height:1.82;color:var(--ink-2)">' + s.advice + '</p></div>' +
              (s.warn ? '<div class="alert"><b>就医提示</b>' + s.warn + '</div>' : '') +
            '</div>' +
          '</div></div>' +
        '</div>';
      }).join('');
    }
    render();

    var si = $('#sinput');
    if (si) {
      var t;
      si.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { state.q = si.value; render(); }, 140);
      });
    }
    if (fw) fw.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      state.cat = c.dataset.c;
      $$('.chip', fw).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      render();
    });
    var clr = $('#sclear');
    if (clr) clr.addEventListener('click', function () { si.value = ''; state.q = ''; render(); si.focus(); });

    accordion('#slist', '.sitem', '.sitem__bar', '.sitem__panel', true);

    function openHash() {
      var h = decodeURIComponent(location.hash.replace('#', '')); if (!h) return;
      var el = document.getElementById(h); if (!el) return;
      var bar = $('.sitem__bar', el);
      if (bar && !el.classList.contains('is-open')) bar.click();
      setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 90);
    }
    openHash();
  }

  /* =======================================================================
     食物图鉴页
     ======================================================================= */
  function initFoods() {
    var grid = $('#fgrid'); if (!grid) return;
    var cats = ['全部'].concat(Array.from(new Set((NA.foods || []).map(function (f) { return f.cat; }))));
    var fw = $('#ffilters');
    var state = { cat: 'all' };

    if (fw) {
      fw.innerHTML = '<span class="filters__lbl">类别</span>' + cats.map(function (c, i) {
        return '<button class="chip" data-c="' + (c === '全部' ? 'all' : c) + '" aria-pressed="' + (i === 0) + '">' + c + '</button>';
      }).join('');
      fw.addEventListener('click', function (e) {
        var c = e.target.closest('.chip'); if (!c) return;
        state.cat = c.dataset.c;
        $$('.chip', fw).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        render();
      });
    }

    function render() {
      var data = (NA.foods || []).filter(function (f) { return state.cat === 'all' || f.cat === state.cat; });
      grid.innerHTML = data.map(function (f) {
        return '<button class="fcard rv" data-id="' + f.id + '">' +
          '<span class="fcard__fig"><img src="' + f.img + '" alt="' + f.name + '" loading="lazy">' +
            '<span class="fcard__dens">' + f.density + '<em>密度</em></span></span>' +
          '<span class="fcard__bd">' +
            '<span class="fcard__nm">' + f.name + '</span>' +
            '<span class="fcard__sub">' + f.sub + ' · ' + f.cat + '</span>' +
            '<span class="fcard__nt">' + f.nutrients.slice(0, 4).map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</span>' +
          '</span>' +
        '</button>';
      }).join('');
      reveal();
    }
    render();

    var sheet = $('#sheet'), panel = $('#sheetPanel');
    function open(id) {
      var f = FOOD_BY_ID[id]; if (!f) return;
      $('#sheetImg').src = f.img; $('#sheetImg').alt = f.name;
      $('#sheetName').textContent = f.name;
      $('#sheetSub').textContent = f.sub + ' · ' + f.cat;
      $('#sheetData').textContent = f.data;
      $('#sheetDesc').textContent = f.desc;
      $('#sheetTip').textContent = f.tip;
      $('#sheetNt').innerHTML = f.nutrients.map(function (n) { return '<span class="tag tag--green">' + n + '</span>'; }).join('');
      sheet.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() { sheet.classList.remove('is-open'); document.body.style.overflow = ''; }

    grid.addEventListener('click', function (e) {
      var c = e.target.closest('.fcard'); if (!c) return; open(c.dataset.id);
    });
    if (sheet) {
      $('.sheet__veil', sheet).addEventListener('click', close);
      $('.sheet__close', sheet).addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
  }

  /* =======================================================================
     性别专区
     ======================================================================= */
  function initSex(kind) {
    var d = NA[kind]; if (!d) return;
    var mount;

    /* 概述格 */
    mount = $('#sexIntro');
    if (mount) {
      mount.innerHTML = d.intro.map(function (x) {
        return '<div class="rv"><dt>' + x.k + '</dt><dd>' + x.v + '</dd></div>';
      }).join('');
    }

    /* 男性：六个关注点 */
    mount = $('#sexFocus');
    if (mount && d.focus) {
      mount.innerHTML = d.focus.map(function (f) {
        return '<div class="focus__i rv">' +
          '<div class="focus__mark">' + (I[f.icon] || '') + '</div>' +
          '<div>' +
            '<div class="focus__hd"><h3>' + f.title + '</h3><span class="kicker">' + f.id + '</span></div>' +
            '<p class="focus__lead">' + f.lead + '</p>' +
            '<div class="focus__cols">' +
              '<div class="blk"><div class="blk__h">要点</div><ul>' +
                f.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>' +
              '<div>' +
                '<div class="blk"><div class="blk__h">对应食物</div>' + foodStrip(f.foods) + '</div>' +
                '<div class="alert"><b>注意</b>' + f.alert + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    /* 女性：生命周期时间轴 */
    mount = $('#sexStages');
    if (mount && d.stages) {
      mount.innerHTML = d.stages.map(function (s) {
        return '<div class="tl__i rv">' +
          '<div class="tl__age">' + s.age + '</div>' +
          '<h3>' + s.title + '</h3>' +
          '<p class="tl__lead">' + s.lead + '</p>' +
          '<div class="needs">' + s.needs.map(function (n) {
            return '<div><b>' + n.n + '</b><span>' + n.v + '</span></div>';
          }).join('') + '</div>' +
          '<div class="tl__foods foodstrip">' + (s.foods || []).map(foodChip).join('') + '</div>' +
          (s.warn ? '<div class="alert"><b>提示</b>' + s.warn + '</div>' : '') +
        '</div>';
      }).join('');
    }

    /* 缺口条 */
    mount = $('#sexGaps');
    if (mount) {
      mount.innerHTML = d.gaps.map(function (g) {
        return '<div class="gapbar rv">' +
          '<div class="gapbar__t"><b>' + g.n + '</b><span class="num">' + g.pct + '%</span></div>' +
          '<div class="gapbar__tr"><i style="width:' + g.pct + '%"></i></div>' +
          '<p>' + g.note + '</p>' +
        '</div>';
      }).join('');
    }

    /* 餐单 */
    mount = $('#sexPlan');
    if (mount) {
      mount.innerHTML = '<div class="plan">' + d.plan.meals.map(function (m) {
        return '<div class="plan__r rv"><div class="plan__t">' + m.t + '</div>' +
          '<div><div class="plan__d">' + m.d + '</div><div class="plan__w">' + m.why + '</div></div></div>';
      }).join('') + '</div>';
    }
  }

  /* ---------- 启动 ---------- */
  function boot() {
    header();
    var page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'nutrients') initNutrients();
    if (page === 'symptoms') initSymptoms();
    if (page === 'foods') initFoods();
    if (page === 'male') initSex('male');
    if (page === 'female') initSex('female');
    reveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
