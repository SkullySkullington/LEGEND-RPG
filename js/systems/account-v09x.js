// LEGEND: Roads of Ashmere v0.9.x - Account / Profile Screen
(() => {
  const PROFILE_KEY = 'legend-roads-of-ashmere-profile-v09x';
  const root = () => document.getElementById('root');
  const S = () => window.LegendStorage || {};
  const esc = s => String(s == null ? '' : s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const local = () => S().loadPlayer?.() || null;

  function getProfile(){
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); }
    catch { return null; }
  }

  function saveProfile(profile){
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      ...profile,
      version: 'v0.9.x',
      updatedAt: new Date().toISOString()
    }));
  }

  function deleteProfile(){ localStorage.removeItem(PROFILE_KEY); }

  function snapshotTraveler(pl){
    if(!pl) return null;
    return {
      username: pl.username || 'Unnamed Traveler',
      className: pl.className || pl.class || 'Traveler',
      town: pl.town || 'Ashmere',
      day: pl.day || 1,
      roadTokens: Number(pl.inventory?.roadToken || 0),
      oldRoadClears: Number(pl.stats?.oldRoadClears || 0),
      monstersDefeated: Number(pl.stats?.monstersDefeated || 0),
      updatedAt: new Date().toISOString()
    };
  }

  const cloudService=window.LegendAccountCloudV09x?.create({
    getClient:client,
    isConnected:connected,
    getHealth:health,
    loadLocalPlayer:local,
    saveLocalPlayer:player=>S().savePlayer?.(player)
  });
  const cloudReady=cloudService?.cloudReady||(()=>false);
  const cloudList=cloudService?.cloudList||(async()=>({ok:false,rows:[]}));
  const cloudSave=cloudService?.cloudSave||(async()=>({ok:false,message:'Cloud traveler storage is unavailable.'}));
  const cloudLoad=cloudService?.cloudLoad||(async()=>({ok:false,message:'Cloud traveler storage is unavailable.'}));
  const cloudDelete=cloudService?.cloudDelete||(async()=>({ok:false,message:'Cloud traveler storage is unavailable.'}));
  const fmtDate=cloudService?.fmtDate||(()=> 'Not synced yet');

  function client(){ return window.LegendSupabaseV09x?.client || null; }
  function connected(){ return !!client(); }
  function health(){ return window.LegendSupabaseV09x?.health || null; }
  const authService=window.LegendAccountAuthV09x?.create({
    getClient:client,
    isConnected:connected,
    getHealth:health,
    escapeHtml:esc,
    getProfile,
    saveProfile,
    getLocalPlayer:local
  });
  const getSession=authService?.getSession||(async()=>null);
  const refreshHealth=authService?.refreshHealth||(async()=>health());
  const signOut=authService?.signOut||(async()=>({ok:false,message:'Account sign out is unavailable.'}));
  const sessionEmail=authService?.sessionEmail||(session=>session?.user?.email||'');
  const authBox=authService?.authBox||(()=>'<section class="account09x-panel account09x-auth-box"><p>Account access is unavailable. Refresh before retrying.</p></section>');
  async function renderAccount(message = ''){
    await refreshHealth();
    const session = await getSession();
    const pl = local();
    const prof = getProfile();
    const snap = prof?.activeTraveler || snapshotTraveler(pl);
    const cloudCanUse = cloudReady(session);
    const cloudResult = await cloudList(session);
    const cloudRows = cloudResult.rows || [];
    const signedIn = !!session?.user;
    const name = prof?.displayName || pl?.username || session?.user?.user_metadata?.display_name || 'Ashmere Traveler';

    root().innerHTML = `
      <main class="account09x account09x-clean">
        <div class="account09x-wrap">
          <header class="account09x-header">
            <div>
              <div class="account09x-kicker">LEGEND Account</div>
              <h1>Profile</h1>
            </div>
            <div class="account09x-header-actions">
              <button class="account09x-btn" id="backTitle" type="button">Back to Realm</button>
              ${signedIn ? '<button class="account09x-btn danger" id="signOutBtn" type="button">Sign Out</button>' : ''}
            </div>
          </header>
          ${message ? `<p class="account09x-success">${esc(message)}</p>` : ''}

          ${signedIn ? `
            <section class="account09x-panel account09x-profile-card">
              <div class="account09x-avatar">${esc(String(name).slice(0,1)).toUpperCase()}</div>
              <div class="account09x-profile-main">
                <div class="account09x-kicker">Traveler Profile</div>
                <h2>${esc(name)}</h2>
                <p>${esc(sessionEmail(session))}</p>
              </div>
              <form class="account09x-profile-form" id="profileForm">
                <label for="displayName">Traveler Name</label>
                <div class="account09x-profile-edit"><input id="displayName" maxlength="28" value="${esc(name)}" autocomplete="nickname"><button class="account09x-btn primary" type="submit">Save Name</button></div>
              </form>
            </section>
          ` : authBox(session, prof)}

          <section class="account09x-panel">
            <div class="account09x-section-head">
              <div><div class="account09x-kicker">Your Journey</div><h2>Traveler</h2></div>
              ${pl ? '<button class="account09x-btn primary" id="continueTraveler" type="button">Continue Journey</button>' : '<button class="account09x-btn primary" id="newTraveler" type="button">New Traveler</button>'}
            </div>
            <div class="account09x-traveler-summary ${pl ? '' : 'empty'}">
              <div class="account09x-avatar small">${pl ? esc(String(pl.username || '?').slice(0,1)).toUpperCase() : '?'}</div>
              <div>
                <h3>${pl ? esc(pl.username || 'Unnamed Traveler') : 'No traveler yet'}</h3>
                <p>${pl ? `${esc(pl.className || pl.class || 'Traveler')} • ${esc(pl.town || 'Ashmere')} • Day ${pl.day || 1} • ${Number(pl.inventory?.roadToken || 0)} Road Tokens` : 'Create a traveler to begin your journey through Ashmere.'}</p>
              </div>
            </div>
          </section>

          <section class="account09x-panel">
            <div class="account09x-section-head"><div><div class="account09x-kicker">Cloud Save</div><h2>Traveler Slots</h2></div><span class="account09x-cloud-state">${signedIn && cloudCanUse ? 'Cloud Online' : signedIn ? 'Connecting…' : 'Sign in to use cloud saves'}</span></div>
            <div class="account09x-cloud-grid">
              ${[1,2].map(slot => {
                const row = cloudRows.find(item => Number(item.slot) === slot);
                return `<article class="account09x-cloud-slot"><div><strong>Cloud Slot ${slot}</strong><small id="cloudSlot${slot}Info">${row ? esc(row.display_name || 'Traveler') + ' • ' + fmtDate(row.updated_at) : 'Empty'}</small></div><div class="account09x-actions"><button class="account09x-btn" type="button" data-cloud-load="${slot}" ${cloudCanUse && row ? '' : 'disabled'}>Load</button><button class="account09x-btn primary" type="button" data-cloud-save="${slot}" ${cloudCanUse && pl ? '' : 'disabled'}>Save Here</button><button class="account09x-btn danger" type="button" data-cloud-delete="${slot}" ${cloudCanUse && row ? '' : 'disabled'}>Clear</button></div></article>`;
              }).join('')}
            </div>
          </section>
        </div>
      </main>`;

    const back = document.getElementById('backTitle');
    if(back) back.onclick = () => window.LegendGameBootstrap?.title?.();
    const continueTraveler = document.getElementById('continueTraveler');
    if(continueTraveler) continueTraveler.onclick = () => window.LegendGameBootstrap?.continueGame?.();
    const newTraveler = document.getElementById('newTraveler');
    if(newTraveler) newTraveler.onclick = () => window.LegendGameBootstrap?.newTraveler?.();

    const form = document.getElementById('profileForm');
    if(form) form.onsubmit = e => {
      e.preventDefault();
      const displayName = document.getElementById('displayName').value.trim() || pl?.username || 'Ashmere Traveler';
      saveProfile({ ...(prof || {}), displayName, email:sessionEmail(session), authUserId:session?.user?.id || null, activeTraveler:prof?.activeTraveler || snapshotTraveler(pl) });
      renderAccount('Profile saved.');
    };

    const signOutBtn = document.getElementById('signOutBtn');
    if(signOutBtn) signOutBtn.onclick = async () => {
      signOutBtn.disabled = true;
      signOutBtn.textContent = 'Signing Out...';
      const result = await signOut();
      renderAccount(result.message);
    };

    document.querySelectorAll('[data-cloud-load]').forEach(btn => btn.onclick = async () => {
      const result = await cloudLoad(session, Number(btn.dataset.cloudLoad));
      if(result.ok) window.LegendGameBootstrap?.continueGame?.();
      else renderAccount(result.message);
    });
    document.querySelectorAll('[data-cloud-save]').forEach(btn => btn.onclick = async () => {
      const result = await cloudSave(session, Number(btn.dataset.cloudSave));
      renderAccount(result.message);
    });
    document.querySelectorAll('[data-cloud-delete]').forEach(btn => btn.onclick = async () => {
      const slot = Number(btn.dataset.cloudDelete);
      if(confirm('Clear Cloud Slot ' + slot + '? This does not delete your local traveler.')){
        const result = await cloudDelete(session, slot);
        renderAccount(result.message);
      }
    });

    authService?.bindAuthForm({onComplete:message=>renderAccount(message)});
  }

  window.LegendAccountV09x = { renderAccount, getProfile, saveProfile, deleteProfile, getSession, cloudSave, cloudLoad, cloudList, cloudDelete };
})();