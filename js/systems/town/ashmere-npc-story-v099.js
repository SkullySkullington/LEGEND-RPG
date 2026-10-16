/* LEGEND Ashmere/Greyfen NPC story progression.
 * Owns conditional dialogue variants and NPC-triggered quest state/memory updates.
 * It does not render screens or persist the player; those adapters remain in the
 * NPC dialogue facade so story rules can be changed without touching DOM wiring.
 */
(() => {
  function apply(player, id, greyfen, dialogue, setBellQuestObjective) {
    if (!player || !dialogue || typeof setBellQuestObjective !== 'function') return false;
    const pl = player;
    const n = dialogue;
    const greyfenEvidenceStory = window.LegendAshmereGreyfenEvidenceStoryV099;
    if (typeof greyfenEvidenceStory?.apply === 'function') {
      greyfenEvidenceStory.apply(pl, id, greyfen, n, setBellQuestObjective);
    } else if (greyfen) {
      n.lines = ['The Greyfen evidence service did not load. Refresh before continuing.'];
    }
    if(!greyfen&&pl.flags?.firstRoadReturnSeen){
      const route=pl.flags.firstRoadReturnRoute||'unknown';
      const discovery=pl.flags.firstRoadReturnDiscovery||'none';
      if(id==='mara'){
        if(pl.flags.greyfenArchiveRead){
          n.lines=[
            'The Greyfen archive now preserves both surfaces, but we still do not know when the newer cut was made.',
            'The matching mark shows that the Blackroot seal and the boundary stone belong in the same record. It does not identify the hand that changed either stone.',
            'We need a dated field note or another physical trace before we can say when the route was altered.'
          ];
        }else if(pl.flags.greyfenBoundaryCompared){
          n.lines=[
            'You found the same older bell-mark at the Greyfen Approach beneath a newer cut. That is stronger evidence than either stone alone.',
            'Do not move the boundary stone. Bring the comparison to my desk in Greyfen so I can preserve both surfaces in the archive.',
            'The marker shows an alteration, but not who made it or why.'
          ];
        }else if(pl.flags.bellRoadSearched){
          n.lines=[
            'The Blackroot seal bears the same bell-mark you saw near Ashmere. A repeated symbol is evidence of a pattern, not a complete explanation.',
            'I will keep the seal and your first route report together. The record must preserve what we saw, not what we wish it meant.',
            'When Greyfen’s Boundary Archive is available, compare its old marks against this one.'
          ];
        }else if(route==='ridge'&&discovery==='ridge-cairn'){
          n.lines=[
            'The Ridgeway Cairn marks a dry line above the low ground. That tells us how travelers were meant to pass, not why the bell rang.',
            'I want the cairn’s mark recorded beside the old route sketches. A second account may show whether the line has been kept or changed.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='reeds'&&discovery==='marsh-watcher-tracks'){
          n.lines=[
            'The Bell Fragment is physical evidence, and the tracks beneath the blue light are another observation. Neither tells us who—or what—made them.',
            'I will record the fragment without assigning it a purpose. The route records disagree about the lower path.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='ridge'){
          n.lines=[
            'You kept to the High Ridge and returned. I can record the route, but I still need a close observation of its markers before comparing them with the archive.',
            'A safer passage is useful evidence; it is not an explanation for the single bell.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='reeds'){
          n.lines=[
            'You brought back a Bell Fragment from the Reed Cut. That confirms the metal is real; it does not tell us why it lay beneath the blue light.',
            'I will leave the source of the tracks unassigned until we have a description that can be checked.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else{
          n.lines=[
            'Your return gives us an account to work from, but we should not decide what the bell meant yet.',
            'I will record the observations separately from our guesses.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }
      }else if(id==='brenn'){
        n.lines=route==='ridge'?[
          'I have recorded your return from the High Ridge. A route report tells me where you went; it does not promise the path will stay safe.',
          'If a marker is moved, a tidy ledger can still be wrong. Tell me what you saw, not what you suspect.'
        ]:route==='reeds'?[
          'The Bell Fragment is entered in the ledger. That proves you brought back metal; it does not prove who placed it in the mud.',
          'I will leave the route report open until the tracks can be described and checked.'
        ]:[
          'You are back with a report. I will record what you observed separately from what you believe it means.'
        ];
      }else if(id==='oric'){
        n.lines=route==='ridge'?[
          'The ridge was the cautious choice. Keep watching the cairns next time; a safer route can still be changed by careless hands.',
          'Report a damaged marker before you try to repair it. I need to know what was there first.'
        ]:route==='reeds'?[
          'You came back from the Reed Cut. Good. Next time, do not follow a light or a set of tracks unless you have a clear way to retreat.',
          'If the marks look wrong, leave them where they are and bring back a description.'
        ]:[
          'You returned. Keep the next report practical: route, conditions, signs of trouble, and a way out.'
        ];
      }
    }
    if(!greyfen&&id==='oric'&&pl.flags?.highRidgeCairnOutcome){
      n.lines=pl.flags.highRidgeCairnOutcome==='restore'
        ?['You reset the Ridgeway Cairn. I have asked the road crew to check the lower cart track before anyone trusts the old line.','Keep the fresh scrape in your report. If someone moved it once, we need to know why before we call it settled.']
        :pl.flags.highRidgeCairnOutcome==='warn'
         ?['The warning strip is still doing a job. I have logged the shifted cairn as unsafe until we can survey it properly.','A warning is not a repair, but it gives the next traveler a chance to stop before the ground fails.']
         :['You recorded both alignments and left the stone untouched. Good. A route mark should be evidence, not an order no one can question.','I have copied both positions into the ledger. If someone moved it, we need the reason—not a cleaner story.'];
    }
    pl.flags=pl.flags||{}; pl.npcTalk=pl.npcTalk||{}; pl.npcTalk[id]=Number(pl.npcTalk[id]||0)+1;
    if(id==='mara'&&!greyfen){
      pl.flags.talkedToMara=true;
      pl.flags.bellQuestStarted=true;
      if(pl.flags.firstRoadReturnSeen&&!pl.flags.firstRoadReturnMaraBriefed){
        pl.flags.firstRoadReturnMaraBriefed=true;
      }
      if(pl.flags.firstRoadReturnSeen){
        const objective=pl.flags.greyfenEvidenceFiled
          ? 'Find the missing closure order that authorized the later change to the lower crossing.'
          : pl.flags.greyfenWeeklyReturnReported
            ? 'Ask Mara to preserve the field note, overwritten ledger, and weekly return together in the Boundary Archive.'
            : pl.flags.greyfenWeeklyReturnFound
              ? 'Bring the earlier weekly route return to Old Brenn in Greyfen’s Bellkeeper’s Ledger.'
              : pl.flags.greyfenLedgerCompared
                ? 'Find the earlier weekly route return that accompanied the overwritten Greyfen ledger.'
                : pl.flags.greyfenFieldNoteReported
            ? 'Ask Old Brenn to compare the dated field note with Greyfen’s crossing ledger.'
            : pl.flags.greyfenFieldNoteFound
              ? 'Bring the dated Reedwatch field note to Mara in Greyfen’s Boundary Archive.'
              : pl.flags.greyfenArchiveRead
                ? 'Find a dated record or physical sign showing when the newer Greyfen cut was made.'
                : pl.flags.greyfenBoundaryCompared
                  ? 'Take the matching boundary mark to Mara in Greyfen’s Boundary Archive.'
                  : pl.flags.bellRoadSearched
                    ? 'Compare the Blackroot seal record with Greyfen’s boundary marks when the lowland archive is available.'
                    : 'Inspect the bell-marked seal at Blackroot Bend and return with your observations.';
        setBellQuestObjective(pl,objective);
      }
    }

    return true;
  }

  window.LegendAshmereNpcStoryV099 = Object.freeze({ apply });
})();
