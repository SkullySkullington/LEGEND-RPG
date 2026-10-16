const { test, expect } = require('@playwright/test');

test.describe('Ashmere first-road-return dialogue contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('routes first-return dialogue through the story facade without a missing-region error', async ({ page }) => {
    const result = await page.evaluate(() => {
      const player = {
        flags: {
          firstRoadReturnSeen: true,
          firstRoadReturnRoute: 'ridge',
          firstRoadReturnDiscovery: 'ridge-cairn'
        }
      };
      const dialogue = { lines: ['Original dialogue'] };
      const objectives = [];
      const applied = window.LegendAshmereNpcStoryV099.apply(
        player,
        'mara',
        false,
        dialogue,
        (_player, objective) => objectives.push(objective)
      );
      return {
        applied,
        lines: dialogue.lines,
        maraTalkCount: player.npcTalk?.mara,
        objectiveCount: objectives.length
      };
    });

    expect(result.applied).toBe(true);
    expect(result.lines[0]).toContain('Ridgeway Cairn');
    expect(result.maraTalkCount).toBe(1);
    expect(result.objectiveCount).toBe(1);
  });

  test('does not apply Ashmere first-return dialogue in Greyfen', async ({ page }) => {
    const result = await page.evaluate(() => {
      const player = { flags: { firstRoadReturnSeen: true, firstRoadReturnRoute: 'ridge' } };
      const dialogue = { lines: ['Greyfen dialogue stays here'] };
      const applied = window.LegendAshmereFirstRoadReturnDialogueV099.apply(
        player,
        'mara',
        true,
        dialogue
      );
      return { applied, lines: dialogue.lines };
    });

    expect(result.applied).toBe(false);
    expect(result.lines).toEqual(['Greyfen dialogue stays here']);
  });
});
