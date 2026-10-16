/* LEGEND Ashmere/Greyfen NPC dialogue and evidence progression.
 * Owns the existing character dialogue branches, quest flags, memories, and objective
 * updates. Screen frame, player persistence, and presentation helpers are injected.
 */
(() => {
  function render(context, id) {
    if (!context || typeof context.getPlayer !== 'function' ||
        typeof context.savePlayer !== 'function' || typeof context.screen !== 'function') return;
    const p = () => context.getPlayer();
    const save = player => context.savePlayer(player);
    const esc = context.escapeHtml;
    const img = context.imageMarkup;
    const bg = context.background;
    const npc = context.npcArt;
    const setBellQuestObjective = context.setBellQuestObjective;
    const head = context.head;
    const screen = context.screen;
    const npcCatalog = window.LegendAshmereNpcCatalogV099?.create({ npcArt: npc });

  function renderNPC(id){
    const pl=p(); if(!pl)return;
    const greyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
    const n = npcCatalog?.get
      ? npcCatalog.get(greyfen ? 'Greyfen' : 'Ashmere', id)
      : {
          name: 'Town Character',
          role: 'Town Guide',
          art: npc(id),
          text: 'The dialogue catalog did not load. Refresh before continuing.',
          lines: ['Town dialogue is temporarily unavailable.']
        };
    if(greyfen&&id==='mara'&&pl.flags?.greyfenEvidenceFiled){
      n.lines=[
        'The field note, the crossing ledger, and the earlier weekly return are now preserved together. Each record tells a different part of the same route history.',
        'The lower crossing was officially closed pending inspection, then marked open without initials. We have evidence of an alteration, not the name of the person who made it.',
        'The missing closure order is our next lead. Until it is found, no honest record lets us say who authorized the change.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenWeeklyReturnReported){
      n.lines=[
        'The field note, the crossing ledger, and the earlier weekly return are now preserved together. Each record tells a different part of the same route history.',
        'The lower crossing was officially closed pending inspection, then marked open without initials. We have evidence of an alteration, not the name of the person who made it.',
        'The missing closure order is our next lead. Until it is found, no honest record lets us say who authorized the change.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenFieldNoteFound){
      n.lines=[
        'The field note is dated two days after Greyfen logged the flood’s retreat. Its sketch already shows the newer cut pointing into the reed bed.',
        'The date means the cut was present after the flood was recorded; the water alone does not account for it. The signature is lost, so the writer remains unknown.',
        'Take the date to Brenn. His ledger may show which deliveries changed direction that week.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenBoundaryCompared){
      n.lines=[
        'The Blackroot mark appears beneath the newer cut here. Water has worn the surface, but it did not make that clean, directional groove.',
        'The later line turns toward the reed bed instead of the raised path. Someone may have been diverting travelers—or trying to hide the higher route. The stone alone cannot tell us which.',
        'I will preserve both layers in the Boundary Archive. Next we need a dated record or physical sign that tells us when the newer cut was made.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.bellRoadSearched){
      n.lines=[
        'You have a Blackroot record now. Bring it to the boundary stone on the approach; I need a second mark before I compare the records.',
        'Do not scrape the stone or try to improve the cut. Its surface is evidence exactly as it stands.',
        'A second location may tell us whether the sign has been copied, altered, or only worn by the water.'
      ];
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
    if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnFound&&!pl.flags.greyfenWeeklyReturnReported){
      n.lines=[
        'This is an earlier return than the entries I showed you. The lower crossing is clearly marked CLOSED pending inspection; the later OPEN correction is written in a different ink and carries no initials.',
        'That gives us an order of events, but not an author. I will compare it against the crossing ledger and leave the discrepancy open.',
        'Take both versions to Mara. A record should preserve a contradiction until evidence resolves it.'
      ];
    }else if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnReported){
      n.lines=[
        'The weekly return predates the overwritten ledger entries. The closure was recorded first; the unsigned OPEN correction came later.',
        'We cannot accuse a person from handwriting alone. Mara has the copies, and we still need the missing closure order.',
        'Until that order turns up, the lower crossing stays marked uncertain in my ledger.'
      ];
    }else if(greyfen&&id==='brenn'&&pl.flags?.greyfenFieldNoteReported){
      n.lines=[
        'I have two crossings entered within days of the flood’s retreat. Both destinations were overwritten in a later hand, and neither entry carries the usual closure order.',
        'That does not tell us who changed the route. It does tell us the newer cut and the redirected deliveries belong in the same investigation.',
        'I will leave the discrepancy open until the earlier weekly route return can be found.'
      ];
      if(!pl.flags.greyfenLedgerCompared){
        pl.flags.greyfenLedgerCompared=true;
        pl.memories=Array.isArray(pl.memories)?pl.memories:[];
        const memory='Old Brenn found two Greyfen crossing entries rewritten within days of the flood’s retreat. Both lack a closure order; who changed the destinations is still unknown.';
        if(!pl.memories.includes(memory))pl.memories.push(memory);
        setBellQuestObjective(pl,'Find the earlier weekly route return that accompanied the overwritten Greyfen ledger.');
      }
    }
    if(!greyfen&&id==='oric'&&pl.flags?.highRidgeCairnOutcome){
      n.lines=pl.flags.highRidgeCairnOutcome==='restore'
        ?['You reset the Ridgeway Cairn. I have asked the road crew to check the lower cart track before anyone trusts the old line.','Keep the fresh scrape in your report. If someone moved it once, we need to know why before we call it settled.']
        :pl.flags.highRidgeCairnOutcome==='warn'
         ?['The warning strip is still doing a job. I have logged the shifted cairn as unsafe until we can survey it properly.','A warning is not a repair, but it gives the next traveler a chance to stop before the ground fails.']
         :['You recorded both alignments and left the stone untouched. Good. A route mark should be evidence, not an order no one can question.','I have copied both positions into the ledger. If someone moved it, we need the reason—not a cleaner story.'];
    }
    if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnFound&&!pl.flags.greyfenWeeklyReturnReported){
      pl.flags.greyfenWeeklyReturnReported=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Old Brenn compared the earlier weekly route return with the overwritten Greyfen ledger: the lower crossing was closed pending inspection before a later, unsigned correction marked it open.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Ask Mara to preserve the field note, overwritten ledger, and weekly return together in the Boundary Archive.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenWeeklyReturnReported&&!pl.flags.greyfenEvidenceFiled){
      pl.flags.greyfenEvidenceFiled=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara filed the Blackroot seal, Greyfen boundary comparison, Reedwatch field note, and weekly route return together. The route alteration is documented, but its author and the missing closure order remain unknown.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Find the missing closure order that authorized the later change to the lower crossing.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenFieldNoteFound&&!pl.flags.greyfenFieldNoteReported){
      pl.flags.greyfenFieldNoteReported=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara confirms the Reedwatch field note was recorded two days after the flood’s retreat was logged and that its sketch already shows the newer cut. The date narrows when the mark appeared, but the writer remains unknown.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Ask Old Brenn to compare the dated field note with Greyfen’s crossing ledger.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenBoundaryCompared&&!pl.flags.greyfenArchiveRead){
      pl.flags.greyfenArchiveRead=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara compared the Blackroot seal record with the Greyfen boundary stone. The older bell-mark continues beneath a newer groove turned toward the reed bed; the evidence shows alteration, but not who ordered it.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Find a dated record or physical sign showing when the newer Greyfen cut was made.');
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
    save(pl);
    let extra='';
    if(id==='brenn'&&Number(pl.inventory?.roadToken||0)>=3) extra='<button class="ash099-btn" id="turnTokens">Open the Regional Ledger</button>';
    screen(head(n.role,n.name,n.text,n.art,id),'<div class="ash099-lines">'+n.lines.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>',extra);
    const turn=document.getElementById('turnTokens');
    if(turn) turn.onclick=()=>{
      const regionLedger=window.LegendRegionsV100;
      if(typeof regionLedger?.render==='function')return regionLedger.render();
      return renderNPC('brenn');
    };
  }


    return renderNPC(id);
  }

  window.LegendAshmereNpcDialogueV099 = Object.freeze({ render });
})();
