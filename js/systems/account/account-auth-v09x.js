/* LEGEND v0.20.36 - Account authentication service and view bindings.
 * Owns sign-up/sign-in/session checks and the auth-panel markup/form behavior.
 * Profile display and cloud-slot orchestration remain in account-v09x.js.
 */
(() => {
  function create(context = {}) {
    const {getClient,isConnected,getHealth,escapeHtml,getProfile,saveProfile,getLocalPlayer}=context;
    if(typeof getClient!=='function'||typeof isConnected!=='function'||typeof getHealth!=='function'||
      typeof escapeHtml!=='function'||typeof getProfile!=='function'||typeof saveProfile!=='function'||
      typeof getLocalPlayer!=='function')return null;
    const client=getClient,connected=isConnected,health=getHealth,esc=escapeHtml;
    const local=getLocalPlayer;
  function supabaseReadyText(){
    if(!window.supabase) return 'CDN library missing';
    if(!window.LegendSupabaseV09x) return 'Config not loaded';
    if(!connected()) return 'Client unavailable';
    const h = health();
    if(h?.ok === true) return 'Online';
    if(h?.ok === false) return h.message || 'Service unavailable';
    return 'Checking service';
  }

  function authRedirectUrl(){
    const fallback = 'https://tdtria.github.io/LEGEND-RPG/';
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      url.search = '';
      if(!url.pathname.endsWith('/')){
        const parts = url.pathname.split('/');
        parts.pop();
        url.pathname = parts.join('/') + '/';
      }
      return url.toString();
    } catch {
      return fallback;
    }
  }

  async function getSession(){
    const c = client();
    if(!c?.auth?.getSession) return null;
    try {
      const result = await c.auth.getSession();
      return result?.data?.session || null;
    } catch(err){
      console.warn('LEGEND account session check failed:', err);
      return null;
    }
  }

  async function refreshHealth(){
    const check = window.LegendSupabaseV09x?.checkHealth;
    if(typeof check !== 'function') return health();
    try { return await check(); }
    catch(err){
      console.warn('LEGEND Supabase health check failed:', err);
      return health();
    }
  }

  async function createAccount(email, password, displayName){
    const c = client();
    if(!c?.auth?.signUp) return { ok:false, message:`Supabase is not ready yet (${supabaseReadyText()}).` };
    if(!email || !password) return { ok:false, message:'Enter an email and password.' };
    if(password.length < 6) return { ok:false, message:'Password must be at least 6 characters.' };
    try {
      console.info('LEGEND auth: creating account for', email, 'redirect:', authRedirectUrl());
      const result = await c.auth.signUp({
        email,
        password,
        options:{
          emailRedirectTo: authRedirectUrl(),
          data:{ display_name:displayName || 'Ashmere Traveler' }
        }
      });
      if(result.error) throw result.error;
      return { ok:true, session:result.data?.session || null, user:result.data?.user || null, message: result.data?.session ? 'Account created and signed in.' : 'Account created. Check your email if confirmation is required.' };
    } catch(err){
      console.warn('LEGEND auth create account failed:', err);
      return { ok:false, message:`Create account failed: ${err.message || 'Unknown Supabase error.'}` };
    }
  }

  async function signIn(email, password){
    const c = client();
    if(!c?.auth?.signInWithPassword) return { ok:false, message:`Supabase is not ready yet (${supabaseReadyText()}).` };
    if(!email || !password) return { ok:false, message:'Enter an email and password.' };
    try {
      console.info('LEGEND auth: signing in', email);
      const result = await c.auth.signInWithPassword({ email, password });
      if(result.error) throw result.error;
      return { ok:true, session:result.data?.session || null, user:result.data?.user || null, message:'Signed in.' };
    } catch(err){
      console.warn('LEGEND auth sign in failed:', err);
      return { ok:false, message:`Sign in failed: ${err.message || 'Unknown Supabase error.'}` };
    }
  }

  async function signOut(){
    const c = client();
    if(!c?.auth?.signOut) return { ok:false, message:`Supabase is not ready yet (${supabaseReadyText()}).` };
    try {
      const result = await c.auth.signOut();
      if(result.error) throw result.error;
      const current = getProfile();
      if(current) saveProfile({ ...current, authUserId:null });
      return { ok:true, message:'Signed out. Local traveler save kept.' };
    } catch(err){
      return { ok:false, message:`Could not sign out: ${err.message || 'Unknown Supabase error.'}` };
    }
  }

  function sessionEmail(session){ return session?.user?.email || ''; }

  function authBox(session, prof){
    const debug = `<p class="account09x-note account09x-debug"><strong>Connection:</strong> ${esc(supabaseReadyText())}</p>`;
    if(!connected()) return `<section class="account09x-panel account09x-auth-box"><div class="account09x-auth-head"><div class="account09x-kicker">Ashmere Account</div><h2>Sign In</h2><p>Sign in to access your account and cloud traveler saves.</p></div>${debug}<p class="account09x-note"><strong>Offline:</strong> Supabase did not load. Local profile and traveler saves still work.</p></section>`;
    if(session?.user) return `<section class="account09x-panel account09x-auth-box"><div class="account09x-auth-head"><div class="account09x-kicker">Ashmere Account</div><h2>Signed In</h2><p class="account09x-session-email">${esc(sessionEmail(session))}</p></div>${debug}<div class="account09x-actions"><button class="account09x-btn danger" id="signOutBtn" type="button">Sign Out</button></div></section>`;
    return `<section class="account09x-panel account09x-auth-box">
      <div class="account09x-auth-head"><div class="account09x-kicker">Ashmere Account</div><h2 id="authTitle">Sign In</h2><p id="authIntro">Sign in to continue your journey.</p></div>
      <div class="account09x-auth-tabs" role="tablist" aria-label="Account access">
        <button class="account09x-auth-tab active" id="authSignInTab" type="button">Sign In</button>
        <button class="account09x-auth-tab" id="authSignUpTab" type="button">Sign Up</button>
      </div>
      <form class="account09x-form account09x-auth-form" id="authForm">
        <div class="account09x-field"><label for="authEmail">Email</label><input id="authEmail" type="email" maxlength="72" value="${esc(prof?.email || '')}" placeholder="you@example.com" autocomplete="email" required></div>
        <div class="account09x-field account09x-signup-only" hidden><label for="authDisplayName">Traveler Name</label><input id="authDisplayName" type="text" maxlength="28" placeholder="Ashmere Traveler" autocomplete="nickname"></div>
        <div class="account09x-field"><label for="authPassword">Password</label><input id="authPassword" type="password" minlength="6" placeholder="Minimum 6 characters" autocomplete="current-password" required></div>
        <button class="account09x-btn primary account09x-auth-submit" id="authSubmitBtn" type="submit">Sign In</button>
        <p class="account09x-auth-switch" id="authSwitchText">New to Ashmere? <button id="authSwitchBtn" type="button">Create an account</button></p>
      </form>
      ${debug}
    </section>`;
  }



    function bindAuthForm({onComplete} = {}) {
    const authForm = document.getElementById('authForm');
    let authMode = 'signin';
    const setAuthMode = mode => {
      authMode = mode === 'signup' ? 'signup' : 'signin';
      const signup = authMode === 'signup';
      const title = document.getElementById('authTitle');
      const intro = document.getElementById('authIntro');
      const submit = document.getElementById('authSubmitBtn');
      const switchText = document.getElementById('authSwitchText');
      const display = document.querySelector('.account09x-signup-only');
      const signInTab = document.getElementById('authSignInTab');
      const signUpTab = document.getElementById('authSignUpTab');
      if(title) title.textContent = signup ? 'Create Account' : 'Sign In';
      if(intro) intro.textContent = signup ? 'Create your Ashmere account.' : 'Sign in to continue your journey.';
      if(submit) submit.textContent = signup ? 'Create Account' : 'Sign In';
      if(switchText) switchText.innerHTML = signup ? 'Already have an account? <button id="authSwitchBtn" type="button">Sign in</button>' : 'New to Ashmere? <button id="authSwitchBtn" type="button">Create an account</button>';
      if(display) display.hidden = !signup;
      if(signInTab) signInTab.classList.toggle('active', !signup);
      if(signUpTab) signUpTab.classList.toggle('active', signup);
      const switchBtn = document.getElementById('authSwitchBtn');
      if(switchBtn) switchBtn.onclick = () => setAuthMode(signup ? 'signin' : 'signup');
    };
    const signInTab = document.getElementById('authSignInTab');
    const signUpTab = document.getElementById('authSignUpTab');
    if(signInTab) signInTab.onclick = () => setAuthMode('signin');
    if(signUpTab) signUpTab.onclick = () => setAuthMode('signup');
    setAuthMode('signin');
    if(authForm) authForm.onsubmit = async e => {
      e.preventDefault();
      const submit = document.getElementById('authSubmitBtn');
      if(submit){ submit.disabled = true; submit.textContent = authMode === 'signup' ? 'Creating...' : 'Signing In...'; }
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      let result;
      if(authMode === 'signup'){
        const displayName = document.getElementById('authDisplayName').value.trim() || pl?.username || 'Ashmere Traveler';
        result = await createAccount(email, password, displayName);
        if(result.ok) saveProfile({ ...(getProfile() || {}), displayName, email, authUserId: result.user?.id || result.session?.user?.id || null });
      } else {
        result = await signIn(email, password);
        if(result.ok) saveProfile({ ...(getProfile() || {}), email, authUserId: result.user?.id || result.session?.user?.id || null });
      }
      onComplete?.(result.message);
    };
    }
    return Object.freeze({getSession,refreshHealth,signOut,sessionEmail,authBox,bindAuthForm});
  }
  window.LegendAccountAuthV09x=Object.freeze({create});
})();
