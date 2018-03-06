import 'core-js/modules/es6.promise';

function browserSupportsAllFeatures() {
    return 'fetch' in window && 'Symbol' in window;
}


export function loadPolyfill(): Promise<any> {

    if (browserSupportsAllFeatures()) {
        // Browsers that support all features run `main()` immediately.
        return Promise.resolve();
    } else {
        return import('./polyfill');
    }
}

//function loadScript(src, done) {
//    var js = document.createElement('script');
//    js.src = src;
//    js.onload = function () {
//        done();
//    };
//    js.onerror = function () {
//        done(new Error('Failed to load script ' + src));
//    };
//    document.head.appendChild(js);
//}

function ready() {
    console.log('loadPolyfill done');
}

// do it!
// loadPolyfill(ready);