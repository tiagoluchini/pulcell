
soundManager.setup({
  url: 'swf/',
  onready: function() {
        soundManager.createSound({
          id: 'heartbeat',
          url: 'audio/heart_beat_horror.ogg'
        });
        soundManager.play('heartbeat');

        console.log("opa b")        ;
  }
});
