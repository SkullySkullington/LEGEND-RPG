/* LEGEND v0.20.38 - Veil-led memory prompts, preserving creation mechanics.
 * Owns step copy and transforms current class/origin/keepsake catalog records into
 * choice cards. State, navigation callbacks, view binding and record persistence
 * stay with the existing creation controller.
 */
(() => {
  const definitions = Object.freeze({
    gender: Object.freeze({
      step: 2,
      kicker: 'Memory I · The Shape',
      title: 'How should this soul be known?',
      description: 'The voice cannot decide who you are. This is how you want the world to know the soul you are shaping.',
      key: 'gender',
      nextLabel: 'Remember Your Instinct',
      progress: 'Not every memory has a face. Begin with the one you choose to show.',
      scene: '???: “A name can vanish and still leave a shape behind. Tell me how this soul should be known.”',
      getItems: context => context.genderOptions || []
    }),
    personality: Object.freeze({
      step: 3,
      kicker: 'Memory II · The Instinct',
      title: 'What survived with you?',
      description: 'Before your memories return, one instinct still answers fear. This choice adds a small starting bonus and colors how you meet the world.',
      key: 'personality',
      nextLabel: 'Remember Your Past',
      progress: 'Something in you learned how to answer the unknown. What still answers first?',
      scene: '???: “Something in you moved before you could think. Which instinct survived the dark?”',
      getItems: context => context.personalityOptions || []
    }),
    origin: Object.freeze({
      step: 4,
      kicker: 'Memory III · The Life Before',
      title: 'What life returns first?',
      description: 'Your past is part of your story, not a cage. Origins can add skills, supplies, or a little coin.',
      key: 'origin',
      nextLabel: 'Remember Your Calling',
      progress: 'A fragment returns. It can guide you without defining everything you become.',
      scene: '???: “A place. A promise. A mistake. There are fragments in the dark. Which one answers when I call?”',
      getItems: context => Object.entries(context.data?.origins || {}).map(([id, record]) => ({
        id,
        label: id,
        text: record.text,
        tag: Object.entries(record.bonus || {}).map(([key, amount]) => '+' + amount + ' ' + key).join(', ')
      }))
    }),
    class: Object.freeze({
      step: 5,
      kicker: 'Memory IV · The Way',
      title: 'How did you learn to survive?',
      description: 'The first tool you trust can shape how you face danger. Each calling keeps its real starting strengths and battle technique.',
      key: 'class',
      nextLabel: 'Take Hold of a Keepsake',
      progress: 'The soul remembers the way it moved, even when the reason is lost.',
      scene: '???: “When the road turns cruel, what part of yourself do you reach for first?”',
      getItems: context => Object.entries(context.data?.classes || {}).map(([id, record]) => ({
        id,
        label: id,
        text: record.desc,
        tag: 'HP ' + record.hp + ' · ' + record.move
      }))
    }),
    keepsake: Object.freeze({
      step: 6,
      kicker: 'Memory V · The Keepsake',
      title: 'What did you refuse to leave behind?',
      description: 'A small object can carry a memory—or give you an edge when the road gets hard.',
      key: 'keepsake',
      nextLabel: 'Review Your Story',
      progress: 'One last piece of your old life remains in your pack.',
      scene: '???: “One small thing crossed the dark with you. It remembers the hand that held it, even if you do not.”',
      getItems: context => Object.entries(context.data?.keepsakes || {}).map(([id, record]) => ({
        id,
        label: id,
        text: record.text,
        tag: Object.entries(record.bonus || {}).map(([key, amount]) => '+' + amount + ' ' + key).join(', ')
      }))
    })
  });

  function get(id, context = {}) {
    const definition = definitions[String(id || '')];
    if (!definition) return null;
    return {
      step: definition.step,
      kicker: definition.kicker,
      title: definition.title,
      description: definition.description,
      key: definition.key,
      nextLabel: definition.nextLabel,
      progress: definition.progress,
      scene: definition.scene,
      items: definition.getItems(context)
    };
  }

  window.LegendPlayerCreationStepsV094 = Object.freeze({ get });
})();
