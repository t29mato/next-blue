ons.ready(function() {
  /**
   * ［プッシュ通知設定］
   */
  window.FirebasePlugin.grantPermission();
  window.FirebasePlugin.onNotificationOpen(function(notification){
    console.log(notification);
  });
});
