
sounds = {}

soundManager.setup({
  url: 'swf/',
  onready: function() {

    sounds.heartbeat = soundManager.createSound({
      id: 'heartbeat',
      url: 'audio/heart_beat_horror.ogg',
      autoLoad: true,
    });

    sounds.mood_loop = soundManager.createSound({
      id: 'mood_loop',
      url: 'audio/mood_loop.mp3',
      autoLoad: true,
    });

  }
});
