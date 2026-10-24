/* LEGEND v0.23.0 — encounter victory and defeat debrief.
 * This is presentation only: combat owns rewards, stats, pressure and saves.
 */
(() => {
  function create(context = {}) {
    const { renderShell, getAssets, escapeHtml, onContinue, onReturnToTown } = context;
    if (typeof renderShell !== 'function' || typeof getAssets !== 'function' ||
        typeof escapeHtml !== 'function') return null;

    const shell = renderShell;
    const A = () => getAssets() || {};
    const esc = escapeHtml;

    function enemyArt(enemy, assets) {
      const name = String(enemy?.name || '').toLowerCase();
      const enemies = assets.enemies || {};
      return (name.includes('wolf') ? enemies.blackrootWolf
        : name.includes('goblin') ? enemies.roadGoblin
        : name.includes('wisp') ? enemies.lanternWisp
        : name.includes('sentinel') ? enemies.mireboundSentinel
        : '') || assets.byName?.(enemy?.name) || '';
    }

    function render(payload = {}) {
      const { player, enemy = {}, progress = {}, result = 'victory', rewardName = '', goldGained = 0,
        routeStage = 0, onContinue: continueAction, onReturn: returnAction } = payload;
      if (!player) return false;
      const victory = result !== 'defeat';
      const assets = A();
      const sceneArt = assets.locations?.oldRoad || assets.title?.background || '';
      const foeArt = enemyArt(enemy, assets);
      const heroArt = assets.classes?.[player.className] || '';
      const xpGained = Math.max(0, Number(progress.gained || 0));
      const levelsGained = Math.max(0, Number(progress.levels || 0));
      const levelNow = Math.max(1, Number(player.level || 1));
      const levelBefore = Math.max(1, Number(enemy.combatStartLevel || levelNow) || levelNow);
      const gold = Math.max(0, Number(goldGained || 0));
      const levelMarkup = levelsGained
        ? '<div class="v152-result-level-note"><span aria-hidden="true">✦</span><div><strong>NEW LEVEL REACHED</strong><p>Level ' + levelBefore + ' → level ' + levelNow + '. Your growth choices are ready.</p></div></div>'
        : '';
      const rewardMarkup = victory
        ? '<div class="v152-result-reward"><span class="v152-result-card-symbol" aria-hidden="true">✦</span><div><span>RECOVERED</span><strong>' + esc(rewardName || 'Field salvage') + '</strong><small>Added to your pack</small></div><b>+1</b></div>'
        : '<div class="v152-result-reward v152-result-reward-muted"><span class="v152-result-card-symbol" aria-hidden="true">◌</span><div><span>FIELD RECOVERY</span><strong>Nothing recovered</strong><small>You were forced back before you could secure the drop</small></div></div>';
      const goldMarkup = gold > 0
        ? '<div class="v152-result-small-reward"><span>Coin found in the fight</span><strong>+' + gold + 'g</strong></div>'
        : '';
      const continueButton = victory
        ? '<button type="button" class="v152-result-action v152-result-action-primary" id="v152CombatContinue" data-legend-scene-transition="Returning to the Old Road"><span><strong>Continue along the road</strong><small>Keep your route and discoveries</small></span><b aria-hidden="true">→</b></button>'
        : '<button type="button" class="v152-result-action v152-result-action-primary" id="v152CombatReturn" data-legend-scene-transition="Returning wounded to Ashmere"><span><strong>Return to Ashmere</strong><small>Recover and prepare before the next outing</small></span><b aria-hidden="true">→</b></button>';
      const secondaryButton = victory
        ? '<button type="button" class="v152-result-action" id="v152CombatReturn" data-legend-scene-transition="Returning to Ashmere"><span><strong>End the outing</strong><small>Bring your progress back to town</small></span></button>'
        : '';

      shell(
        '<main class="v152-combat-results ' + (victory ? 'is-victory' : 'is-defeat') + '" aria-label="' + (victory ? 'Battle victory results' : 'Battle defeat results') + '">' +
          '<div class="v152-results-backdrop">' + (sceneArt ? '<img src="' + esc(sceneArt) + '" alt="" aria-hidden="true">' : '') + '<div></div></div>' +
          '<section class="v152-results-frame">' +
            '<header class="v152-results-heading"><span class="v152-results-kicker">' + (victory ? 'ENCOUNTER RESOLVED · THE OLD ROAD' : 'EXPEDITION INTERRUPTED · THE OLD ROAD') + '</span>' +
              '<h1>' + (victory ? 'Victory' : 'Driven Back') + '</h1>' +
              '<p>' + (victory ? 'The danger has passed. Take stock before the road calls again.' : 'The road turns against you. Return to Ashmere and regroup.') + '</p>' +
            '</header>' +
            '<section class="v152-results-duel" aria-label="Encounter summary">' +
              '<div class="v152-results-foe">' +
                (foeArt ? '<img src="' + esc(foeArt) + '" alt="' + esc(enemy.name || 'Enemy') + '">' : '<div class="v152-results-foe-fallback" aria-hidden="true">✦</div>') +
                '<div><span>' + (victory ? 'DEFEATED' : 'ENCOUNTER') + '</span><strong>' + esc(enemy.name || 'Road encounter') + '</strong></div>' +
              '</div>' +
              '<div class="v152-results-divider" aria-hidden="true"><span>✦</span></div>' +
              '<div class="v152-results-hero">' +
                (heroArt ? '<img src="' + esc(heroArt) + '" alt="">' : '<div class="v152-results-hero-fallback" aria-hidden="true">✧</div>') +
                '<div><span>YOUR TRAVELER</span><strong>' + esc(player.username || 'Traveler') + '</strong><small>Level ' + levelNow + ' · ' + esc(player.className || 'Wayfarer') + '</small></div>' +
              '</div>' +
            '</section>' +
            '<section class="v152-results-rewards" aria-label="Rewards and progress">' +
              '<div class="v152-results-section-head"><span>AFTER THE CLASH</span><strong>' + (victory ? 'What you carry forward' : 'What remains') + '</strong></div>' +
              '<div class="v152-results-metrics">' +
                '<div><span>EXPERIENCE</span><strong>' + (victory ? '+' + xpGained : '+0') + '</strong><small>XP earned</small></div>' +
                '<div><span>ROAD STAGE</span><strong>' + (victory ? Math.max(1, Number(routeStage || 1)) + ' / 5' : 'Reset') + '</strong><small>' + (victory ? 'Outing progress' : 'The trail must be retaken') + '</small></div>' +
                '<div><span>COIN</span><strong>+' + gold + 'g</strong><small>' + (gold ? 'Taken during combat' : 'No coin recovered') + '</small></div>' +
              '</div>' +
              rewardMarkup + goldMarkup + levelMarkup +
            '</section>' +
            '<footer class="v152-results-actions">' + continueButton + secondaryButton + '</footer>' +
          '</section>' +
        '</main>'
      );

      const continueFn = typeof continueAction === 'function' ? continueAction : onContinue;
      const returnFn = typeof returnAction === 'function' ? returnAction : onReturnToTown;
      document.getElementById('v152CombatContinue')?.addEventListener('click', () => continueFn?.());
      document.getElementById('v152CombatReturn')?.addEventListener('click', () => returnFn?.());
      return true;
    }

    return Object.freeze({ render });
  }

  window.LegendRoadCombatResultsViewV152 = Object.freeze({ create });
})();
