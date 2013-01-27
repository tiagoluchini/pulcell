
sounds = {}

soundManager.setup({
  url: 'swf/',
  onready: function() {
    sounds.heartbeat = soundManager.createSound({
      id: 'heartbeat',
      url: 'audio/heart_beat_horror.ogg',
      autoLoad: true,
    });
  }
});
