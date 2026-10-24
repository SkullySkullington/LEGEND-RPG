/* LEGEND v0.21.1 - active title menu view with the HTML/CSS wordmark.
 * Owns the main title screen markup and CSS/accessibility hooks.
 * Title state and all menu actions are passed in; audio and navigation stay outside.
 */
(() => {
  const esc = window.LegendHtmlV120.escapeHtml;

  function render(config = {}) {
    const {
      root,
      player,
      name,
      cls,
      town,
      day,
      tokens,
      buildVersion,
      backgroundImage,
      logoImage
    } = config;
    if (!root || typeof root !== 'object') return false;
    const locations = window.LegendAssetsV090?.locations || {};
    const realmLabel = town === 'Greyfen' ? 'GREYFEN LOWLANDS' : 'ASHMERE VALE';
    const realmTitle = town === 'Greyfen' ? 'Greyfen Lowlands' : 'Ashmere Vale';
    const realmDescription = town === 'Greyfen'
      ? 'Raised paths, drowned records, and the marsh’s quiet dangers.'
      : 'Lanterns still burn here. Beyond the last gate, the Old Road does not forgive the unprepared.';
    const realmImage = town === 'Greyfen'
      ? (locations.greyfenMain || locations.ashmereMain || 'assets/generated/locations/greyfen-town.webp')
      : (locations.ashmereMain || 'assets/generated/locations/ashmere-town.webp');
    const greyfenKnown = Array.isArray(player?.discoveredRegions) && player.discoveredRegions.includes('Greyfen');
    const greyfenStatus = greyfenKnown ? 'REGION DISCOVERED' : 'BEYOND THE FIRST CROSSING';

    root.innerHTML = `
      <div class="title-wrap title-v100 portal-shell portal-v100 v120-title title-v136-rpg title-v140-world">
        <img class="v120-title-backdrop" src="${esc(backgroundImage || 'assets/title/title_bg_ashmere_road_v089.jpg')}" alt="" aria-hidden="true" loading="eager" fetchpriority="high" decoding="async" onerror="if(this.dataset.fallbackApplied){this.style.display='none'}else{this.dataset.fallbackApplied='1';this.src='assets/title/title_bg_ashmere_road_v089.jpg'}">
        <div class="title-atmosphere" aria-hidden="true"><div class="title-embers"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="title-fog"><i></i><i></i><i></i></div></div>
        <header class="portal100-header">
          <div class="portal100-brand">
            <div><span>LEGEND · THE AWAKENING</span></div>
          </div>
          <span class="v136-corner-sigil v150-corner-sigil" aria-hidden="true"></span>
        </header>
        <main class="v120-title-main">
          <section class="v120-title-hero" aria-labelledby="legendTitleAccessibleName">
            <h1 class="v120-title-accessible-name" id="legendTitleAccessibleName">LEGEND: The Awakening</h1>
            <div class="portal100-kicker">A DARK FANTASY RPG</div>
            <div class="v150-logo-lockup" role="img" aria-label="LEGEND: The Awakening"><img class="v120-legend-logo v150-legend-logo" src="${esc(logoImage || 'assets/ui/logos/logo_legend_awakening_wordmark.png?v=0.21.0-local-raster-wordmark')}" alt="" aria-hidden="true" decoding="async" fetchpriority="high" loading="eager" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="v150-wordmark-fallback" hidden><strong>LEGEND</strong><em>THE AWAKENING</em></span></div>
            <p>Monsters press against the borders. Old magic stirs beneath a wounded realm.</p>
            <div class="v120-divider"><span></span><b>THE BORDERLANDS ARE WAKING</b><span></span></div>
            <div class="v120-traveler-line">
              <span class="v120-avatar" aria-hidden="true">${player ? esc(String(name).slice(0,1)).toUpperCase() : '✦'}</span>
              <div><small>${player ? 'CURRENT TRAVELER' : 'YOUR STORY BEGINS HERE'}</small><strong>${player ? esc(name) : 'No journey has begun'}</strong><span>${player ? `${esc(cls)} · Day ${day} · ${tokens} Road Tokens` : 'Create a traveler and discover what the road remembers.'}</span></div>
            </div>
            <nav class="v120-title-actions v136-rpg-menu" aria-label="Main menu">
              <div class="v136-menu-heading"><span>CHOOSE YOUR PATH</span><i aria-hidden="true"></i></div>
              <div class="v136-menu-list">
                ${player ? `<button class="v136-menu-btn v136-menu-primary" id="continue" data-legend-scene-transition="Returning to your journey" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.8 14.5 9.5 21.2 12 14.5 14.5 12 21.2 9.5 14.5 2.8 12 9.5 9.5Z"/></svg></span><span class="v136-menu-copy"><strong>Continue Journey</strong><small>Return to ${esc(town)}</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>` : '<button class="v136-menu-btn v136-menu-primary" id="newPrimary" data-legend-scene-transition="Shaping a traveler" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.8 14.5 9.5 21.2 12 14.5 14.5 12 21.2 9.5 14.5 2.8 12 9.5 9.5Z"/></svg></span><span class="v136-menu-copy"><strong>Begin Your Journey</strong><small>Create your traveler</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>'}
                ${player ? '<button class="v136-menu-btn" id="new" data-legend-scene-transition="Shaping a new traveler" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10" cy="7.5" r="3"/><path d="M4 19c.5-3.1 2.5-4.8 6-4.8 1.7 0 3 .4 4 1.2M18 14v7M14.5 17.5h7"/></svg></span><span class="v136-menu-copy"><strong>New Traveler</strong><small>Begin a different journey</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>' : ''}
                <button class="v136-menu-btn" id="account" data-legend-scene-transition="Opening traveler profile" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c.7-3.6 3-5.3 7-5.3s6.3 1.7 7 5.3"/></svg></span><span class="v136-menu-copy"><strong>Profile</strong><small>Traveler identity and registry</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
                <button class="v136-menu-btn" id="settings" data-legend-scene-transition="Opening settings" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"/></svg></span><span class="v136-menu-copy"><strong>Settings</strong><small>Readability and game comfort</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
                <button class="v136-menu-btn" id="dispatches" data-legend-scene-transition="Opening the roadmap" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4.5h11.5A2.5 2.5 0 0 1 18 7v13H7a3 3 0 0 1-3-3Z"/><path d="M7 8h7M7 11.5h7M7 15h5M18 8h2v12h-2"/></svg></span><span class="v136-menu-copy"><strong>News &amp; Roadmap</strong><small>Latest updates and what comes next</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
                <button class="v136-menu-btn v136-menu-credits" id="credits" data-legend-scene-transition="Opening the credits" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3.5h10.5A1.5 1.5 0 0 1 18 5v15.5H7.5A1.5 1.5 0 0 1 6 19Z"/><path d="M6 6H4.8A1.8 1.8 0 0 0 3 7.8v11.4A1.8 1.8 0 0 0 4.8 21H18M9 8h5M9 11.5h5"/></svg></span><span class="v136-menu-copy"><strong>Credits</strong><small>The people and craft behind LEGEND</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
              </div>
            </nav>
          </section>
          <aside class="v140-world-console" aria-label="Realm overview">
            <div class="v140-console-head"><span>KNOWN REALM // FIELD OVERVIEW</span><span class="v140-realm-status"><i aria-hidden="true"></i> REALM INITIALIZED</span></div>
            <section class="v140-realm-feature" aria-label="Current region: ${esc(realmTitle)}">
              <img src="${esc(realmImage)}" alt="" aria-hidden="true" loading="eager" decoding="async" onerror="this.style.display='none'">
              <div class="v140-realm-feature-copy">
                <span class="v140-realm-overline">${esc(town === 'Greyfen' ? 'CURRENT REGION' : 'STARTING REGION')} // ${esc(realmLabel)}</span>
                <h2>${esc(realmTitle)}</h2>
                <p>${esc(realmDescription)}</p>
              </div>
            </section>
            <div class="v140-realm-routes" aria-label="Known routes">
              <article class="v140-realm-node">
                <img src="${esc(locations.oldRoad || 'assets/generated/locations/old-road-south-fork.webp')}" alt="" aria-hidden="true" loading="eager" decoding="async" onerror="this.style.display='none'">
                <div class="v140-realm-node-copy"><small>FRONTIER // 01</small><strong>The Old Road</strong><span>Expeditions, clues, and ambushes</span></div>
              </article>
              <article class="v140-realm-node">
                <img src="${esc(locations.greyfenMarshWalkway || 'assets/generated/locations/greyfen-marsh-walkway.webp')}" alt="" aria-hidden="true" loading="eager" decoding="async" onerror="this.style.display='none'">
                <div class="v140-realm-node-copy"><small>FURTHER EAST // 02</small><strong>Greyfen</strong><span>${esc(greyfenStatus)}</span></div>
              </article>
            </div>
            <div class="v140-first-delve">
              <span class="v140-delve-sigil" aria-hidden="true">✦</span>
              <div><small>FIRST DELVE // BENEATH ASHMERE</small><strong>The Bell Cellar</strong><span>Four chamber beats · equipment and level matter</span></div>
              <em>UNDERGROUND</em>
            </div>
            <div class="v140-console-foot"><span>THE BORDERLANDS // REALM OVERVIEW</span><span>${esc(buildVersion)} · LOCAL WORLD</span></div>
          </aside>
        </main>
        <footer class="portal100-footer portal-footer v120-title-footer"><span>LEGEND: THE AWAKENING</span><span>${esc(buildVersion)} · ASHMERE · OLD ROAD · GREYFEN</span></footer>
      </div>`;
    return true;
  }

  window.LegendTitleScreenViewV120 = Object.freeze({ render });
})();
