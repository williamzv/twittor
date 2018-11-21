importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DINAMIC_CACHE = 'dinamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// APP_SHELL: el corazon de la app, lo que debe estar cargado siempre para que la app funcione lo más rápido posible.
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
});

self.addEventListener('fetch', e => {
    // Verificar si en el cache existe la request
    const respuesta = caches.match(e.request).then(res => {
        if (res) {
            return res; // si existe en el cache lo retorna.
        } else {
            return fetch(e.request).then(newRes => { // Si no existe en cache lo busco en la web.
                return actualizaCacheDinamico(DINAMIC_CACHE, e.request, newRes);
            });
        }
    });
    e.respondWith(respuesta);
});