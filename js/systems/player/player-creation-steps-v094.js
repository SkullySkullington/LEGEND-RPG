/* LEGEND v0.20.38 — soul-shaping and memory-recovery creation step catalog.
 * Owns step copy and transforms current class/origin/keepsake catalog records into
 * choice cards. State, navigation callbacks, view binding and record persistence
 * stay with the existing creation controller.
 */
(() => {
  const definitions = Object.freeze({
    gender: Object.freeze({
      step: 2,
       kicker: 'Form',
      title: 'What shape returns to you?',
      description: 'A silhouette rises through the dark. Choose the form that feels remembered—or the one you want to keep.',
      key: 'gender',
      nextLabel: 'Choose Personality',
      progress: 'The body is the first outline of a self.',
      scene: 'Dark water reflects a shape before there is a face to it. It seems familiar. Does it feel like you?',
      getItems: context => context.genderOptions || []
    }),
    personality: Object.freeze({
      step: 3,
      kicker: 'Feeling',
      title: 'Which feeling stayed?',
      description: 'A feeling returns before its memory. Your instinct will shape how you meet the world.',
      key: 'personality',
      nextLabel: 'Remember Your Past',
      progress: 'Something in you remembers how it endured.',
      scene: 'A hand reaching out. A door closing. A choice in the dark. You cannot place the moment, but the feeling remains.',
      getItems: context => context.personalityOptions || []
    }),
    origin: Object.freeze({
      step: 4,
      kicker: 'Memory',
      title: 'Where does the memory begin?',
      description: 'A place comes into focus at the edge of waking. It may be a memory, or the shape of one.',
      key: 'origin',
      nextLabel: 'Choose Your Calling',
      progress: 'The edges of a life return before the whole story.',
      scene: 'Rain on a window. Smoke in the air. The sensation of belonging somewhere. No face comes with the memory yet. Where does it lead?', 
      getItems: context => Object.entries(context.data?.origins || {}).map(([id, record]) => ({
        id,
        label: id,
        text: record.text,
        tag: Object.entries(record.bonus || {}).map(([key, amount]) => '+' + amount + ' ' + key).join(', ')
      }))
    }),
    class: Object.freeze({
      step: 5,
      kicker: 'Instinct',
      title: 'What do your hands remember?',
      description: 'The mind may lose its story; muscle and habit remain. Choose the skill that feels most familiar.',
      key: 'class',
      nextLabel: 'Choose a Keepsake',
      progress: 'Muscle, habit, and instinct outlast a name.',
      scene: 'Steel. Bow. Spell. A careful trick. The memory of movement rises before the reason for it. Which motion returns without thought?', 
      getItems: context => Object.entries(context.data?.classes || {}).map(([id, record]) => ({
        id,
        label: id,
        text: record.desc,
        tag: 'HP ' + record.hp + ' · ' + record.move
      }))
    }),
    keepsake: Object.freeze({
      step: 6,
      kicker: 'The Last Fragment',
      title: 'What survived the forgetting?',
      description: 'A small object catches the light in the dark. It may be a keepsake, or the first memory you can hold.',
      key: 'keepsake',
      nextLabel: 'Review Your Story',
      progress: 'A single object catches the light in the dark.',
      scene: 'You cannot remember packing it. Still, your hand knows how to reach for it. What do you choose to carry?', 
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
