// LEGEND - Old Road expedition state adapter
// Owns the existing per-player expedition state shape and normalization rules.
(() => {
  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function state(player) {
    player.flags = player.flags || {};
    player.flags.roadExpeditionV100 = player.flags.roadExpeditionV100 || {
      stage: 0,
      pressure: 0,
      trips: 0,
      events: 0,
      finds: 0,
      battles: 0
    };
    return player.flags.roadExpeditionV100;
  }

  function ensure(player) {
    const expedition = state(player);
    expedition.stage = clamp(Number(expedition.stage || 0), 0, 5);
    expedition.pressure = clamp(Number(expedition.pressure || 0), 0, 100);
    return expedition;
  }

  window.LegendRoadStateV100 = { clamp, state, ensure };
})();
