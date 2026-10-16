window.LegendStorage = (() => {
  const D = window.LEGEND_DATA;
  const settingsStorage = window.LegendSettingsStorageV120?.create();
  const defaultSettings = Object.freeze({ largeText:false, boldText:false, highContrast:false, reducedMotion:false, simpleAscii:false, spacious:false, readableFont:false });

  function baseSkills(){
    return {
      Woodcutting:{level:1,xp:0,xpLeft:80,gain:34,check:'survival'},
      Cooking:{level:1,xp:0,xpLeft:80,gain:36,check:'craft'},
      Fishing:{level:1,xp:0,xpLeft:80,gain:30,check:'survival'},
      Mining:{level:1,xp:0,xpLeft:80,gain:32,check:'strength'},
      Smithing:{level:1,xp:0,xpLeft:80,gain:35,check:'craft'},
      Thieving:{level:1,xp:0,xpLeft:80,gain:36,check:'thieving'}
    };
  }

  function normalize(p){
    if(!p) return null;
    p.version = D.VERSION;
    p.origin = p.origin || 'Lost Squire';
    p.keepsake = p.keepsake || 'Rusty Charm';
    p.gender = p.gender || 'unspoken';
    p.genderLabel = p.genderLabel || 'Unspoken';
    p.pronouns = p.pronouns || 'they/them';
    p.personality = p.personality || 'kind';
    p.personalityLabel = p.personalityLabel || 'Kind-Hearted';
    p.creationV094 = p.creationV094 || { bonuses:{} };
    p.creationV094.bonuses = p.creationV094.bonuses || {};
    p.creationV090 = p.creationV090 || {};
    p.creationV090.bonuses = {...(p.creationV090.bonuses || {}), ...(p.creationV094.bonuses || {})};
    p.inventory = p.inventory || {};
    Object.keys(D.itemNames).forEach(k => p.inventory[k] ??= 0);
    p.ownedWeapons = p.ownedWeapons || { hand:1 };
    p.ownedArmor = p.ownedArmor || { none:1 };
    p.stats = p.stats || {};
    Object.assign(p.stats, {
      monstersDefeated:p.stats.monstersDefeated || 0,
      timesDied:p.stats.timesDied || 0,
      checksPassed:p.stats.checksPassed || 0,
      checksFailed:p.stats.checksFailed || 0,
      oldRoadClears:p.stats.oldRoadClears || 0,
      oldRoadSuccesses:p.stats.oldRoadSuccesses || 0,
      roadEvents:p.stats.roadEvents || 0,
      resourcesFound:p.stats.resourcesFound || 0,
      townErrands:p.stats.townErrands || 0,
      campsMade:p.stats.campsMade || 0,
      routesDiscovered:p.stats.routesDiscovered || 0
    });
    p.flags = p.flags || {};
    // Retired v087 road state and XP countdown are not part of the active v100 progression model.
    delete p.flags.roadV087;
    delete p.xpUntil;
    Object.assign(p.flags, {
      bellQuestStarted:!!p.flags.bellQuestStarted,
      bellRoadSearched:!!p.flags.bellRoadSearched,
      bellQuestComplete:!!p.flags.bellQuestComplete,
      firstRoadReturnSeen:!!p.flags.firstRoadReturnSeen,
      firstRoadReturnRoute:p.flags.firstRoadReturnRoute||'',
      firstRoadReturnDiscovery:p.flags.firstRoadReturnDiscovery||'',
      firstRoadReturnMaraBriefed:!!p.flags.firstRoadReturnMaraBriefed,
      greyfenBoundaryCompared:!!p.flags.greyfenBoundaryCompared,
      greyfenArchiveRead:!!p.flags.greyfenArchiveRead,
      greyfenFieldNoteFound:!!p.flags.greyfenFieldNoteFound,
      greyfenFieldNoteReported:!!p.flags.greyfenFieldNoteReported,
      greyfenLedgerCompared:!!p.flags.greyfenLedgerCompared,
      greyfenWeeklyReturnFound:!!p.flags.greyfenWeeklyReturnFound,
      greyfenWeeklyReturnReported:!!p.flags.greyfenWeeklyReturnReported,
      greyfenEvidenceFiled:!!p.flags.greyfenEvidenceFiled,
      firstRoadComplete:!!p.flags.firstRoadComplete,
      talkedToMara:!!p.flags.talkedToMara,
      talkedToSella:!!p.flags.talkedToSella,
      sellaErrandStarted:!!p.flags.sellaErrandStarted,
      sellaErrandComplete:!!p.flags.sellaErrandComplete,
      firstRoadEvent:!!p.flags.firstRoadEvent,
      firstToken:!!p.flags.firstToken,
      firstResource:!!p.flags.firstResource,
      hiddenTurnoffFound:!!p.flags.hiddenTurnoffFound,
      introV094Complete:!!p.flags.introV094Complete
    });
    p.flags.tutorialStep = p.flags.tutorialStep || (p.flags.talkedToMara ? 'prepare' : 'people');
    p.skills = p.skills || baseSkills();
    p.mastery = p.mastery || {};
    Object.keys(p.skills).forEach(k => p.mastery[k] ??= 0);
    p.memories = p.memories || ['You woke beneath a dead lantern outside Ashmere.'];
    p.questLog = p.questLog || ['The Bell That Rang Once: Speak to Mara in People of Ashmere.','The First Road: Explore Old Road and return with 5 Road Tokens to open the first new region.'];
    p.quests = p.quests || {
      bellThatRangOnce:{status:'active',step:1,title:'The Bell That Rang Once'},
      firstRoad:{status:'active',step:1,title:'The First Road'},
      sellaRoadMeal:{status:'hidden',step:0,title:'A Meal Before The Road'}
    };
    p.traits = p.traits || [];
    p.momentum = p.momentum || 0;
    p.bank = p.bank || [0,0,0,0,0];
    p.day = p.day || 1;
    p.timeOfDay = p.timeOfDay || 'Morning';
    p.fatigue = p.fatigue || 0;
    p.roadDanger = p.roadDanger || 1;
    p.townTrust = p.townTrust || {};
    p.townTrust.Ashmere ??= 0;
    p.npcTalk = p.npcTalk || {};
    ['mara','brenn','oric','sella'].forEach(k => p.npcTalk[k] ??= 0);
    p.discoveredRoutes = p.discoveredRoutes || ['Old Road'];
    p.discoveredTowns = p.discoveredTowns || ['Ashmere'];
    p.unlockedRegions = p.unlockedRegions || ['Ashmere'];
    p.currentRegion = p.currentRegion || 'Ashmere';
    p.regionTravelCount = p.regionTravelCount || 0;
    p.discoveredRegions = Array.isArray(p.discoveredRegions) && p.discoveredRegions.length ? p.discoveredRegions : ['Ashmere'];
    if(!p.currentRegion || !p.discoveredRegions.includes(p.currentRegion)) p.currentRegion = 'Ashmere';
    return p;
  }

  function savePlayer(player){ if(player) localStorage.setItem(D.SAVE_KEY, JSON.stringify(player)); }
  function loadPlayer(){
    const raw = localStorage.getItem(D.SAVE_KEY);
    if(!raw) return null;
    try { return normalize(JSON.parse(raw)); } catch { return null; }
  }
  function deleteSaves(){ localStorage.removeItem(D.SAVE_KEY); }

  function loadSettings(){
    return settingsStorage?.loadSettings?.() || { ...defaultSettings };
  }
  function saveSettings(settings){
    if (settingsStorage?.saveSettings) return settingsStorage.saveSettings(settings);
    return false;
  }
  function applySettings(settings){
    if (settingsStorage?.applySettings) return settingsStorage.applySettings(settings);
  }

  return { baseSkills, normalize, savePlayer, loadPlayer, deleteSaves, loadSettings, saveSettings, applySettings };
})();