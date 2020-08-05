function Tools() {
}
Tools.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
Tools.cloneObj = function(obj) {
    // 深拷贝
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        (str = JSON.stringify(obj)), //系列化对象
            (newobj = JSON.parse(str)); //还原
    } else {
        // eslint-disable-next-line guard-for-in
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};
Tools.type = function(obj) {
    var toString = Object.prototype.toString;
    var class2type = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Object]': 'object'
    };
    return obj === null ?
        String(obj) :
        class2type[toString.call(obj)] || 'object';
};
Tools.isArray = function(obj) {
    return Tools.type(obj) === 'array';
};
Tools.isWindow = function(obj) {
    return obj && typeof obj === 'object' && 'setInterval' in obj;
};
Tools.isPlainObject = function(obj) {
    var hasOwn = Object.prototype.hasOwnProperty;
    if (!obj || Tools.type(obj) !== 'object' || obj.nodeType || Tools.isWindow(obj)) {
        return false;
    }
    if (
        obj.constructor &&
        !hasOwn.call(obj, 'constructor') &&
        !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
    ) {
        return false;
    }
    var key;
    for (key in obj) {}
    return key === undefined || hasOwn.call(obj, key);
};
// 深度合并对象 类似$.extend() 方法
Tools.extend = function(deep, target, options) {
    var copyIsArray;
    for (name in options) {
        var src = target[name],
            copy = options[name],
            clone = null;
        if (target === copy) {
            continue;
        }
        if (
            deep &&
            copy &&
            (Tools.isPlainObject(copy) || (copyIsArray = Tools.isArray(copy)))
        ) {
            if (copyIsArray) {
                copyIsArray = false;
                clone = src && Tools.isArray(src) ? src : [];
            } else {
                clone = src && Tools.isPlainObject(src) ? src : {};
            }
            target[name] = Tools.extend(deep, clone, copy);
        } else if (copy !== undefined) {
            target[name] = copy;
        }
    }
    return target;
};
// // 深度合并对象 类似$.extend() 方法
// Tools.prototype.extend=(function() {
//     var copyIsArray,
//         toString = Object.prototype.toString,
//         hasOwn = Object.prototype.hasOwnProperty,
//         class2type = {
//             "[object Boolean]": "boolean",
//             "[object Number]": "number",
//             "[object String]": "string",
//             "[object Function]": "function",
//             "[object Array]": "array",
//             "[object Date]": "date",
//             "[object RegExp]": "regExp",
//             "[object Object]": "object"
//         },
//         type = function(obj) {
//             return obj == null ?
//                 String(obj) :
//                 class2type[toString.call(obj)] || "object";
//         },
//         isWindow = function(obj) {
//             return obj && typeof obj === "object" && "setInterval" in obj;
//         },
//         isArray =
//         Array.isArray ||
//         function(obj) {
//             return type(obj) === "array";
//         },
//         isPlainObject = function(obj) {
//             if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
//                 return false;
//             }
//             if (
//                 obj.constructor &&
//                 !hasOwn.call(obj, "constructor") &&
//                 !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")
//             ) {
//                 return false;
//             }
//             var key;
//             for (key in obj) {}
//             return key === undefined || hasOwn.call(obj, key);
//         },

//     return extend;
// })();
//生成随机数
Tools.MathRand = function(number) {
    var Num = '';
    if (number !== null || number !== '') {
        for (var i = 0; i < number; i++) {
            Num += Math.floor(Math.random() * 10);
        }
    } else {
        Num += '0';
    }
    return Num;
};

Tools.stringIsNull = function(value) {
    if (value === null || value.replace(/ /g, '') === '') {
        return true;
    }
    return false;
};
Tools.isEmptyObject = function(obj) {
    var flag = true;
    for (var key in obj) {
        flag = false;
    }
    return flag;
};

// Tools.objIsEqual= function(value1, value2) {
//     if (Object.keys(value1).length != Object.keys(value2).length) {
//         return false;
//     }
//     var flag = true;
//     for (var key1 of Object.keys(value1)) {
//         if (!value2.hasOwnProperty(key1)) {
//             flag = false;
//             break;
//         }
//         if (value1[key1] != value2[key1]) {
//             flag = false;
//             break;
//         }
//     }
//     return flag;
// };

export default Tools;
