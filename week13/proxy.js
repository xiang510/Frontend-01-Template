let handlers = new Map();
let reactives = new Map();
let usedReactivity = [];

let obj = {
    a: 1,
    b: 2,
};

function reactive(obj) {
    if (reactives.has(obj)) {
        return reactive[obj];
    }
    let proxy = new Proxy(obj, {
        get(o, p) {
            // console.log(o, p);
            usedReactivity.push([o, p]);
            if (typeof o[p] === 'object') {
                return reactive(o[p]);
            }
            return o[p];
        },
        set(o, p, v) {
            o[p] = v;
            if (handlers.get(o)) {
                if (handlers.get(o).get(p)) {
                    for (let handler of handlers.get(o).get(p)) {
                        handler();
                    }
                }
            }
            return o[p];
        },
    });

    reactives.set(obj, proxy);
    reactives.set(proxy, proxy);

    return proxy;
}

function effect(handler) {
    usedReactivity = [];
    // console.log(handler);
    handler();
    for (let reactivity of usedReactivity) {
        let [obj, prop] = reactivity;

        console.log([obj, prop]);

        if (!handlers.has(obj)) {
            handlers.set(obj, new Map());
        }
        if (!handlers.get(obj).has(prop)) {
            handlers.get(obj).set(prop, []);
        }
        handlers.get(obj).get(prop).push(handler);
    }
}

let dummy;

let p = reactive(obj);

effect(() => (dummy = p.a));
console.log(dummy);
p.a = 9;
console.log(dummy);
