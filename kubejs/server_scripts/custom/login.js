PlayerEvents.loggedIn((event) => {
  const player = event.player;

  if (player.username != null) {
    player.tell(Text.translate('message.createdelightcore.login', [player.username]));
  }
});
