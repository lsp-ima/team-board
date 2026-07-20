/* TEAM BOARD - プッシュ通知用 Service Worker（外部ライブラリ不要） */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

/* FCMからのプッシュを受けて通知を表示する */
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(_) {}
  var n = (d && d.notification) || {};
  var title = n.title || 'TEAM BOARD';
  var opts = { body: n.body || '', icon: 'icon-192.png', badge: 'icon-192.png' };
  e.waitUntil(self.registration.showNotification(title, opts));
});

/* 通知タップでアプリを開く（既に開いているタブがあればそれを前面に） */
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
      for (var i=0; i<list.length; i++){
        if ('focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
