/* TEAM BOARD - プッシュ通知用 Service Worker（外部ライブラリ不要） */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

/* ホーム画面アイコンの①バッジ（setAppBadge/clearAppBadgeはnavigator側にある） */
function badgeSet(n){
  try{ if (self.navigator && self.navigator.setAppBadge) return self.navigator.setAppBadge(n).catch(function(){}); }catch(e){}
  return Promise.resolve();
}
function badgeClear(){
  try{ if (self.navigator && self.navigator.clearAppBadge) return self.navigator.clearAppBadge().catch(function(){}); }catch(e){}
  return Promise.resolve();
}

/* FCMからのプッシュを受けて通知を表示する */
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(_) {}
  var n = (d && d.notification) || {};
  var title = n.title || 'TEAM BOARD';
  var opts = { body: n.body || '', icon: 'icon-192.png', badge: 'icon-192.png' };
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, opts),
    badgeSet(1)
  ]));
});

/* 通知タップでアプリを開く（既に開いているタブがあればそれを前面に）／アイコンのバッジは消す */
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    Promise.all([
      badgeClear(),
      clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
        for (var i=0; i<list.length; i++){
          if ('focus' in list[i]) return list[i].focus();
        }
        if (clients.openWindow) return clients.openWindow('./');
      })
    ])
  );
});
