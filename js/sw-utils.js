// Guardar en el cache dinámico
function actualizaCacheDinamico(dynamicCache, req, res) {
    if (res.ok) {
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone()); // Grabar/guardar el cache
            return res.clone();
        });
    } else {
        // Si fallo el cache y la web, no hay mucho por hacer...
        return res; // retorne lo que sea que venga en la respuesta.
    }
}