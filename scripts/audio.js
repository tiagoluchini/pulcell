
soundManager.setup({
  url: 'swf/',
  onready: function() {
        soundManager.createSound({
          id: 'heartbeat',
          url: 'audio/heart_beat.mp3'
        });
        soundManager.play('heartbeat');

        console.log("opa b")        ;
  }
});

console.log("opa a")