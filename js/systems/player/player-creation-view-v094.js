/* LEGEND v0.20.39 - anonymous presence and soul-shaping traveler creation.
 * Owns the reusable creation step markup and DOM binding. The creation controller
 * supplies the current state and callbacks; this module never writes player saves.
 */
(() => {
  const escapeHtml = window.LegendHtmlV120.escapeHtml;

  function mount(root, markup, options = {}) {
    if (!root) return;
    const assets = window.LegendAssetsV090 || {};
    const logo = assets.logo?.main || 'assets/ui/logos/logo_legend_main_v1.png';
    const mode = options.mode === 'arrival' ? 'arrival' : 'creation';
    const isArrival = mode === 'arrival';
    const presenceMark = assets.skills?.veil || 'assets/generated/skills/icons/veil.webp';
    const portrait = assets.npcs?.oric || 'assets/generated/npcs/captain-oric.webp';
    const step = Math.max(1, Math.min(7, Number(options.step || 1)));
    const guideText = options.guideText || 'A name is a small beginning. What do you remember?';
    const speaker = isArrival ? 'CAPTAIN ORIC' : '???';
    const role = isArrival ? 'GATE CAPTAIN' : 'A VOICE WITHOUT A NAME';
    const visual = isArrival
      ? '<div class="v140-guide-portrait-frame"><img class="v140-guide-portrait" src="' + escapeHtml(portrait) + '" alt="Captain Oric, Ashmere watch captain" decoding="async"><span>ASHMERE WATCH</span></div>'
      : '<div class="v140-guide-portrait-frame v140-presence-frame" aria-hidden="true"><div class="v140-presence-haze"></div><div class="v140-presence-ring"></div><img class="v140-presence-mark" src="' + escapeHtml(presenceMark) + '" alt="" decoding="async"><span class="v140-presence-glyph">???</span><small class="v140-presence-caption">MEMORY · SHAPE · SELF</small></div>';
    root.innerHTML = '<main class="v094-beginning v140-creation v140-' + mode + '" data-creation-step="' + step + '">' +
      '<div class="v094-beginning-bg" aria-hidden="true"></div>' +
      '<header class="v140-creation-brand"><img src="' + escapeHtml(logo) + '" alt="LEGEND: The Awakening" decoding="async">' +
      '<span>' + (isArrival ? 'THE GATE IS OPEN' : 'BETWEEN MEMORY AND WAKING') + '</span></header>' +
      '<div class="v140-creation-layout">' +
        '<aside class="v140-guide-pane" aria-label="' + (isArrival ? 'Captain Oric at the Ashmere gate' : 'An unnamed voice in the darkness') + '">' +
          visual +
          '<section class="v140-dialogue-box" role="region" aria-live="polite" aria-label="' + (isArrival ? 'Captain Oric dialogue' : 'Unknown speaker dialogue') + '">' +
            '<div class="v140-dialogue-speaker"><strong>' + speaker + '</strong><span>' + role + '</span></div>' +
            '<p>' + escapeHtml(guideText) + '</p>' +
            '<small>' + (isArrival ? 'ASHMERE · FIRST STEPS' : 'A SOUL TAKES SHAPE') + '</small>' +
          '</section>' +
        '</aside>' +
        '<div class="v094-beginning-shell">' + markup + '</div>' +
      '</div></main>';
    root.querySelectorAll('.v140-creation img').forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });
  }

  function actionButtons({ back = false, next = true, label = 'Continue' } = {}) {
    return '<div class="v094-actions">' +
      (next ? '<button class="v094-btn primary" id="v094Next" type="button">' + escapeHtml(label) + '</button>' : '') +
      (back ? '<button class="v094-btn" id="v094Back" type="button">Back</button>' : '') +
      '</div>';
  }

  function stepProgress(step, label) {
    return '<div class="v094-stepper" aria-label="Character creation progress">' +
      '<div class="v094-stepper-top"><span>SOUL TAKING SHAPE</span><strong>STEP ' + step + ' OF 7</strong></div>' +
      '<div class="v094-stepper-track"><i style="width:' + (step / 7 * 100) + '%"></i></div>' +
      '<p>' + escapeHtml(label) + '</p></div>';
  }

  function renderName({ root, name = '', onBack, onSubmit }) {
    mount(root,
      '<section class="v094-beginning-card"><div class="v094-kicker">A Voice in the Dark</div>' +
      stepProgress(1, 'A name gives the forming soul something to answer to.') +
      '<h1>What name shall you carry?</h1><p>Before there is a road, a face, or a past, there is a name. Choose one to gather the scattered pieces around.</p>' +
      '<div class="v094-field"><label for="v094Name">Traveler Name</label>' +
      '<input id="v094Name" maxlength="24" placeholder="A name that feels like yours" value="' + escapeHtml(name) + '">' +
      '<p id="v094NameError" role="alert" style="display:none;color:#ffb4a9;margin:8px 0 0"></p></div>' +
      actionButtons({ back: true, next: true, label: 'Choose Identity' }) + '</section>', { step: 1, guideText: 'A name. Something for the world to call you. Does it come from a memory, a wish, or a future you have not lived yet? Choose, and let it take root.' });
    root?.querySelector('#v094Back')?.addEventListener('click', () => onBack?.());
    root?.querySelector('#v094Next')?.addEventListener('click', () => {
      const input = root.querySelector('#v094Name');
      const error = root.querySelector('#v094NameError');
      onSubmit?.(input, error);
    });
  }

  function choiceMarkup(items, key, selected, classPortraits) {
    const stateKey = key === 'class' ? 'className' : key;
    return '<div class="v094-choice-grid ' + (key === 'class' ? 'v094-class-grid' : '') + '">' +
      items.map(item => {
        const active = selected === item.id;
        const portrait = key === 'class' ? classPortraits?.[item.id] : '';
        return '<button class="v094-choice' + (active ? ' is-selected' : '') + (portrait ? ' v094-choice-has-art' : '') +
          '" data-' + key + '="' + escapeHtml(item.id) + '" aria-pressed="' + active + '">' +
          (portrait ? '<img class="v094-class-art" src="' + escapeHtml(portrait) + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'">' : '') +
          '<strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.text || '') + '</span>' +
          (item.tag ? '<em>' + escapeHtml(item.tag) + '</em>' : '') +
          '<small class="v094-choice-prompt">' + (active ? 'Selected · change any time' : 'Tap to choose') + '</small></button>';
      }).join('') + '</div>';
  }

  function renderChoiceStep({
    root, step, kicker, title, description, items, key, selected,
    classPortraits, nextLabel, progress, scene, onSelect, onBack, onNext
  }) {
    mount(root,
      '<section class="v094-beginning-card v094-choice-scene"><div class="v094-kicker">' + escapeHtml(kicker) + '</div>' +
      stepProgress(step, progress) + '<h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(description) + '</p>' +
      '<aside class="v094-scene-note"><span>FRAGMENT · MEMORY</span><p>' + escapeHtml(scene) + '</p></aside>' +
      choiceMarkup(items, key, selected, classPortraits) +
      '<p id="v094ChoiceError" role="alert" class="v094-choice-error" hidden>Please choose an option to continue.</p>' +
      actionButtons({ back: true, next: true, label: nextLabel }) + '</section>', { step, guideText: ({ gender: 'Look at the outline in the still water. No shape is more true than another. Which feels like you?', personality: 'A feeling returns before the memory that carried it. Which instinct still lives in you?', origin: 'A place rises behind your eyes—rain on a window, smoke in the air, the sense of having belonged. Where does the memory lead?', class: 'Your hands remember what your mind cannot. Steel, bow, spell, or a careful trick: which movement returns without thought?', keepsake: 'A small object hangs in the dark, threaded with warmth. It may be the first memory you trust. What do you reach for?' })[key] || scene, mode: 'creation' });

    root?.querySelectorAll('[data-' + key + ']').forEach(button => {
      button.addEventListener('click', () => onSelect?.(button.dataset[key]));
    });
    root?.querySelector('#v094Back')?.addEventListener('click', () => onBack?.());
    root?.querySelector('#v094Next')?.addEventListener('click', () => {
      if (!selected) {
        const error = root.querySelector('#v094ChoiceError');
        if (error) {
          error.hidden = false;
          error.textContent = 'Choose the option that feels right for your traveler, then continue.';
        }
        return;
      }
      onNext?.();
    });
  }

  function renderConfirmation({ root, name, gender, personality, origin, className, keepsake, onBack, onBegin }) {
    mount(root,
      '<section class="v094-beginning-card v140-soul-confirmation"><div class="v094-kicker">The Shape You Chose</div>' +
      stepProgress(7, 'Fragments of memory gather around the self you have chosen.') +
      '<h2>' + escapeHtml(name) + '</h2><p>A shape gathers from your choices: a name to answer to, instincts that still feel familiar, and memories you may or may not fully trust. The rest can wait.</p>' +
      '<div class="v094-summary"><div><span>Gender</span><strong>' + escapeHtml(gender.label) + ' (' + escapeHtml(gender.pronouns) + ')</strong></div>' +
      '<div><span>Personality</span><strong>' + escapeHtml(personality.label) + '</strong></div>' +
      '<div><span>Origin</span><strong>' + escapeHtml(origin) + '</strong></div>' +
      '<div><span>Class</span><strong>' + escapeHtml(className) + '</strong></div>' +
      '<div><span>Keepsake</span><strong>' + escapeHtml(keepsake) + '</strong></div></div>' +
      actionButtons({ back: true, next: true, label: 'Let Me Wake' }) + '</section>', { step: 7, mode: 'creation', guideText: 'The pieces settle, just for a moment. Some feel chosen. Others feel remembered. You do not need to understand them yet.' });
    root?.querySelector('#v094Back')?.addEventListener('click', () => onBack?.());
    root?.querySelector('#v094Next')?.addEventListener('click', () => onBegin?.());
  }

  function renderIntro({ root, onEnter }) {
    const scenes = [
      {
        kicker: 'THE LAST MILE',
        title: 'Under a Dead Lantern',
        lines: [
          'You wake beneath a dead lantern with no memory of the last mile.',
          'Mud darkens your boots. Behind you, the Old Road folds into fog; ahead, Ashmere glows with tired yellow light.'
        ],
        dialogue: "Easy now. Captain Oric, Ashmere watch. I won't pretend I know where you came from. I only know you were found beneath a lantern that should have been lit."
      },
      {
        kicker: "THE GATEKEEPER'S LEDGER",
        title: 'A Bell, Once',
        lines: [
          'Mara Vell heard the town bell ring once when you arrived. She says that should not be possible.',
          'Oric has no explanation. For now, the bell is a fact to investigate—not an answer.'
        ],
        dialogue: 'Mara keeps the archive. Ask what she heard and what she actually saw. Keep your own guesses separate from the record until there is evidence.'
      },
      {
        kicker: 'FIRST STEPS',
        title: 'Warm Lights. Open Roads.',
        lines: [
          'Ashmere offers a place to rest, provisions, gear, work, and people who know the road.',
          'There is no required order for preparing. You decide when you are ready to leave.'
        ],
        dialogue: 'Speak with the townsfolk first. Sella can help with supplies, Brenn keeps the ledgers, and I can tell you what the watch knows. When ready, check the road board: the High Ridge is safer; the Reed Cut is riskier. The choice is yours.'
      }
    ];
    let index = 0;
    function renderBeat() {
      const scene = scenes[index];
      const goals = index === scenes.length - 1
        ? '<div class="v094-summary"><div><span>First Goal</span><strong>Talk in Town Square</strong></div>' +
          '<div><span>Then</span><strong>Prepare at Inn / Shops</strong></div>' +
          '<div><span>When Ready</span><strong>Choose Your Road</strong></div></div>'
        : '';
      mount(root,
        '<section class="v094-beginning-card v140-arrival-card"><div class="v094-kicker">' + escapeHtml(scene.kicker) + '</div>' +
        '<h2>' + escapeHtml(scene.title) + '</h2><div class="v094-intro-lines">' +
        scene.lines.map(line => '<p>' + escapeHtml(line) + '</p>').join('') +
        '</div>' + goals +
        actionButtons({ back: false, next: true, label: index === scenes.length - 1 ? 'Enter Ashmere' : 'Continue' }) +
        '<button class="v140-skip-intro" id="v140SkipIntro" type="button">Skip arrival briefing</button>' +
        '</section>', { step: 7, mode: 'arrival', guideText: scene.dialogue });
      root?.querySelector('#v140SkipIntro')?.addEventListener('click', () => onEnter?.());
      root?.querySelector('#v094Next')?.addEventListener('click', () => {
        if (index < scenes.length - 1) {
          index += 1;
          renderBeat();
          return;
        }
        onEnter?.();
      });
    }
    renderBeat();
  }

  window.LegendPlayerCreationViewV094 = Object.freeze({
    renderName,
    renderChoiceStep,
    renderConfirmation,
    renderIntro
  });
})();
