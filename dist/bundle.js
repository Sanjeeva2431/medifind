(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@capacitor/core/dist/index.js
  var ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp, SystemBarsStyle, SystemBarType, SystemBarsPluginWeb, SystemBars;
  var init_dist = __esm({
    "node_modules/@capacitor/core/dist/index.js"() {
      (function(ExceptionCode2) {
        ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
        ExceptionCode2["Unavailable"] = "UNAVAILABLE";
      })(ExceptionCode || (ExceptionCode = {}));
      CapacitorException = class extends Error {
        constructor(message, code, data) {
          super(message);
          this.message = message;
          this.code = code;
          this.data = data;
        }
      };
      getPlatformId = (win) => {
        var _a, _b;
        if (win === null || win === void 0 ? void 0 : win.androidBridge) {
          return "android";
        } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
          return "ios";
        } else {
          return "web";
        }
      };
      createCapacitor = (win) => {
        const capCustomPlatform = win.CapacitorCustomPlatform || null;
        const cap = win.Capacitor || {};
        const Plugins = cap.Plugins = cap.Plugins || {};
        const getPlatform = () => {
          return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
        };
        const isNativePlatform = () => getPlatform() !== "web";
        const isPluginAvailable = (pluginName) => {
          const plugin = registeredPlugins.get(pluginName);
          if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            return true;
          }
          if (getPluginHeader(pluginName)) {
            return true;
          }
          return false;
        };
        const getPluginHeader = (pluginName) => {
          var _a;
          return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
        };
        const handleError = (err) => win.console.error(err);
        const registeredPlugins = /* @__PURE__ */ new Map();
        const registerPlugin2 = (pluginName, jsImplementations = {}) => {
          const registeredPlugin = registeredPlugins.get(pluginName);
          if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
          }
          const platform = getPlatform();
          const pluginHeader = getPluginHeader(pluginName);
          let jsImplementation;
          const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
              jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
            } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
              jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
            }
            return jsImplementation;
          };
          const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
              const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
              if (methodHeader) {
                if (methodHeader.rtype === "promise") {
                  return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                } else {
                  return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                }
              } else if (impl) {
                return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
              }
            } else if (impl) {
              return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            } else {
              throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
          };
          const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
              const p = loadPluginImplementation().then((impl) => {
                const fn = createPluginMethod(impl, prop);
                if (fn) {
                  const p2 = fn(...args);
                  remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                  return p2;
                } else {
                  throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                }
              });
              if (prop === "addListener") {
                p.remove = async () => remove();
              }
              return p;
            };
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, "name", {
              value: prop,
              writable: false,
              configurable: false
            });
            return wrapper;
          };
          const addListener = createPluginMethodWrapper("addListener");
          const removeListener = createPluginMethodWrapper("removeListener");
          const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
              const callbackId = await call;
              removeListener({
                eventName,
                callbackId
              }, callback);
            };
            const p = new Promise((resolve) => call.then(() => resolve({ remove })));
            p.remove = async () => {
              console.warn(`Using addListener() without 'await' is deprecated.`);
              await remove();
            };
            return p;
          };
          const proxy = new Proxy({}, {
            get(_, prop) {
              switch (prop) {
                // https://github.com/facebook/react/issues/20030
                case "$$typeof":
                  return void 0;
                case "toJSON":
                  return () => ({});
                case "addListener":
                  return pluginHeader ? addListenerNative : addListener;
                case "removeListener":
                  return removeListener;
                default:
                  return createPluginMethodWrapper(prop);
              }
            }
          });
          Plugins[pluginName] = proxy;
          registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
          });
          return proxy;
        };
        if (!cap.convertFileSrc) {
          cap.convertFileSrc = (filePath) => filePath;
        }
        cap.getPlatform = getPlatform;
        cap.handleError = handleError;
        cap.isNativePlatform = isNativePlatform;
        cap.isPluginAvailable = isPluginAvailable;
        cap.registerPlugin = registerPlugin2;
        cap.Exception = CapacitorException;
        cap.DEBUG = !!cap.DEBUG;
        cap.isLoggingEnabled = !!cap.isLoggingEnabled;
        return cap;
      };
      initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
      Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      registerPlugin = Capacitor.registerPlugin;
      WebPlugin = class {
        constructor() {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
        }
        addListener(eventName, listenerFunc) {
          let firstListener = false;
          const listeners = this.listeners[eventName];
          if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
          }
          this.listeners[eventName].push(listenerFunc);
          const windowListener = this.windowListeners[eventName];
          if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
          }
          if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
          }
          const remove = async () => this.removeListener(eventName, listenerFunc);
          const p = Promise.resolve({ remove });
          return p;
        }
        async removeAllListeners() {
          this.listeners = {};
          for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
          }
          this.windowListeners = {};
        }
        notifyListeners(eventName, data, retainUntilConsumed) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            if (retainUntilConsumed) {
              let args = this.retainedEventArguments[eventName];
              if (!args) {
                args = [];
              }
              args.push(data);
              this.retainedEventArguments[eventName] = args;
            }
            return;
          }
          listeners.forEach((listener) => listener(data));
        }
        hasListeners(eventName) {
          var _a;
          return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
        }
        registerWindowListener(windowEventName, pluginEventName) {
          this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: (event) => {
              this.notifyListeners(pluginEventName, event);
            }
          };
        }
        unimplemented(msg = "not implemented") {
          return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
        }
        unavailable(msg = "not available") {
          return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
        }
        async removeListener(eventName, listenerFunc) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            return;
          }
          const index = listeners.indexOf(listenerFunc);
          this.listeners[eventName].splice(index, 1);
          if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
          }
        }
        addWindowListener(handle) {
          window.addEventListener(handle.windowEventName, handle.handler);
          handle.registered = true;
        }
        removeWindowListener(handle) {
          if (!handle) {
            return;
          }
          window.removeEventListener(handle.windowEventName, handle.handler);
          handle.registered = false;
        }
        sendRetainedArgumentsForEvent(eventName) {
          const args = this.retainedEventArguments[eventName];
          if (!args) {
            return;
          }
          delete this.retainedEventArguments[eventName];
          args.forEach((arg) => {
            this.notifyListeners(eventName, arg);
          });
        }
      };
      encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      CapacitorCookiesPluginWeb = class extends WebPlugin {
        async getCookies() {
          const cookies = document.cookie;
          const cookieMap = {};
          cookies.split(";").forEach((cookie) => {
            if (cookie.length <= 0)
              return;
            let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
            key = decode(key).trim();
            value = decode(value).trim();
            cookieMap[key] = value;
          });
          return cookieMap;
        }
        async setCookie(options) {
          try {
            const encodedKey = encode(options.key);
            const encodedValue = encode(options.value);
            const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
            const path = (options.path || "/").replace("path=", "");
            const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
            document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async deleteCookie(options) {
          try {
            document.cookie = `${options.key}=; Max-Age=0`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearCookies() {
          try {
            const cookies = document.cookie.split(";") || [];
            for (const cookie of cookies) {
              document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearAllCookies() {
          try {
            await this.clearCookies();
          } catch (error) {
            return Promise.reject(error);
          }
        }
      };
      CapacitorCookies = registerPlugin("CapacitorCookies", {
        web: () => new CapacitorCookiesPluginWeb()
      });
      readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      normalizeHttpHeaders = (headers = {}) => {
        const originalKeys = Object.keys(headers);
        const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
        const normalized = loweredKeys.reduce((acc, key, index) => {
          acc[key] = headers[originalKeys[index]];
          return acc;
        }, {});
        return normalized;
      };
      buildUrlParams = (params, shouldEncode = true) => {
        if (!params)
          return null;
        const output = Object.entries(params).reduce((accumulator, entry) => {
          const [key, value] = entry;
          let encodedValue;
          let item;
          if (Array.isArray(value)) {
            item = "";
            value.forEach((str) => {
              encodedValue = shouldEncode ? encodeURIComponent(str) : str;
              item += `${key}=${encodedValue}&`;
            });
            item.slice(0, -1);
          } else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
          }
          return `${accumulator}&${item}`;
        }, "");
        return output.substr(1);
      };
      buildRequestInit = (options, extra = {}) => {
        const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
        const headers = normalizeHttpHeaders(options.headers);
        const type = headers["content-type"] || "";
        if (typeof options.data === "string") {
          output.body = options.data;
        } else if (type.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
          }
          output.body = params.toString();
        } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
          const form = new FormData();
          if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
              form.append(key, value);
            });
          } else {
            for (const key of Object.keys(options.data)) {
              form.append(key, options.data[key]);
            }
          }
          output.body = form;
          const headers2 = new Headers(output.headers);
          headers2.delete("content-type");
          output.headers = headers2;
        } else if (type.includes("application/json") || typeof options.data === "object") {
          output.body = JSON.stringify(options.data);
        }
        return output;
      };
      CapacitorHttpPluginWeb = class extends WebPlugin {
        /**
         * Perform an Http request given a set of options
         * @param options Options to build the HTTP request
         */
        async request(options) {
          const requestInit = buildRequestInit(options, options.webFetchExtra);
          const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
          const url = urlParams ? `${options.url}?${urlParams}` : options.url;
          const response = await fetch(url, requestInit);
          const contentType = response.headers.get("content-type") || "";
          let { responseType = "text" } = response.ok ? options : {};
          if (contentType.includes("application/json")) {
            responseType = "json";
          }
          let data;
          let blob;
          switch (responseType) {
            case "arraybuffer":
            case "blob":
              blob = await response.blob();
              data = await readBlobAsBase64(blob);
              break;
            case "json":
              data = await response.json();
              break;
            case "document":
            case "text":
            default:
              data = await response.text();
          }
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          return {
            data,
            headers,
            status: response.status,
            url: response.url
          };
        }
        /**
         * Perform an Http GET request given a set of options
         * @param options Options to build the HTTP request
         */
        async get(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
        }
        /**
         * Perform an Http POST request given a set of options
         * @param options Options to build the HTTP request
         */
        async post(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
        }
        /**
         * Perform an Http PUT request given a set of options
         * @param options Options to build the HTTP request
         */
        async put(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
        }
        /**
         * Perform an Http PATCH request given a set of options
         * @param options Options to build the HTTP request
         */
        async patch(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
        }
        /**
         * Perform an Http DELETE request given a set of options
         * @param options Options to build the HTTP request
         */
        async delete(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
        }
      };
      CapacitorHttp = registerPlugin("CapacitorHttp", {
        web: () => new CapacitorHttpPluginWeb()
      });
      (function(SystemBarsStyle2) {
        SystemBarsStyle2["Dark"] = "DARK";
        SystemBarsStyle2["Light"] = "LIGHT";
        SystemBarsStyle2["Default"] = "DEFAULT";
      })(SystemBarsStyle || (SystemBarsStyle = {}));
      (function(SystemBarType2) {
        SystemBarType2["StatusBar"] = "StatusBar";
        SystemBarType2["NavigationBar"] = "NavigationBar";
      })(SystemBarType || (SystemBarType = {}));
      SystemBarsPluginWeb = class extends WebPlugin {
        async setStyle() {
          this.unavailable("not available for web");
        }
        async setAnimation() {
          this.unavailable("not available for web");
        }
        async show() {
          this.unavailable("not available for web");
        }
        async hide() {
          this.unavailable("not available for web");
        }
      };
      SystemBars = registerPlugin("SystemBars", {
        web: () => new SystemBarsPluginWeb()
      });
    }
  });

  // node_modules/@capacitor/app/dist/esm/definitions.js
  var init_definitions = __esm({
    "node_modules/@capacitor/app/dist/esm/definitions.js"() {
    }
  });

  // node_modules/@capacitor/app/dist/esm/web.js
  var web_exports = {};
  __export(web_exports, {
    AppWeb: () => AppWeb
  });
  var AppWeb;
  var init_web = __esm({
    "node_modules/@capacitor/app/dist/esm/web.js"() {
      init_dist();
      AppWeb = class extends WebPlugin {
        constructor() {
          super();
          this.handleVisibilityChange = () => {
            const data = {
              isActive: document.hidden !== true
            };
            this.notifyListeners("appStateChange", data);
            if (document.hidden) {
              this.notifyListeners("pause", null);
            } else {
              this.notifyListeners("resume", null);
            }
          };
          document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        exitApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getInfo() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getLaunchUrl() {
          return { url: "" };
        }
        async getState() {
          return { isActive: document.hidden !== true };
        }
        async minimizeApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async toggleBackButtonHandler() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getAppLanguage() {
          return {
            value: navigator.language.split("-")[0].toLowerCase()
          };
        }
      };
    }
  });

  // node_modules/@capacitor/app/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    App: () => App
  });
  var App;
  var init_esm = __esm({
    "node_modules/@capacitor/app/dist/esm/index.js"() {
      init_dist();
      init_definitions();
      App = registerPlugin("App", {
        web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.AppWeb())
      });
    }
  });

  // js/data.js
  var MEDICINE_CATEGORIES = [
    { id: "all", name: "All Medicines", icon: "fa-pills", badge: "100+ Items" },
    { id: "emergency", name: "Emergency Care", icon: "fa-truck-medical", badge: "Fast Track" },
    { id: "pain_relief", name: "Pain Relief", icon: "fa-head-side-virus", badge: "Popular" },
    { id: "antibiotics", name: "Antibiotics", icon: "fa-capsules", badge: "Rx Req" },
    { id: "diabetes", name: "Diabetes Care", icon: "fa-syringe", badge: "Essential" },
    { id: "cardiac", name: "Cardiac & BP", icon: "fa-heart-pulse", badge: "Life Save" },
    { id: "vitamins", name: "Vitamins & Supps", icon: "fa-apple-whole", badge: "Top Seller" },
    { id: "digestive", name: "Digestive Health", icon: "fa-stomach", badge: "Daily" },
    { id: "skincare", name: "Derma & Skincare", icon: "fa-spa", badge: "Care" },
    { id: "baby_care", name: "Baby & Infant", icon: "fa-baby", badge: "Gentle" },
    { id: "first_aid", name: "First Aid & Kits", icon: "fa-kit-medical", badge: "Must Have" }
  ];
  var MOCK_PHARMACIES = [
    {
      id: "pharm_1",
      shop_name: "Apollo Pharmacy 24/7",
      owner_name: "Dr. S. K. Gupta",
      license_number: "DL-2023-APO891",
      gst: "07AAAAA0000A1Z5",
      address: "14 Healthcare Square, Near Metro Station, Sector 18",
      lat: 28.5355,
      lng: 77.391,
      rating: 4.8,
      reviews_count: 342,
      status: "open",
      distance: "0.8 km",
      phone: "+91 98765 12345",
      delivery_time: "15-20 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_2",
      shop_name: "MedPlus Superstore",
      owner_name: "Ramesh Sharma",
      license_number: "DL-2022-MP4410",
      gst: "07BBBBA1111B1Z2",
      address: "42 Main Boulevard, Block C, Green Park",
      lat: 28.54,
      lng: 77.385,
      rating: 4.6,
      reviews_count: 189,
      status: "open",
      distance: "1.4 km",
      phone: "+91 98111 88822",
      delivery_time: "20-25 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_3",
      shop_name: "Wellness Forever Chemist",
      owner_name: "Priya Nambiar",
      license_number: "DL-2021-WF1099",
      gst: "07CCCCA2222C1Z9",
      address: "Shop 5, City Center Mall Ground Floor",
      lat: 28.529,
      lng: 77.399,
      rating: 4.9,
      reviews_count: 512,
      status: "open",
      distance: "2.1 km",
      phone: "+91 99000 44332",
      delivery_time: "25-30 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_4",
      shop_name: "Sanjeevani Emergency Pharmacy",
      owner_name: "Vikram Singh",
      license_number: "DL-2024-SAN901",
      gst: "07DDDD3333D1Z1",
      address: "Opposite AIIMS Gate 3, Ring Road",
      lat: 28.56,
      lng: 77.37,
      rating: 4.7,
      reviews_count: 275,
      status: "open",
      distance: "3.2 km",
      phone: "+91 97777 11223",
      delivery_time: "12-18 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_5",
      shop_name: "NetMeds Local Depot",
      owner_name: "Anil Agarwal",
      license_number: "DL-2020-NM3399",
      gst: "07EEEE4444E1Z0",
      address: "Plot 88, Tech Park Avenue",
      lat: 28.51,
      lng: 77.41,
      rating: 4.5,
      reviews_count: 98,
      status: "open",
      distance: "3.8 km",
      phone: "+91 98888 66554",
      delivery_time: "30-40 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    }
  ];
  var generateMedicines = () => {
    const rawData = [
      // Emergency & Pain
      { name: "Dolo 650mg Tablet", generic: "Paracetamol 650mg", cat: "pain_relief", price: 30.5, orig: 35, mfg: "Micro Labs Ltd", dose: "650mg", stock: 120, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Analgesic & Antipyretic for quick fever and body pain relief.", side: "Mild nausea, drowsiness if taken in excess." },
      { name: "Crocin Pain Relief Tablet", generic: "Paracetamol 650mg + Caffeine 50mg", cat: "pain_relief", price: 42, orig: 48, mfg: "GSK Consumer", dose: "650mg", stock: 85, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Fast acting headache and acute muscle pain remedy.", side: "Mild restlessness." },
      { name: "Combiflam Tablet", generic: "Ibuprofen 400mg + Paracetamol 325mg", cat: "pain_relief", price: 45, orig: 52, mfg: "Sanofi India", dose: "400mg/325mg", stock: 65, rx: false, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Combines anti-inflammatory ibuprofen with paracetamol for joint & dental pain.", side: "Stomach irritation." },
      { name: "Meftal-Spas Tablet", generic: "Mefenamic Acid 250mg + Dicyclomine 10mg", cat: "pain_relief", price: 55, orig: 62, mfg: "Blue Cross Labs", dose: "250mg", stock: 40, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Effective relief from spasmodic abdominal pain and cramps.", side: "Dry mouth, dizziness." },
      { name: "Disprin 325mg Effervescent", generic: "Aspirin 325mg", cat: "emergency", price: 12, orig: 15, mfg: "Reckitt Benckiser", dose: "325mg", stock: 200, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Emergency blood thinner for cardiac discomfort & acute migraine.", side: "Gastric acid increase." },
      { name: "Sorbitrate 5mg Sublingual", generic: "Isosorbide Dinitrate 5mg", cat: "emergency", price: 28, orig: 32, mfg: "Abbott Healthcare", dose: "5mg", stock: 50, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Emergency vasodilator for chest pain (Angina) attacks.", side: "Headache, flushing." },
      { name: "Epinephrine Auto-Injector (EpiPen)", generic: "Epinephrine 0.3mg", cat: "emergency", price: 1850, orig: 2100, mfg: "Viatris Specialty", dose: "0.3mg", stock: 15, rx: true, img: "https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80", desc: "Emergency treatment for severe anaphylactic allergic reactions.", side: "Rapid heart rate, tremor." },
      // Antibiotics
      { name: "Augmentin 625 Duo Tablet", generic: "Amoxicillin 500mg + Clavulanic Acid 125mg", cat: "antibiotics", price: 201.5, orig: 230, mfg: "GSK India", dose: "625mg", stock: 55, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Broad-spectrum antibiotic for respiratory, sinus, and urinary infections.", side: "Diarrhea, mild skin rash." },
      { name: "Azithral 500 Tablet", generic: "Azithromycin 500mg", cat: "antibiotics", price: 118, orig: 135, mfg: "Alembic Pharma", dose: "500mg", stock: 70, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Macrolide antibiotic 3-day course for throat and bronchial infections.", side: "Nausea, abdominal discomfort." },
      { name: "Ciplox 500mg Tablet", generic: "Ciprofloxacin 500mg", cat: "antibiotics", price: 42, orig: 49, mfg: "Cipla Ltd", dose: "500mg", stock: 90, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Fluoroquinolone antibiotic for gut, urinary and typhoid infections.", side: "Joint stiffness." },
      // Diabetes
      { name: "Glycomet 500 SR Tablet", generic: "Metformin Hydrochloride 500mg", cat: "diabetes", price: 24.5, orig: 28, mfg: "USV Pvt Ltd", dose: "500mg SR", stock: 300, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "First-line sustained release treatment for Type 2 Diabetes Mellitus.", side: "Initial metallic taste, mild gas." },
      { name: "Janumet 50/500mg Tablet", generic: "Sitagliptin 50mg + Metformin 500mg", cat: "diabetes", price: 340, orig: 390, mfg: "MSD Pharmaceuticals", dose: "50/500mg", stock: 45, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Dual combination control for blood glucose spikes after meals.", side: "Headache, runny nose." },
      { name: "Lantus SoloStar Pen (Insulin Glargine)", generic: "Insulin Glargine 100IU/ml", cat: "diabetes", price: 685, orig: 750, mfg: "Sanofi Diabetes", dose: "100 IU/ml", stock: 25, rx: true, img: "https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80", desc: "24-hour long-acting basal insulin cartridge pen.", side: "Hypoglycemia if meals skipped." },
      // Cardiac & BP
      { name: "Telma 40 Tablet", generic: "Telmisartan 40mg", cat: "cardiac", price: 88, orig: 99, mfg: "Glenmark Pharma", dose: "40mg", stock: 150, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Angiotensin receptor blocker for high blood pressure & kidney protection.", side: "Mild dizziness." },
      { name: "Amlokind 5 Tablet", generic: "Amlodipine 5mg", cat: "cardiac", price: 18, orig: 22, mfg: "Mankind Pharma", dose: "5mg", stock: 210, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Calcium channel blocker for hypertension and angina prevention.", side: "Ankle swelling." },
      { name: "Atorva 10mg Tablet", generic: "Atorvastatin 10mg", cat: "cardiac", price: 72, orig: 84, mfg: "Zydus Cadila", dose: "10mg", stock: 180, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Statin medication to lower bad cholesterol (LDL) and triglycerides.", side: "Muscle aches." },
      // Vitamins & Supplements
      { name: "Becosules Z Capsule", generic: "Vitamin B-Complex + Vitamin C + Zinc", cat: "vitamins", price: 48, orig: 55, mfg: "Pfizer Ltd", dose: "1 Cap daily", stock: 400, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Daily immunity booster, mouth ulcer healer and tissue repair capsule.", side: "Bright yellow urine (harmless B2)." },
      { name: "Shelcal 500 Tablet", generic: "Calcium 500mg + Vitamin D3 250IU", cat: "vitamins", price: 131, orig: 145, mfg: "Torrent Pharma", dose: "500mg", stock: 230, rx: false, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Bone density supplement for osteoporosis and joint wellness.", side: "Mild constipation if low water intake." },
      { name: "Evion 400 Vitamin E Capsule", generic: "Tocopheryl Acetate 400mg", cat: "vitamins", price: 35, orig: 40, mfg: "Procter & Gamble", dose: "400mg", stock: 310, rx: false, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Antioxidant for skin nourishment, hair growth and muscle health.", side: "Nausea." },
      { name: "Limcee 500mg Chewable", generic: "Vitamin C 500mg (Ascorbic Acid)", cat: "vitamins", price: 23.5, orig: 27, mfg: "Abbott Healthcare", dose: "500mg", stock: 500, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Tangy orange chewable tablet for cold resistance and skin collagen.", side: "None at recommended dose." },
      // Digestive
      { name: "Eno Orange Antacid Sachet", generic: "Svarjiksara + Nimbukamlam", cat: "digestive", price: 9, orig: 10, mfg: "GSK Consumer", dose: "5g sachet", stock: 600, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Fast 6-second acidity and heartburn relief fizz.", side: "Belching." },
      { name: "Gelusil MPS Syrup 200ml", generic: "Aluminium Hydroxide + Magnesium + Dimethicone", cat: "digestive", price: 125, orig: 140, mfg: "Pfizer India", dose: "10ml after meals", stock: 95, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Mint flavored liquid antacid for gas bloating and reflux.", side: "Mild laxative effect." },
      { name: "Pantocid 40 Tablet", generic: "Pantoprazole 40mg", cat: "digestive", price: 155, orig: 175, mfg: "Sun Pharma", dose: "40mg", stock: 140, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Proton pump inhibitor for GERD and stomach ulcer healing.", side: "Headache, flatulence." },
      // Skincare & Derma
      { name: "Betnovate N Cream 20g", generic: "Betamethasone + Neomycin", cat: "skincare", price: 54, orig: 60, mfg: "GSK India", dose: "Apply topically", stock: 110, rx: true, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80", desc: "Steroid antibacterial cream for eczema and skin inflammation.", side: "Skin thinning if overused." },
      { name: "Candid Dusting Powder 100g", generic: "Clotrimazole 1%", cat: "skincare", price: 145, orig: 165, mfg: "Glenmark Derma", dose: "Topical powder", stock: 85, rx: false, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80", desc: "Anti-fungal powder for sweat rash, ringworm and prickly heat.", side: "Mild stinging." },
      // Baby Care & First Aid
      { name: "Calpol 120mg Oral Suspension 60ml", generic: "Paracetamol Paediatric 120mg/5ml", cat: "baby_care", price: 42, orig: 48, mfg: "GSK India", dose: "120mg/5ml", stock: 90, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Child friendly strawberry syrup for teething fever and post-vaccination pain.", side: "None if dosed by weight." },
      { name: "Dettol Antiseptic Liquid 250ml", generic: "Chloroxylenol 4.8%", cat: "first_aid", price: 135, orig: 145, mfg: "Reckitt Benckiser", dose: "External disinfectant", stock: 180, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "First aid wound wash, bath water sanitizer and surface cleaner.", side: "Do not ingest." },
      { name: "Hansaplast Waterproof Bandages (Pack of 20)", generic: "Medicated Adhesive Strip", cat: "first_aid", price: 65, orig: 75, mfg: "Beiersdorf", dose: "1 strip", stock: 250, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Antiseptic pad bandage with strong adhesive seal.", side: "Adhesive allergy." }
    ];
    const list = [];
    let count = 1;
    for (let loop = 0; loop < 4; loop++) {
      rawData.forEach((item, idx) => {
        const pharmIdx = count % MOCK_PHARMACIES.length;
        const pharmacy = MOCK_PHARMACIES[pharmIdx];
        const suffix = loop === 0 ? "" : ` (Pack ${loop + 1})`;
        const priceVar = Math.max(5, Math.round((item.price + loop * 3.5) * 10) / 10);
        const expiryYear = 2026 + count % 3;
        const expiryMonth = String(count % 12 + 1).padStart(2, "0");
        list.push({
          id: `med_${count}`,
          name: `${item.name}${suffix}`,
          generic_name: item.generic,
          category: item.cat,
          price: priceVar,
          original_price: Math.round(priceVar * 1.15 * 10) / 10,
          manufacturer: item.mfg,
          dosage: item.dose,
          stock: (item.stock + count * 7) % 150 + 10,
          expiry_date: `${expiryYear}-${expiryMonth}-28`,
          description: item.desc,
          side_effects: item.side,
          requires_prescription: item.rx,
          image: item.img,
          pharmacy_id: pharmacy.id,
          pharmacy_name: pharmacy.shop_name,
          pharmacy_distance: pharmacy.distance,
          rating: (4 + count % 10 * 0.1).toFixed(1)
        });
        count++;
      });
    }
    return list;
  };
  var MOCK_MEDICINES = generateMedicines();
  var MOCK_ORDERS = [];

  // js/search-engine.js
  var IntelligentSearchEngine = class {
    constructor(medicines = [], pharmacies = []) {
      this.medicines = medicines;
      this.pharmacies = pharmacies;
    }
    setDatasets(medicines, pharmacies) {
      this.medicines = medicines;
      this.pharmacies = pharmacies;
    }
    // 1. Levenshtein Distance Algorithm for Fuzzy Spelling Correction
    levenshteinDistance(str1, str2) {
      const s1 = str1.toLowerCase().trim();
      const s2 = str2.toLowerCase().trim();
      const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
      for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
      for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
      for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
          const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
            track[j][i - 1] + 1,
            // deletion
            track[j - 1][i] + 1,
            // insertion
            track[j - 1][i - 1] + indicator
            // substitution
          );
        }
      }
      return track[s2.length][s1.length];
    }
    // 2. Similarity Score (0 to 1)
    calculateSimilarity(term, target) {
      const t1 = term.toLowerCase().trim();
      const t2 = target.toLowerCase().trim();
      if (t2.includes(t1)) return 1;
      const distance = this.levenshteinDistance(t1, t2);
      const maxLen = Math.max(t1.length, t2.length);
      if (maxLen === 0) return 1;
      return 1 - distance / maxLen;
    }
    // 3. Intelligent Multi-Field Search
    search(query = "", category = "all") {
      const cleanQuery = query.toLowerCase().trim();
      if (!cleanQuery && (category === "all" || !category)) {
        return { results: this.enrichMedicines(this.medicines), spellingCorrection: null, alternatives: [] };
      }
      const enrichedList = this.enrichMedicines(this.medicines);
      let matches = [];
      let bestSpellingMatch = null;
      let highestSimilarity = 0;
      enrichedList.forEach((med) => {
        const matchCategory = !category || category === "all" || med.category === category;
        if (!matchCategory) return;
        if (!cleanQuery) {
          matches.push({ med, score: 1 });
          return;
        }
        const brandScore = this.calculateSimilarity(cleanQuery, med.name);
        const genericScore = this.calculateSimilarity(cleanQuery, med.generic_name);
        const mfgScore = med.manufacturer ? this.calculateSimilarity(cleanQuery, med.manufacturer) : 0;
        const maxScore = Math.max(brandScore, genericScore, mfgScore);
        if (maxScore > highestSimilarity) {
          highestSimilarity = maxScore;
          if (maxScore > 0.6 && maxScore < 1) {
            bestSpellingMatch = med.name;
          }
        }
        if (maxScore >= 0.45 || med.name.toLowerCase().includes(cleanQuery) || med.generic_name.toLowerCase().includes(cleanQuery)) {
          matches.push({ med, score: maxScore });
        }
      });
      matches.sort((a, b) => {
        if (Math.abs(b.score - a.score) > 0.05) {
          return b.score - a.score;
        }
        const distA = parseFloat(a.med.pharmacy_distance) || 99;
        const distB = parseFloat(b.med.pharmacy_distance) || 99;
        if (distA !== distB) {
          return distA - distB;
        }
        return b.med.stock - a.med.stock;
      });
      const results = matches.map((m) => m.med);
      let alternatives = [];
      if (results.length === 0 || results.every((m) => m.stock === 0)) {
        alternatives = this.getGenericAlternatives(cleanQuery);
      }
      return {
        results,
        spellingCorrection: highestSimilarity >= 0.6 && highestSimilarity < 0.95 ? bestSpellingMatch : null,
        alternatives
      };
    }
    // 5. Enrich medicines with pharmacy open/closed, distance, rating, delivery availability & manufacturer info
    enrichMedicines(medicines) {
      return medicines.map((m) => {
        const pharmacy = this.pharmacies.find((p) => p.id === m.pharmacy_id) || this.pharmacies[0];
        return {
          ...m,
          manufacturer: m.manufacturer || m.mfg || "Certified Pharma Corp",
          pharmacy_name: pharmacy ? pharmacy.shop_name : "Apollo Pharmacy 24/7",
          pharmacy_distance: pharmacy ? pharmacy.distance : "0.8 km",
          pharmacy_status: pharmacy ? pharmacy.status : "open",
          pharmacy_rating: pharmacy ? pharmacy.rating : 4.8,
          pharmacy_delivery_available: pharmacy ? pharmacy.delivery_available : true,
          delivery_time: pharmacy ? pharmacy.delivery_time : "15-20 mins"
        };
      });
    }
    // 6. Alternative Recommender for Out of Stock or Unavailable Brands
    getGenericAlternatives(query) {
      const enriched = this.enrichMedicines(this.medicines);
      const q = query.toLowerCase();
      const matches = enriched.filter(
        (m) => m.stock > 0 && (m.generic_name.toLowerCase().includes(q.split(" ")[0]) || q.includes(m.category))
      ).slice(0, 3);
      return matches.map((alt) => ({
        ...alt,
        savings_percent: 25
        // Average 25% price savings for generic substitute
      }));
    }
  };

  // js/maps.js
  var GoogleMapsService = class {
    constructor() {
      const savedLoc = localStorage.getItem("medifind_user_location");
      this.currentLocation = savedLoc ? JSON.parse(savedLoc) : {
        lat: 13.0827,
        lng: 80.2707,
        label: "Anna Nagar, Chennai",
        isLiveGps: false,
        accuracy: null
      };
      this.locationState = {
        status: "idle",
        // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'
        errorMessage: "",
        isLiveGps: this.currentLocation.isLiveGps
      };
      this.googlePharmacies = [];
      this.isSearchingGoogle = false;
      this.googleApiError = null;
      this.watchId = null;
      this.initGoogleMapsApi();
    }
    async initGoogleMapsApi() {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const config = await res.json();
          if (config.success && config.googleMapsApiKey) {
            this.loadGoogleMapsScript(config.googleMapsApiKey);
          }
        }
      } catch (e) {
        console.warn("[Google Maps API Config Check Failed]:", e);
      }
    }
    loadGoogleMapsScript(apiKey) {
      if (window.google && window.google.maps) return;
      if (document.getElementById("google-maps-js-sdk")) return;
      const script = document.createElement("script");
      script.id = "google-maps-js-sdk";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("\u26A1 Google Maps JavaScript API Loaded Successfully");
        if (window.MediApp) window.MediApp.render();
      };
      document.head.appendChild(script);
    }
    getUserLocation() {
      return this.currentLocation;
    }
    getLocationState() {
      return this.locationState;
    }
    // 1. Request Browser Real GPS Location Permission with Automatic IP Geolocation Fallback
    async requestBrowserLocation() {
      this.locationState.status = "detecting";
      this.locationState.errorMessage = "";
      if (window.MediApp) window.MediApp.render();
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          this.fallbackToIpLocation("Geolocation is not supported by your browser. Using IP Location.").then(resolve);
          return;
        }
        let resolved = false;
        const gpsTimeout = setTimeout(async () => {
          if (!resolved) {
            resolved = true;
            console.log("\u{1F4CD} Browser GPS timeout (5s). Falling back to IP Geolocation...");
            const ipRes = await this.fallbackToIpLocation("GPS timeout. Located via IP address.");
            resolve(ipRes);
          }
        }, 5e3);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(gpsTimeout);
            const lat = parseFloat(position.coords.latitude.toFixed(6));
            const lng = parseFloat(position.coords.longitude.toFixed(6));
            const accuracy = Math.round(position.coords.accuracy || 0);
            let addressLabel = `Live GPS (${lat}, ${lng})`;
            try {
              const geoRes = await fetch(`/api/places/geocode?lat=${lat}&lng=${lng}`);
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData && geoData.success && geoData.formatted_address) {
                  addressLabel = geoData.formatted_address;
                }
              }
            } catch (e) {
              console.warn("[Maps API] Geocoding lookup error:", e);
            }
            this.currentLocation = {
              lat,
              lng,
              label: addressLabel,
              isLiveGps: true,
              accuracy
            };
            this.locationState = {
              status: "granted",
              errorMessage: "",
              isLiveGps: true
            };
            localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
            await this.fetchNearbyPharmacies(lat, lng);
            if (window.MediApp) window.MediApp.render();
            resolve({
              success: true,
              location: this.currentLocation,
              message: `\u{1F4CD} Located: ${addressLabel}! Real nearby pharmacies retrieved.`
            });
          },
          async (error) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(gpsTimeout);
            console.warn("[Browser GPS Permission Error]:", error.message);
            const ipRes = await this.fallbackToIpLocation("Location access blocked or unavailable. City detected via IP.");
            resolve(ipRes);
          },
          { enableHighAccuracy: true, timeout: 5e3, maximumAge: 0 }
        );
      });
    }
    // IP-Based Geolocation Fallback
    async fallbackToIpLocation(reasonMsg = "Located via IP") {
      try {
        let ipData = null;
        try {
          const ipRes = await fetch("/api/places/ip-location");
          if (ipRes.ok) {
            ipData = await ipRes.json();
          }
        } catch (e) {
          try {
            const clientIpRes = await fetch("http://ip-api.com/json/");
            if (clientIpRes.ok) {
              const raw = await clientIpRes.json();
              if (raw && raw.status === "success") {
                ipData = {
                  success: true,
                  lat: raw.lat,
                  lng: raw.lon,
                  formatted_address: `${raw.city}, ${raw.regionName}`
                };
              }
            }
          } catch (err) {
            console.warn("[Client IP Lookup Failed]:", err);
          }
        }
        if (ipData && ipData.success) {
          this.currentLocation = {
            lat: ipData.lat,
            lng: ipData.lng,
            label: ipData.formatted_address || `${ipData.city}, ${ipData.region}`,
            isLiveGps: false,
            isIpLocation: true,
            accuracy: 1e3
          };
          this.locationState = {
            status: "granted",
            errorMessage: "",
            isLiveGps: false,
            isIpLocation: true
          };
          localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
          await this.fetchNearbyPharmacies(ipData.lat, ipData.lng);
          if (window.MediApp) window.MediApp.render();
          return {
            success: true,
            location: this.currentLocation,
            message: `\u{1F4CD} City Detected via IP: ${this.currentLocation.label}`
          };
        }
      } catch (e) {
        console.warn("[IP Location Fallback Error]:", e);
      }
      this.currentLocation = {
        lat: 13.0827,
        lng: 80.2707,
        label: "Anna Nagar, Chennai",
        isLiveGps: false,
        accuracy: null
      };
      this.locationState = { status: "granted", errorMessage: "", isLiveGps: false };
      localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
      if (window.MediApp) window.MediApp.render();
      return { success: true, location: this.currentLocation, message: "\u{1F4CD} Location Set: Anna Nagar, Chennai" };
    }
    // 2. Set Manual City / Address Location
    async setManualLocation(addressLabel, lat = 13.0827, lng = 80.2707) {
      let finalLat = lat;
      let finalLng = lng;
      let finalLabel = addressLabel;
      if (addressLabel && (!lat || lat === 13.0827)) {
        try {
          const geoRes = await fetch(`/api/places/geocode?address=${encodeURIComponent(addressLabel)}`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData && geoData.success && geoData.lat) {
              finalLat = geoData.lat;
              finalLng = geoData.lng;
              finalLabel = geoData.formatted_address || addressLabel;
            }
          }
        } catch (e) {
          console.warn("[Manual Geocode Error]:", e);
        }
      }
      this.currentLocation = {
        lat: finalLat,
        lng: finalLng,
        label: finalLabel,
        isLiveGps: false,
        accuracy: null
      };
      this.locationState = {
        status: "granted",
        errorMessage: "",
        isLiveGps: false
      };
      localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
      await this.fetchNearbyPharmacies(finalLat, finalLng);
      if (window.MediApp) window.MediApp.render();
      return this.currentLocation;
    }
    // 3. Real Nearby Pharmacy Search via Google Places API Proxy
    async fetchNearbyPharmacies(lat, lng) {
      this.isSearchingGoogle = true;
      this.googleApiError = null;
      try {
        const res = await fetch(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=5000`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.pharmacies)) {
          this.googlePharmacies = data.pharmacies.map((p) => {
            const distKm = this.calculateDistance(lat, lng, p.lat, p.lng);
            const formattedDist = this.formatDistance(distKm);
            const times = this.calculateTravelTime(distKm);
            return {
              id: `gplace_${p.place_id}`,
              place_id: p.place_id,
              shop_name: p.name,
              address: p.address,
              lat: p.lat,
              lng: p.lng,
              rating: p.rating || 4.5,
              reviews_count: p.user_ratings_total || 12,
              status: p.open_now === false ? "closed" : "open",
              open_now: p.open_now,
              distance_km: distKm,
              distance: formattedDist,
              phone: p.phone || null,
              delivery_time: times.deliveryTime,
              delivery_available: true,
              isGooglePlace: true,
              logo: p.icon || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
            };
          });
          this.googlePharmacies.sort((a, b) => a.distance_km - b.distance_km);
          this.enrichTopPlacesDetails();
        } else {
          this.googlePharmacies = [];
          this.googleApiError = null;
        }
      } catch (error) {
        console.error("[Google Nearby Fetch Error]:", error);
        this.googlePharmacies = [];
        this.googleApiError = null;
      } finally {
        this.isSearchingGoogle = false;
      }
    }
    async enrichTopPlacesDetails() {
      const top3 = this.googlePharmacies.slice(0, 3);
      for (const p of top3) {
        if (!p.phone && p.place_id) {
          try {
            const res = await fetch(`/api/places/details?place_id=${p.place_id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.details) {
                p.phone = data.details.formatted_phone_number || data.details.international_phone_number || null;
                if (data.details.opening_hours) {
                  p.opening_hours_text = data.details.opening_hours.weekday_text;
                }
              }
            }
          } catch (e) {
          }
        }
      }
    }
    // Dynamic Pharmacy Catalog Localized strictly around User Coordinates
    getPharmacies() {
      const userLat = this.currentLocation.lat;
      const userLng = this.currentLocation.lng;
      const currentArea = (this.currentLocation.label || "Your Area").split(",")[0].replace(/Live GPS \([^)]+\)/gi, "Your Area").trim() || "Your Area";
      const currentCity = (this.currentLocation.label || "").split(",")[1] || "";
      const localOffsets = [
        { dLat: 35e-4, dLng: 42e-4 },
        // ~0.45 km
        { dLat: -51e-4, dLng: 63e-4 },
        // ~0.85 km
        { dLat: 78e-4, dLng: -71e-4 },
        // ~1.2 km
        { dLat: -0.0102, dLng: -89e-4 },
        // ~1.6 km
        { dLat: 0.0135, dLng: 0.0124 },
        // ~2.1 km
        { dLat: -0.0168, dLng: 0.0155 },
        // ~2.7 km
        { dLat: 0.021, dLng: -0.0182 },
        // ~3.4 km
        { dLat: -0.0255, dLng: -0.0221 }
        // ~4.1 km
      ];
      const baseNames = [
        "Apollo Pharmacy 24/7",
        "MedPlus Superstore",
        "Wellness Forever Chemist",
        "Sanjeevani Emergency Pharmacy",
        "NetMeds Local Depot",
        "Guardian Lifecare",
        "Health & Glow Pharmacy",
        "Trust Chemist & Druggist"
      ];
      const localizedMockPharmacies = MOCK_PHARMACIES.map((p, idx) => {
        const offset = localOffsets[idx % localOffsets.length];
        const pLat = userLat + offset.dLat;
        const pLng = userLng + offset.dLng;
        const baseName = baseNames[idx % baseNames.length];
        const shopName = `${baseName} (${currentArea})`;
        const address = `Plot ${12 + idx * 4}, Block ${String.fromCharCode(65 + idx % 5)}, ${currentArea}${currentCity ? ", " + currentCity : ""}`;
        const distKm = this.calculateDistance(userLat, userLng, pLat, pLng);
        const formattedDist = this.formatDistance(distKm);
        const times = this.calculateTravelTime(distKm);
        return {
          ...p,
          lat: pLat,
          lng: pLng,
          shop_name: shopName,
          address,
          distance_km: distKm,
          distance: formattedDist,
          delivery_time: times.deliveryTime
        };
      });
      if (this.googlePharmacies && this.googlePharmacies.length > 0) {
        const googleIds = new Set(this.googlePharmacies.map((g) => g.place_id));
        const merged = [...this.googlePharmacies];
        localizedMockPharmacies.forEach((p) => {
          if (!googleIds.has(p.place_id)) {
            merged.push(p);
          }
        });
        merged.sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
        return merged;
      }
      return localizedMockPharmacies.sort((a, b) => a.distance_km - b.distance_km);
    }
    // 4. Haversine Formula for Accurate Distance Calculation (in Km)
    calculateDistance(lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) return 1;
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return parseFloat(distance.toFixed(2));
    }
    // Format distance: "850 m" if < 1.0 km, "1.2 km" if >= 1.0 km
    formatDistance(distKm) {
      if (distKm < 1) {
        const meters = Math.round(distKm * 1e3);
        return `${meters} m`;
      }
      return `${distKm.toFixed(1)} km`;
    }
    // 5. Estimated Travel & Delivery Time Calculator
    calculateTravelTime(distanceKm) {
      const travelMinutes = Math.round(distanceKm / 20 * 60);
      const totalDeliveryMins = travelMinutes + 5;
      return {
        driveTime: `${Math.max(2, travelMinutes)} mins drive`,
        deliveryTime: `${Math.max(10, totalDeliveryMins)}-${totalDeliveryMins + 5} mins delivery`
      };
    }
    // 6. Generate Real Google Maps Directions URL
    getDirectionsUrl(pharmacy) {
      const origin = `${this.currentLocation.lat},${this.currentLocation.lng}`;
      const destinationName = encodeURIComponent(`${pharmacy.shop_name} ${pharmacy.address}`);
      let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationName}`;
      if (pharmacy.place_id) {
        url += `&destination_place_id=${pharmacy.place_id}`;
      }
      return url;
    }
    // 7. Enable Watch Position for Real-Time Movement Updates
    startWatchPosition() {
      if (this.watchId || !navigator.geolocation) return;
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = parseFloat(position.coords.latitude.toFixed(6));
          const newLng = parseFloat(position.coords.longitude.toFixed(6));
          const distMoved = this.calculateDistance(this.currentLocation.lat, this.currentLocation.lng, newLat, newLng);
          if (distMoved > 0.1) {
            console.log(`\u{1F4CD} Significant location change detected (${(distMoved * 1e3).toFixed(0)}m moved). Updating pharmacies...`);
            this.currentLocation.lat = newLat;
            this.currentLocation.lng = newLng;
            this.currentLocation.accuracy = Math.round(position.coords.accuracy || 0);
            localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
            this.fetchNearbyPharmacies(newLat, newLng).then(() => {
              if (window.MediApp) window.MediApp.render();
            });
          }
        },
        (err) => console.warn("[WatchPosition Error]:", err.message),
        { enableHighAccuracy: true, maximumAge: 1e4 }
      );
    }
    stopWatchPosition() {
      if (this.watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    }
    // 8. Render Google Map Canvas / SDK Map
    renderMapCanvas(containerId, options = {}) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const pharmacies = options.pharmacies || this.getPharmacies();
      const userLoc = this.currentLocation;
      if (window.google && window.google.maps) {
        container.innerHTML = `<div id="${containerId}_gmap" style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md);"></div>`;
        const mapElement = document.getElementById(`${containerId}_gmap`);
        if (mapElement) {
          const map = new google.maps.Map(mapElement, {
            center: { lat: userLoc.lat, lng: userLoc.lng },
            zoom: 14,
            disableDefaultUI: false,
            zoomControl: true,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }]
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }]
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }]
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }]
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }]
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }]
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }]
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }]
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }]
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }]
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }]
              }
            ]
          });
          new google.maps.Marker({
            position: { lat: userLoc.lat, lng: userLoc.lng },
            map,
            title: `\u{1F535} Your Current Location (${userLoc.label})`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#0284c7",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3
            }
          });
          const infoWindow = new google.maps.InfoWindow();
          pharmacies.forEach((p) => {
            if (p.lat && p.lng) {
              const marker = new google.maps.Marker({
                position: { lat: p.lat, lng: p.lng },
                map,
                title: p.shop_name,
                icon: {
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: "#ef4444",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2
                }
              });
              marker.addListener("click", () => {
                infoWindow.setContent(`
                                <div style="color:#0f172a; padding:6px; font-family:sans-serif;">
                                    <strong style="font-size:14px;">${p.shop_name}</strong>
                                    <div style="font-size:12px; color:#475569; margin:4px 0;">${p.address}</div>
                                    <div style="font-size:12px; margin-bottom:6px;">
                                        \u2B50 ${p.rating} (${p.reviews_count} reviews) \u2022 \u{1F4CD} ${p.distance}
                                    </div>
                                    <a href="${this.getDirectionsUrl(p)}" target="_blank" style="display:inline-block; background:#0ea5e9; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
                                        \u{1F9ED} Get Directions
                                    </a>
                                </div>
                            `);
                infoWindow.open(map, marker);
              });
            }
          });
          return;
        }
      }
      let canvas = container.querySelector("canvas");
      if (!canvas) {
        container.innerHTML = `<canvas style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md);"></canvas>`;
        canvas = container.querySelector("canvas");
      }
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width = container.clientWidth || 400;
      const height = canvas.height = container.clientHeight || 220;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      const center = { x: width * 0.5, y: height * 0.5 };
      this.drawMarker(ctx, center.x, center.y, "#0284c7", "fa-location-crosshairs", `\u{1F535} You (${userLoc.label.split(",")[0]})`);
      pharmacies.slice(0, 6).forEach((p, idx) => {
        const angle = idx / 6 * 2 * Math.PI;
        const distPx = 50 + idx * 15;
        const px = center.x + Math.cos(angle) * distPx;
        const py = center.y + Math.sin(angle) * distPx;
        this.drawMarker(ctx, px, py, "#ef4444", "fa-store", `\u{1F4CD} ${p.shop_name.split(" ")[0]} (${p.distance})`);
      });
    }
    drawMarker(ctx, x, y, color, iconClass, label) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.fillStyle = color + "33";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + 20);
      ctx.restore();
    }
  };
  var googleMapsService = new GoogleMapsService();

  // backend/seed/firestoreSeed.js
  var seedFirestore = (firestoreDb2) => {
    console.log("===========================================================");
    console.log("\u{1F525} [Firestore Seeder] Seeding 8 Production Collections...");
    console.log("===========================================================");
    const users = [
      { id: "usr_1", name: "Alex Johnson", email: "alex@example.com", password: "password123", phone: "+91 98765 43210", role: "customer", address: { street: "Flat 402, Block B, Sector 18", city: "Noida", zip: "201301", lat: 28.5355, lng: 77.391 } },
      { id: "usr_2", name: "Priya Sharma", email: "priya@example.com", password: "password123", phone: "+91 98111 22334", role: "customer", address: { street: "42 Green Park", city: "Delhi", zip: "110016", lat: 28.55, lng: 77.2 } },
      { id: "usr_pharm_1", name: "Dr. S. K. Gupta", email: "apollo@example.com", password: "password123", phone: "+91 98765 12345", role: "pharmacy", address: { street: "Apollo Pharmacy 24/7, Sector 18", city: "Noida", zip: "201301", lat: 28.5355, lng: 77.391 } },
      { id: "usr_driver_1", name: "Rohan Verma", email: "rohan@example.com", password: "password123", phone: "+91 98112 33445", role: "delivery", address: { street: "Delivery Hub 4", city: "Noida", zip: "201301", lat: 28.538, lng: 77.388 } },
      { id: "usr_admin_1", name: "Super Admin", email: "admin@medifind.com", password: "adminpassword", phone: "+91 99999 00000", role: "admin", address: { street: "MediFind HQ", city: "Noida", zip: "201301", lat: 28.5355, lng: 77.391 } }
    ];
    users.forEach((u) => firestoreDb2.collections.Users.set(u.id, u));
    console.log(`\u2705 [1/8 Users] Populated ${users.length} documents.`);
    MOCK_PHARMACIES.forEach((p) => firestoreDb2.collections.Pharmacies.set(p.id, {
      ...p,
      owner_id: "usr_pharm_1",
      location: { lat: p.lat, lng: p.lng }
    }));
    console.log(`\u2705 [2/8 Pharmacies] Populated ${MOCK_PHARMACIES.length} documents.`);
    MOCK_MEDICINES.forEach((m) => {
      firestoreDb2.collections.Medicines.set(m.id, {
        ...m,
        pharmacy_id: m.pharmacy_id || "pharm_1"
        // Enforces medicine belongs to 1 pharmacy
      });
    });
    console.log(`\u2705 [3/8 Medicines] Populated ${MOCK_MEDICINES.length} documents (Every medicine linked to 1 pharmacy).`);
    const deliveryPartners = [
      { id: "partner_1", user_id: "usr_driver_1", name: "Rohan Verma", phone: "+91 98112 33445", vehicle_details: "Hero Splendor (KA-01-EQ-9982)", rating: 4.9, is_active: true, total_deliveries: 482, earnings_today: 850, current_location: { lat: 28.538, lng: 77.388 } },
      { id: "partner_2", user_id: "usr_driver_2", name: "Vikram Patel", phone: "+91 98222 55667", vehicle_details: "TVS NTORQ (UP-16-BD-1122)", rating: 4.7, is_active: true, total_deliveries: 310, earnings_today: 620, current_location: { lat: 28.54, lng: 77.395 } }
    ];
    deliveryPartners.forEach((dp) => firestoreDb2.collections.DeliveryPartners.set(dp.id, dp));
    console.log(`\u2705 [4/8 DeliveryPartners] Populated ${deliveryPartners.length} documents.`);
    MOCK_ORDERS.forEach((o) => {
      firestoreDb2.collections.Orders.set(o.id, {
        ...o,
        customer_id: "usr_1",
        // Relational: Belongs to 1 customer
        pharmacy_id: o.pharmacy_id || "pharm_1",
        delivery_partner_id: "partner_1"
        // Relational: Optionally has 1 delivery partner
      });
    });
    console.log(`\u2705 [5/8 Orders] Populated ${MOCK_ORDERS.length} documents (Relational: linked to customer & optional delivery partner).`);
    const prescriptions = [
      {
        id: "RX-901",
        user_id: "usr_1",
        user_name: "Alex Johnson",
        pharmacy_id: "pharm_1",
        doctor_name: "Dr. A. K. Sharma (MD)",
        image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        status: "Pending",
        extracted_items: [
          { name: "Dolo 650mg Tablet", qty: 2, confidence: "98%" },
          { name: "Becosules Z Capsule", qty: 1, confidence: "96%" }
        ],
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    prescriptions.forEach((p) => firestoreDb2.collections.Prescriptions.set(p.id, p));
    console.log(`\u2705 [6/8 Prescriptions] Populated ${prescriptions.length} documents.`);
    const notifications = [
      {
        id: "notif_1",
        user_id: "usr_1",
        title: "Order Dispatched \u26A1",
        body: "Your order ORD-89102 is out for delivery with Rohan Verma.",
        type: "order_update",
        read: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "notif_2",
        user_id: "usr_1",
        title: "Prescription Verification Approved \u2705",
        body: "Dr. Gupta from Apollo Pharmacy verified your prescription RX-901.",
        type: "prescription_approved",
        read: true,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    notifications.forEach((n) => firestoreDb2.collections.Notifications.set(n.id, n));
    console.log(`\u2705 [7/8 Notifications] Populated ${notifications.length} documents.`);
    const reviews = [
      {
        id: "rev_1",
        user_id: "usr_1",
        user_name: "Alex Johnson",
        pharmacy_id: "pharm_1",
        rating: 5,
        comment: "Super fast delivery in 12 mins! All genuine medicines delivered with sealed bill.",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "rev_2",
        user_id: "usr_2",
        user_name: "Priya Sharma",
        pharmacy_id: "pharm_2",
        rating: 4,
        comment: "Good stock of emergency care and diabetes items.",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    reviews.forEach((r) => firestoreDb2.collections.Reviews.set(r.id, r));
    console.log(`\u2705 [8/8 Reviews] Populated ${reviews.length} documents.`);
    console.log("===========================================================");
    console.log("\u{1F389} Firestore Database Seeding Completed Successfully!");
    console.log("===========================================================");
  };

  // js/firestore-db.js
  var FirestoreDatabase = class {
    constructor() {
      this.collections = {
        Users: /* @__PURE__ */ new Map(),
        Pharmacies: /* @__PURE__ */ new Map(),
        Medicines: /* @__PURE__ */ new Map(),
        Orders: /* @__PURE__ */ new Map(),
        DeliveryPartners: /* @__PURE__ */ new Map(),
        Prescriptions: /* @__PURE__ */ new Map(),
        Notifications: /* @__PURE__ */ new Map(),
        Reviews: /* @__PURE__ */ new Map()
      };
      this.initialized = false;
      this.init();
    }
    init() {
      seedFirestore(this);
      try {
        const savedCustomUsers = JSON.parse(localStorage.getItem("medifind_custom_users") || "[]");
        savedCustomUsers.forEach((u) => this.collections.Users.set(u.id, u));
      } catch (e) {
        console.error("[Firestore DB] Error restoring saved custom users:", e);
      }
      this.initialized = true;
    }
    // 1. Users
    async getUser(id) {
      return this.collections.Users.get(id) || null;
    }
    async createUser(userData) {
      const userObj = { ...userData, created_at: userData.created_at || (/* @__PURE__ */ new Date()).toISOString() };
      this.collections.Users.set(userData.id, userObj);
      try {
        const savedCustomUsers = JSON.parse(localStorage.getItem("medifind_custom_users") || "[]");
        const idx = savedCustomUsers.findIndex((u) => u.id === userObj.id || u.email.toLowerCase() === userObj.email.toLowerCase());
        if (idx >= 0) {
          savedCustomUsers[idx] = userObj;
        } else {
          savedCustomUsers.push(userObj);
        }
        localStorage.setItem("medifind_custom_users", JSON.stringify(savedCustomUsers));
      } catch (e) {
        console.error("[Firestore DB] Error persisting custom user:", e);
      }
      return userObj;
    }
    // 2. Pharmacies
    async getPharmacies() {
      return Array.from(this.collections.Pharmacies.values());
    }
    async getPharmacyById(id) {
      return this.collections.Pharmacies.get(id) || null;
    }
    // 3. Medicines (Relational: Belongs to 1 Pharmacy)
    async getMedicinesByPharmacy(pharmacyId) {
      return Array.from(this.collections.Medicines.values()).filter((m) => m.pharmacy_id === pharmacyId);
    }
    async searchMedicines(query = "", category = "all") {
      const q = query.toLowerCase();
      return Array.from(this.collections.Medicines.values()).filter((m) => {
        const matchCat = category === "all" || m.category === category;
        const matchQuery = !q || m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q);
        return matchCat && matchQuery;
      });
    }
    // 4. Orders (Relational: Customer + Pharmacy + Optional Delivery Partner)
    async getOrdersByCustomer(customerId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.customer_id === customerId);
    }
    async getOrdersByPharmacy(pharmacyId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.pharmacy_id === pharmacyId);
    }
    async getOrdersByDeliveryPartner(partnerId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.delivery_partner_id === partnerId);
    }
    async createOrder(orderData) {
      if (!orderData.customer_id) throw new Error("Order must belong to a Customer (customer_id is required)");
      if (!orderData.pharmacy_id) throw new Error("Order must belong to a Pharmacy (pharmacy_id is required)");
      this.collections.Orders.set(orderData.id, { ...orderData, created_at: (/* @__PURE__ */ new Date()).toISOString() });
      return orderData;
    }
    // 5. DeliveryPartners
    async getDeliveryPartners() {
      return Array.from(this.collections.DeliveryPartners.values());
    }
    // 6. Prescriptions
    async getPrescriptionsByUser(userId) {
      return Array.from(this.collections.Prescriptions.values()).filter((p) => p.user_id === userId);
    }
    // 7. Notifications
    async getNotificationsByUser(userId) {
      return Array.from(this.collections.Notifications.values()).filter((n) => n.user_id === userId);
    }
    // 8. Reviews
    async getReviewsByPharmacy(pharmacyId) {
      return Array.from(this.collections.Reviews.values()).filter((r) => r.pharmacy_id === pharmacyId);
    }
  };
  var firestoreDb = new FirestoreDatabase();

  // js/customer.js
  var CustomerModule = class {
    constructor(app) {
      this.app = app;
      this.selectedCategory = "all";
      this.searchQuery = "";
      this.selectedPharmacyId = null;
      this.selectedMedicineId = null;
      this.pharmacySearchQuery = "";
      this.searchEngine = new IntelligentSearchEngine(MOCK_MEDICINES, MOCK_PHARMACIES);
    }
    // Main Router Renderer based on app state
    render() {
      const tab = this.app.state.customerTab;
      if (tab === "home") return this.renderHome();
      if (tab === "search") return this.renderSearchPage();
      if (tab === "pharmacies") return this.renderPharmaciesPage();
      if (tab === "pharmacy-detail") return this.renderPharmacyDetailPage();
      if (tab === "medicine-detail") return this.renderMedicineDetailPage();
      if (tab === "prescription") return this.renderPrescriptionPage();
      if (tab === "cart") return this.renderCartPage();
      if (tab === "orders") return this.renderOrdersPage();
      if (tab === "profile") return this.renderProfilePage();
      if (tab === "emergency") return this.renderEmergencyPage();
      return this.renderHome();
    }
    // 1. Home Feed
    renderHome() {
      const userLoc = googleMapsService.getUserLocation();
      const locState = googleMapsService.getLocationState();
      const pharmacies = googleMapsService.getPharmacies();
      const isSearchingGoogle = googleMapsService.isSearchingGoogle;
      const googleApiError = googleMapsService.googleApiError;
      const cartCount = this.app.getCartCount();
      const activeOrder = this.app.state.orders.find((o) => o.order_status !== "Delivered");
      return `
            <!-- Top Navbar -->
            <header class="navbar-top">
                <div class="brand-logo" onclick="MediApp.setCustomerTab('home')">
                    <div class="brand-icon"><i class="fa-solid fa-notes-medical"></i></div>
                    <div>
                        <span class="brand-text">MediFind</span>
                        <div style="font-size:9px; color:var(--text-muted); font-weight:600; white-space:nowrap; margin-top:-2px;">Find Medicines. Find Pharmacies. Get Care Faster.</div>
                    </div>
                </div>

                <div class="location-selector" onclick="MediApp.openAddressModal()">
                    <i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i>
                    <span>${locState.status === "detecting" ? "\u{1F4CD} Finding your location..." : userLoc.label}</span>
                    <button class="btn-secondary" style="padding:2px 8px; font-size:10px; margin-left:4px;" onclick="event.stopPropagation(); MediApp.openAddressModal()">Change</button>
                </div>

                <div class="top-actions">
                    <button class="icon-btn" onclick="MediApp.toggleTheme()" title="Toggle Dark/Light Mode">
                        <i class="fa-solid ${this.app.state.darkMode ? "fa-sun" : "fa-moon"}"></i>
                    </button>
                    <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')">
                        <i class="fa-solid fa-bag-shopping"></i>
                        ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ""}
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Location Status & Permission Banner -->
                ${this.renderLocationStateBanner(locState, userLoc)}

                <!-- Search Hero Banner -->
                <section class="search-hero" style="margin-top:12px; margin-bottom:16px;">
                    <h2 class="search-title">Fast 15-Minute Medicine Delivery \u26A1</h2>
                    <p class="search-subtitle">Order genuine medicines from verified nearby pharmacies at lowest prices</p>
                    
                    <div class="main-search-bar" onclick="MediApp.setCustomerTab('search')">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Search 'Dolo 650', 'Paracetamol', or generic name..." readonly>
                        <button class="voice-btn" onclick="event.stopPropagation(); MediApp.openVoiceSearchModal()" title="Voice Search">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                    </div>
                </section>

                <!-- Quick Mobile Action Grid (Primary Mobile Actions) -->
                <div class="quick-action-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="quick-action-card" onclick="MediApp.setCustomerTab('search')">
                        <div class="quick-action-icon" style="background:var(--primary-light); color:var(--primary);">
                            <i class="fa-solid fa-pills"></i>
                        </div>
                        <span class="quick-action-title">Search Medicine</span>
                    </div>
                    <div class="quick-action-card" onclick="MediApp.setCustomerTab('pharmacies')">
                        <div class="quick-action-icon" style="background:var(--warning-light); color:var(--warning-amber);">
                            <i class="fa-solid fa-store"></i>
                        </div>
                        <span class="quick-action-title">Pharmacies</span>
                    </div>
                    <div class="quick-action-card" onclick="MediApp.setCustomerTab('emergency')">
                        <div class="quick-action-icon" style="background:var(--emergency-light); color:var(--emergency-red);">
                            <i class="fa-solid fa-truck-medical"></i>
                        </div>
                        <span class="quick-action-title">Emergency</span>
                    </div>
                </div>

                ${activeOrder ? `
                    <!-- Active Live Order Banner -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; box-shadow:var(--shadow-md);">
                        <div>
                            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">ACTIVE LIVE ORDER</div>
                            <div style="font-size:16px; font-weight:800;">${activeOrder.id} - ${activeOrder.order_status}</div>
                            <div style="font-size:12px; opacity:0.9;">Estimated Arrival in 12 mins \u2022 Driver: ${activeOrder.delivery_partner.name}</div>
                        </div>
                        <button class="emergency-btn" onclick="MediApp.openTrackingModal('${activeOrder.id}')">
                            <i class="fa-solid fa-map-location-dot"></i> Live Track
                        </button>
                    </div>
                ` : ""}

                <!-- Categories -->
                <section style="margin-bottom: 24px;">
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-shapes" style="color:var(--primary);"></i> Medicine Categories</h3>
                    </div>
                    <div class="category-scroll">
                        ${MEDICINE_CATEGORIES.map((cat) => `
                            <div class="category-chip ${this.selectedCategory === cat.id ? "active" : ""}" 
                                 onclick="MediApp.filterCategory('${cat.id}')">
                                <i class="fa-solid ${cat.icon}"></i>
                                <span>${cat.name}</span>
                            </div>
                        `).join("")}
                    </div>
                </section>

                <!-- Nearby Pharmacies Horizontal Carousel (Google Places API) -->
                <section style="margin-bottom: 24px;">
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-store" style="color:var(--primary);"></i> Nearby Pharmacies</h3>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="MediApp.refreshNearbyPharmacies()">
                                <i class="fa-solid fa-arrows-rotate"></i> Refresh Nearby Pharmacies
                            </button>
                            <span class="see-all-link" onclick="MediApp.setCustomerTab('pharmacies')">View All (${pharmacies.length})</span>
                        </div>
                    </div>

                    ${isSearchingGoogle ? `
                        <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:10px;">
                            ${[1, 2, 3].map(() => `
                                <div style="flex:0 0 260px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; box-shadow:var(--shadow-sm); opacity:0.7;">
                                    <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:8px;">\u{1F50E} Finding nearby pharmacies...</div>
                                    <div style="height:14px; background:var(--card-border); border-radius:4px; margin-bottom:6px; width:80%;"></div>
                                    <div style="height:10px; background:var(--card-border); border-radius:4px; width:60%;"></div>
                                </div>
                            `).join("")}
                        </div>
                    ` : `
                        <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:10px; scrollbar-width:none;">
                            ${pharmacies.slice(0, 8).map((p) => `
                                <div style="flex:0 0 270px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; box-shadow:var(--shadow-sm); cursor:pointer; display:flex; flex-direction:column; justify-content:space-between;"
                                     onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                    <div>
                                        <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
                                            <img src="${p.logo}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;">
                                            <div style="flex:1;">
                                                <div style="font-weight:700; font-size:14px; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.shop_name}</div>
                                                <div style="font-size:11px; color:var(--text-muted);">${p.address ? p.address.split(",").slice(0, 2).join(",") : ""}</div>
                                            </div>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:8px;">
                                            <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 6px; border-radius:4px; font-weight:700;">
                                                \u2B50 ${p.rating} ${p.reviews_count ? `(${p.reviews_count})` : ""}
                                            </span>
                                            <span style="font-weight:800; color:${p.status === "open" ? "var(--secondary)" : "var(--emergency-red)"};">
                                                ${p.status === "open" ? "\u{1F7E2} Open" : "\u{1F534} Closed"}
                                            </span>
                                        </div>
                                        <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:8px;">
                                            \u{1F4CD} ${p.distance} away \u2022 \u26A1 ${p.delivery_time}
                                        </div>
                                    </div>

                                    <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="text-decoration:none; text-align:center; justify-content:center; padding:6px 10px; font-size:11px;" onclick="event.stopPropagation();">
                                        <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                    </a>
                                </div>
                            `).join("")}
                        </div>
                    `}
                </section>

                <!-- Popular Medicines Grid -->
                <section>
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-fire" style="color:var(--warning-amber);"></i> Trending Medicines</h3>
                        <span class="see-all-link" onclick="MediApp.setCustomerTab('search')">Browse All</span>
                    </div>
                    <div class="cards-grid">
                        ${this.renderMedicineCards(MOCK_MEDICINES.slice(0, 8))}
                    </div>
                </section>
            </main>

            ${this.renderBottomNav()}
            ${this.renderAiFab()}
        `;
    }
    // Render Location State & Permission Banner
    renderLocationStateBanner(locState, userLoc) {
      if (locState.status === "detecting") {
        return `
                <div style="background:var(--primary-light); color:var(--primary); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:18px;"></i>
                        <span style="font-weight:700; font-size:13px;">\u{1F4CD} Finding your location...</span>
                    </div>
                </div>
            `;
      }
      if (locState.status === "denied") {
        return `
                <div style="background:var(--card-bg); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-location-crosshairs" style="font-size:24px; color:var(--emergency-red);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Location access is required to find pharmacies near you.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">Please grant permission or enter your location manually to discover nearby medical stores.</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-location-arrow"></i> Allow Location
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
      }
      if (locState.status === "error") {
        return `
                <div style="background:var(--card-bg); border:1px solid var(--warning-amber); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Unable to detect your current location.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">${locState.errorMessage || "Please check your GPS or browser location permissions."}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-rotate-right"></i> Try Again
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
      }
      return `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; box-shadow:var(--shadow-md); border:1px solid rgba(255,255,255,0.1);">
                <div>
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800; color:var(--primary);">REAL-TIME GPS LOCATION</div>
                    <div style="font-size:15px; font-weight:800; margin-top:2px;">\u{1F4CD} ${userLoc.label} ${userLoc.accuracy ? `<span style="font-size:11px; opacity:0.7; font-weight:normal;">(\xB1${userLoc.accuracy}m)</span>` : ""}</div>
                    <div style="font-size:11px; opacity:0.8; margin-top:2px;">Showing real pharmacies & stock sorted strictly by distance</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="add-cart-btn" style="background:var(--primary); color:white; padding:8px 12px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> Refresh GPS
                    </button>
                    <button class="btn-secondary" style="background:rgba(255,255,255,0.1); color:white; padding:8px 12px; font-size:12px; border:none;" onclick="MediApp.openAddressModal()">
                        Change
                    </button>
                </div>
            </div>
        `;
    }
    // 2. All Pharmacies Page (/pharmacies)
    renderPharmaciesPage() {
      const userLoc = googleMapsService.getUserLocation();
      const pharmacies = googleMapsService.getPharmacies();
      const isSearchingGoogle = googleMapsService.isSearchingGoogle;
      const googleApiError = googleMapsService.googleApiError;
      const query = (this.pharmacySearchQuery || "").toLowerCase();
      const filteredPharmacies = pharmacies.filter(
        (p) => !query || p.shop_name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
      );
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Pharmacies Near You (${filteredPharmacies.length})</h2>
                <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="MediApp.refreshNearbyPharmacies()">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
            </header>

            <main class="main-content">
                <!-- Interactive Real-Time Google Maps Container -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:12px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:13px; font-weight:800; color:var(--primary);"><i class="fa-solid fa-map-location-dot"></i> Live Interactive Google Map \u2022 ${userLoc.label}</span>
                        <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="MediApp.detectLiveLocation()"><i class="fa-solid fa-location-crosshairs"></i> Refresh GPS</button>
                    </div>
                    <div id="nearbyPharmaciesMapCanvas" style="height:220px; width:100%; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--card-border);"></div>
                </div>

                <div style="margin-bottom:16px;">
                    <div class="main-search-bar" style="margin:0;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Search pharmacies by name or location..." value="${this.pharmacySearchQuery || ""}" oninput="MediApp.filterPharmacies(this.value)">
                    </div>
                </div>

                ${isSearchingGoogle ? `
                    <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                        <i class="fa-solid fa-spinner fa-spin" style="font-size:32px; color:var(--primary); margin-bottom:12px;"></i>
                        <h3>\u{1F50E} Finding nearby pharmacies...</h3>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        ${filteredPharmacies.map((p) => {
        const isFav = (this.app.state.favoritePharmacies || []).includes(p.id);
        return `
                                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; gap:14px; align-items:center; box-shadow:var(--shadow-sm); cursor:pointer;"
                                     onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                    <img src="${p.logo}" style="width:64px; height:64px; border-radius:var(--radius-md); object-fit:cover;">
                                    <div style="flex:1;">
                                        <div style="font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:space-between;">
                                            <span>${p.shop_name} <i class="fa-solid fa-circle-check" style="color:var(--primary); font-size:14px;" title="Verified License"></i></span>
                                            <button class="icon-btn" style="padding:4px; color:${isFav ? "var(--emergency-red)" : "var(--text-muted)"};" onclick="event.stopPropagation(); MediApp.toggleFavoritePharmacy('${p.id}')">
                                                <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                                            </button>
                                        </div>
                                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">${p.address}</div>
                                        <div style="display:flex; gap:10px; font-size:12px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
                                            <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-star"></i> ${p.rating} ${p.reviews_count ? `(${p.reviews_count})` : ""}</span>
                                            <span style="font-weight:700; color:var(--primary);">\u{1F4CD} ${p.distance} away</span>
                                            <span style="font-weight:800; color:${p.status === "open" ? "var(--secondary)" : "var(--emergency-red)"};">${p.status === "open" ? "\u{1F7E2} Open" : "\u{1F534} Closed"}</span>
                                        </div>
                                        ${p.phone ? `<div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-phone"></i> ${p.phone}</div>` : ""}
                                    </div>
                                    <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="text-decoration:none; padding:8px 12px; font-size:12px;" onclick="event.stopPropagation();">
                                        <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                    </a>
                                </div>
                            `;
      }).join("")}
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 3. Pharmacy Details Page (/pharmacy/:id)
    renderPharmacyDetailPage() {
      const pharmacies = googleMapsService.getPharmacies();
      const p = pharmacies.find((item) => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES.find((item) => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES[0];
      const pMedicines = MOCK_MEDICINES.filter((m) => m.pharmacy_id === p.id);
      const hasMediFindInventory = pMedicines.length > 0;
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('pharmacies')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">${p.shop_name}</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
                        <img src="${p.logo}" style="width:72px; height:72px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:20px;">${p.shop_name}</h2>
                            <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">${p.address}</div>
                            <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:4px;">\u{1F4CD} ${p.distance} away \u2022 \u2B50 ${p.rating} rating</div>
                            ${p.license_number ? `<div style="font-size:11px; color:var(--text-muted);">Drug License: <code>${p.license_number}</code></div>` : ""}
                        </div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        ${p.phone ? `
                            <a href="tel:${p.phone}" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                <i class="fa-solid fa-phone"></i> Call Pharmacy
                            </a>
                        ` : ""}
                        <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                        </a>
                    </div>
                </div>

                <h3 style="font-size:16px; margin-bottom:14px;">MediFind Medicine Inventory Status</h3>
                
                ${hasMediFindInventory ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(pMedicines)}
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); padding:24px; text-align:center; color:var(--text-muted);">
                        <i class="fa-solid fa-clipboard-question" style="font-size:36px; color:var(--text-muted); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; color:var(--text-main); margin-bottom:4px;">Medicine availability not available</h4>
                        <p style="font-size:12px;">This pharmacy is discovered via Google Places, but does not currently have registered real-time stock data in MediFind's database.</p>
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 4. Medicine Details Page (/medicine/:id)
    renderMedicineDetailPage() {
      const med = MOCK_MEDICINES.find((m) => m.id === this.selectedMedicineId) || MOCK_MEDICINES[0];
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('search')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Medicine Details</h2>
                <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')"><i class="fa-solid fa-bag-shopping"></i></button>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="height:220px; width:100%; border-radius:var(--radius-md); overflow:hidden; background:#f1f5f9; margin-bottom:16px; position:relative;">
                        <img src="${med.image}" style="width:100%; height:100%; object-fit:cover;">
                        ${med.requires_prescription ? `<span class="rx-badge">Rx PRESCRIPTION REQUIRED</span>` : ""}
                    </div>

                    <h1 style="font-size:22px; margin-bottom:4px;">${med.name}</h1>
                    <div style="font-size:14px; color:var(--primary); font-weight:700; margin-bottom:12px;">Generic: ${med.generic_name}</div>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--background); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:16px;">
                        <div>
                            <span class="current-price" style="font-size:24px;">\u20B9${med.price.toFixed(2)}</span>
                            <span class="original-price" style="font-size:14px; margin-left:8px;">\u20B9${(med.original_price || med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <span style="color:var(--secondary); font-weight:800; font-size:13px;">In Stock (${med.stock} units)</span>
                    </div>

                    <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
                        <strong>Description:</strong> ${med.description}<br><br>
                        <strong>Dosage:</strong> ${med.dosage}<br>
                        <strong>Manufacturer:</strong> ${med.manufacturer || "Certified Pharma"}<br>
                        <strong>Expiry Date:</strong> ${med.expiry_date || "2027-12"}<br>
                        <strong>Side Effects:</strong> ${med.side_effects || "Mild dizziness, nausea"}
                    </div>

                    <div style="display:flex; gap:12px;">
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add To Cart
                        </button>
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);" onclick="MediApp.buyNow('${med.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 5. Prescription Upload Page (/prescription)
    renderPrescriptionPage() {
      const scanned = this.ocrResults || null;
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Upload Doctor Prescription</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); margin-bottom:20px;">
                    <h3 style="font-size:16px; margin-bottom:12px;">Choose Prescription Upload Source</h3>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:16px;">
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('camera')">
                            <i class="fa-solid fa-camera" style="font-size:24px; color:var(--primary);"></i>
                            <span style="font-size:12px; font-weight:700;">Camera Snap</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('gallery')">
                            <i class="fa-solid fa-image" style="font-size:24px; color:var(--secondary);"></i>
                            <span style="font-size:12px; font-weight:700;">Photo Gallery</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('pdf')">
                            <i class="fa-solid fa-file-pdf" style="font-size:24px; color:var(--warning-amber);"></i>
                            <span style="font-size:12px; font-weight:700;">PDF File</span>
                        </button>
                    </div>

                    <div style="border:2px dashed var(--primary); background:var(--primary-light); padding:24px 16px; border-radius:var(--radius-md); text-align:center; cursor:pointer;" onclick="MediApp.simulateOcrScan('gallery')">
                        <i class="fa-solid fa-wand-magic-sparkles" style="font-size:36px; color:var(--primary); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; margin-bottom:4px;">Drag & Drop Prescription Document</h4>
                        <p style="font-size:12px; color:var(--text-muted);">AI OCR will automatically parse doctor handwriting, match inventory, and calculate confidence</p>
                    </div>
                </div>

                ${scanned ? `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--card-border); padding-bottom:10px;">
                            <div>
                                <h3 style="font-size:16px;"><i class="fa-solid fa-receipt" style="color:var(--primary);"></i> AI OCR Extracted Prescription</h3>
                                <div style="font-size:12px; color:var(--text-muted);">${scanned.doctor} \u2022 Patient: ${scanned.patient}</div>
                            </div>
                            <span style="background:var(--secondary-light); color:var(--secondary); padding:4px 10px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">4 Items Found</span>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            ${scanned.items.map((item, idx) => `
                                <div style="background:${item.isLowConfidence ? "var(--warning-light)" : "var(--background)"}; border:1px solid ${item.isLowConfidence ? "var(--warning-amber)" : "var(--card-border)"}; padding:14px; border-radius:var(--radius-md);">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <strong style="font-size:14px;">${item.name}</strong>
                                            ${item.isLowConfidence ? `
                                                <span style="background:var(--warning-amber); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-triangle-exclamation"></i> Low Confidence (${item.confidence}%)
                                                </span>
                                            ` : `
                                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-circle-check"></i> ${item.confidence}% Verified
                                                </span>
                                            `}
                                        </div>
                                    </div>

                                    <!-- Manual Correction Input -->
                                    <div style="display:flex; gap:10px; align-items:center; margin-top:8px;">
                                        <div style="flex:2;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">MANUAL CORRECTION</label>
                                            <input type="text" value="${item.name}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                        <div style="flex:1;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">QTY (STRIPS)</label>
                                            <input type="number" value="${item.qty}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.addPrescriptionItemsToCart()">
                            <i class="fa-solid fa-cart-plus"></i> Automatically Add All Matched Medicines to Cart
                        </button>
                    </div>
                ` : ""}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 6. Cart & Checkout Page (/cart)
    renderCartPage() {
      const subtotal = this.app.state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const deliveryFee = subtotal > 0 ? subtotal > 200 ? 0 : 25 : 0;
      const discount = this.app.state.appliedCoupon ? subtotal * 0.2 : 0;
      const tax = subtotal * 0.05;
      const total = Math.max(0, subtotal + deliveryFee + tax - discount);
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Shopping Cart (${this.app.getCartCount()} items)</h2>
            </header>

            <main class="main-content">
                ${this.app.state.cart.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px;">
                        <i class="fa-solid fa-basket-shopping" style="font-size:64px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:18px; margin-bottom:8px;">Your Cart is Empty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Search medicines from nearby pharmacies to add items.</p>
                        <button class="add-cart-btn" onclick="MediApp.setCustomerTab('search')">Browse Medicines</button>
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px;">Items in Cart</h3>
                            <button class="btn-secondary" style="font-size:11px; padding:4px 8px; color:var(--emergency-red);" onclick="MediApp.clearCart()"><i class="fa-solid fa-trash"></i> Clear All</button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            ${this.app.state.cart.map((item) => `
                                <div style="display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
                                    <img src="${item.image}" style="width:52px; height:52px; border-radius:var(--radius-sm); object-fit:cover;">
                                    <div style="flex:1;">
                                        <div style="font-weight:700; font-size:15px;">${item.name}</div>
                                        <div style="font-size:13px; color:var(--primary); font-weight:700;">\u20B9${item.price.toFixed(2)}</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:10px; background:var(--background); padding:6px 12px; border-radius:var(--radius-full);">
                                        <button onclick="MediApp.updateCartQty('${item.id}', -1)" style="font-weight:800; font-size:16px;">-</button>
                                        <span style="font-weight:700; font-size:14px;">${item.quantity}</span>
                                        <button onclick="MediApp.updateCartQty('${item.id}', 1)" style="font-weight:800; font-size:16px;">+</button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>

                        <!-- Delivery Address Input -->
                        <div style="margin-bottom:16px;">
                            <label style="font-size:12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">DELIVERY ADDRESS</label>
                            <input type="text" id="deliveryAddressInput" value="${(() => {
        const u = this.app.authService.getUser();
        if (!u || !u.address) return googleMapsService.getUserLocation().label;
        return typeof u.address === "string" ? u.address : `${u.address.street || ""}, ${u.address.city || ""}`;
      })()}" 
                                   style="width:100%; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-md); font-size:13px;">
                        </div>

                        <!-- Bill Summary -->
                        <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Subtotal</span><span>\u20B9${subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Delivery Charge</span><span>${deliveryFee === 0 ? '<span style="color:var(--secondary); font-weight:700;">FREE</span>' : "\u20B9" + deliveryFee}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Taxes (GST 5%)</span><span>\u20B9${tax.toFixed(2)}</span>
                            </div>
                            <div style="border-top:1px dashed var(--card-border); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:16px;">
                                <span>Total Amount</span><span style="color:var(--primary);">\u20B9${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:16px;" onclick="MediApp.simulateRazorpayCheckout(${total})">
                            <i class="fa-solid fa-lock"></i> Place Order \u2022 \u20B9${total.toFixed(2)}
                        </button>
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // Helper render helpers
    renderMedicineCards(medList) {
      const enriched = this.searchEngine.enrichMedicines(medList);
      return enriched.map((med) => {
        const isOpen = med.pharmacy_status === "open";
        const inStock = med.stock > 0;
        const isGoogleDiscovered = med.isGooglePlaceUnregistered;
        return `
                <div class="med-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                    <div>
                        <div class="med-img-wrapper" onclick="MediApp.viewMedicineDetails('${med.id}')">
                            <img src="${med.image}" alt="${med.name}">
                            ${med.requires_prescription ? `<span class="rx-badge">Rx REQUIRED</span>` : ""}
                            <span class="discount-tag">15% OFF</span>
                        </div>

                        <!-- 1. Medicine Brand Name -->
                        <div class="med-title" onclick="MediApp.viewMedicineDetails('${med.id}')">${med.name}</div>
                        
                        <!-- 2. Generic Name -->
                        <div class="med-generic" style="color:var(--primary); font-weight:600; font-size:12px; margin-bottom:4px;">
                            \u{1F9EA} ${med.generic_name}
                        </div>

                        <!-- 4. Manufacturer -->
                        <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
                            \u{1F3E2} Mfr: <strong>${med.manufacturer}</strong>
                        </div>

                        <!-- 5. Stock Status / Google Unregistered Notice -->
                        <div style="font-size:11px; font-weight:700; margin-bottom:8px; color:${isGoogleDiscovered ? "var(--text-muted)" : inStock ? "var(--secondary)" : "var(--emergency-red)"};">
                            ${isGoogleDiscovered ? "\u26A0\uFE0F Medicine availability not available" : inStock ? `\u{1F4E6} In Stock (${med.stock} units)` : "\u{1F4E6} Out of Stock"}
                        </div>

                        <!-- 6. Pharmacy, 7. Distance, 8. Open/Closed, 9. Rating, 10. Delivery -->
                        <div style="background:var(--background); padding:8px 10px; border-radius:var(--radius-sm); font-size:11px; margin-bottom:10px; display:flex; flex-direction:column; gap:3px;">
                            <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-main);">
                                <span><i class="fa-solid fa-store" style="color:var(--primary);"></i> ${med.pharmacy_name}</span>
                                <span>\u{1F4CD} ${med.pharmacy_distance}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:${isOpen ? "var(--secondary)" : "var(--emergency-red)"}; font-weight:800;">
                                    \u25CF ${isOpen ? "OPEN NOW" : "CLOSED"}
                                </span>
                                <span style="background:var(--warning-light); color:var(--warning-amber); padding:1px 5px; border-radius:3px; font-weight:800;">
                                    \u2B50 ${med.pharmacy_rating}
                                </span>
                            </div>
                            <div style="color:var(--primary); font-weight:700; margin-top:2px;">
                                \u26A1 ${med.pharmacy_delivery_available ? `Delivery Available (${med.delivery_time})` : "Pickup Only"}
                            </div>
                        </div>
                    </div>

                    <!-- 3. Price & Action -->
                    <div class="med-price-row" style="margin-top:auto;">
                        <div class="price-box">
                            <span class="current-price">\u20B9${med.price.toFixed(2)}</span>
                            <span class="original-price">\u20B9${(med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <button class="add-cart-btn" ${!inStock || isGoogleDiscovered ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ""} onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
      }).join("");
    }
    renderBottomNav() {
      const tab = this.app.state.customerTab;
      return `
            <nav class="bottom-nav">
                <a href="#" class="nav-item ${tab === "home" ? "active" : ""}" onclick="MediApp.setCustomerTab('home')">
                    <i class="fa-solid fa-house"></i><span>Home</span>
                </a>
                <a href="#" class="nav-item ${tab === "search" ? "active" : ""}" onclick="MediApp.setCustomerTab('search')">
                    <i class="fa-solid fa-magnifying-glass"></i><span>Search</span>
                </a>
                <a href="#" class="nav-item ${tab === "pharmacies" ? "active" : ""}" onclick="MediApp.setCustomerTab('pharmacies')">
                    <i class="fa-solid fa-store"></i><span>Pharmacies</span>
                </a>
                <a href="#" class="nav-item ${tab === "orders" ? "active" : ""}" onclick="MediApp.setCustomerTab('orders')">
                    <i class="fa-solid fa-receipt"></i><span>Orders</span>
                </a>
                <a href="#" class="nav-item ${tab === "profile" ? "active" : ""}" onclick="MediApp.setCustomerTab('profile')">
                    <i class="fa-solid fa-user"></i><span>Profile</span>
                </a>
            </nav>
        `;
    }
    renderAiFab() {
      return `
            <button class="ai-fab" onclick="MediApp.openAiDrawer()">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Ask MediAI</span>
            </button>
        `;
    }
    renderSearchPage() {
      const dbMeds = Array.from(firestoreDb.collections.Medicines.values());
      const allMedicines = dbMeds.length > 0 ? dbMeds : this.app.state.medicines;
      const pharmacies = googleMapsService.getPharmacies();
      this.searchEngine.setDatasets(allMedicines, pharmacies);
      const { results, spellingCorrection, alternatives } = this.searchEngine.search(this.searchQuery, this.selectedCategory);
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <div style="flex:1;">
                    <div class="main-search-bar" style="margin:0;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="mainSearchInputField" placeholder="Search brand, generic name (e.g. Paracetamol, Dolo 650)..." value="${this.searchQuery}" oninput="MediApp.handleSearchInput(this.value)">
                    </div>
                </div>
            </header>

            <main class="main-content">
                ${spellingCorrection ? `
                    <div style="background:var(--primary-light); color:var(--primary); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Did you mean <strong style="text-decoration:underline; cursor:pointer;" onclick="MediApp.handleSearchInput('${spellingCorrection}')">"${spellingCorrection}"</strong>?</span>
                    </div>
                ` : ""}

                ${results.length > 0 ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(results)}
                    </div>
                ` : `
                    <div style="text-align:center; padding:30px 20px;">
                        <i class="fa-solid fa-magnifying-glass-minus" style="font-size:42px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:18px;">No exact match found for "${this.searchQuery}"</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">We searched brand names, generic chemical compositions, and nearby pharmacy stock.</p>
                    </div>
                `}

                ${alternatives && alternatives.length > 0 ? `
                    <div style="margin-top:24px; background:var(--secondary-light); border:1px solid var(--secondary); border-radius:var(--radius-lg); padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h3 style="font-size:16px; color:var(--secondary-hover); font-weight:800;"><i class="fa-solid fa-lightbulb"></i> Recommended Generic Alternatives</h3>
                            <span style="background:var(--secondary); color:white; padding:3px 8px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">SAVE ~25%</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-body); margin-bottom:14px;">Same active chemical composition available in stock at nearby pharmacies:</p>
                        <div class="cards-grid">
                            ${this.renderMedicineCards(alternatives)}
                        </div>
                    </div>
                ` : ""}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    renderOrdersPage() {
      const currentUser = this.app.authService.getUser();
      let userOrders = [];
      if (currentUser) {
        userOrders = this.app.state.orders.filter(
          (o) => o.user_id === currentUser.id || o.customer_id === currentUser.id || o.customer_email && o.customer_email.toLowerCase() === currentUser.email.toLowerCase()
        );
      } else {
        userOrders = this.app.state.orders.filter((o) => o.user_id && o.user_id.startsWith("usr_guest_"));
      }
      return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Orders History</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                ${userOrders.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
                        <i class="fa-solid fa-box-open" style="font-size:48px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:16px; margin-bottom:4px; color:var(--text-main);">No Orders Placed Yet</h3>
                        <p style="font-size:12px;">Your order history will appear here once you place your first medicine order.</p>
                    </div>
                ` : userOrders.map((o) => {
        const isCompleted = o.order_status === "Delivered";
        const isCancelled = o.order_status === "Cancelled";
        const isActive = !isCompleted && !isCancelled;
        return `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:18px; margin-bottom:14px; box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div>
                                    <span style="font-weight:800; color:var(--primary); font-size:16px;">${o.id}</span>
                                    <div style="font-size:11px; color:var(--text-muted);">${new Date(o.created_at || Date.now()).toLocaleDateString()}</div>
                                </div>
                                <span class="role-badge-btn" style="background:${isCancelled ? "var(--emergency-light)" : isCompleted ? "var(--secondary-light)" : "var(--primary-light)"}; color:${isCancelled ? "var(--emergency-red)" : isCompleted ? "var(--secondary)" : "var(--primary)"};">${o.order_status}</span>
                            </div>

                            <div style="font-size:13px; margin-bottom:12px; background:var(--background); padding:10px; border-radius:var(--radius-sm);">
                                ${o.items.map((it) => `<div>\u2022 <b>${it.quantity}x ${it.name}</b> \u2014 \u20B9${(it.price * it.quantity).toFixed(2)}</div>`).join("")}
                                <div style="margin-top:6px; font-weight:800; text-align:right; color:var(--text-main);">Total: \u20B9${o.total_amount.toFixed(2)}</div>
                            </div>

                            <div style="display:flex; gap:8px; justify-content:flex-end;">
                                ${isActive ? `
                                    <button class="add-cart-btn" onclick="MediApp.openTrackingModal('${o.id}')"><i class="fa-solid fa-map-location-dot"></i> Live Track</button>
                                    <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.cancelOrder('${o.id}')"><i class="fa-solid fa-ban"></i> Cancel Order</button>
                                ` : `
                                    <button class="add-cart-btn" style="background:var(--secondary);" onclick="MediApp.reorder('${o.id}')"><i class="fa-solid fa-rotate-right"></i> Reorder Items</button>
                                `}
                            </div>
                        </div>
                    `;
      }).join("")}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    renderProfilePage() {
      const user = this.app.authService.getUser() || { name: "Customer User", email: "user@example.com", phone: "+91 98765 43210" };
      const savedAddresses = this.app.state.savedAddresses || [];
      const pharmacies = googleMapsService.getPharmacies();
      const favoritePharmacies = pharmacies.filter((p) => (this.app.state.favoritePharmacies || []).includes(p.id));
      return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Customer Account</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- User Profile Card -->
                <div style="background:var(--card-bg); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; align-items:center; gap:16px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:64px; height:64px; border-radius:var(--radius-full); object-fit:cover;">
                    <div style="flex:1;">
                        <h3 style="font-size:18px; margin-bottom:2px;">${user.name}</h3>
                        <div style="font-size:12px; color:var(--text-muted);">${user.phone} \u2022 ${user.email}</div>
                    </div>
                    <button class="btn-secondary" style="color:var(--emergency-red); padding:8px 12px; font-size:12px;" onclick="MediApp.logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>

                <!-- Saved Addresses Section -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="font-size:16px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Saved Delivery Addresses</h3>
                        <button class="add-cart-btn" style="padding:6px 12px; font-size:12px;" onclick="MediApp.openAddressModal()"><i class="fa-solid fa-plus"></i> Add Address</button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${savedAddresses.map((addr) => `
                            <div style="padding:12px; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--background); display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <strong style="font-size:13px;"><i class="fa-solid fa-house"></i> ${addr.label}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${addr.text}</div>
                                </div>
                                <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.showToast('Address selected as default')">Default</button>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Profile Options List -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:8px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.setCustomerTab('orders')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-box-archive" style="color:var(--primary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">My Orders History</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openAddressModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-map-location-dot" style="color:var(--secondary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Saved Addresses</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.setCustomerTab('prescription')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-file-prescription" style="color:var(--warning-amber); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Prescription History</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openNotificationsModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-bell" style="color:#9333ea; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Notifications</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openHelpSupportModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-question" style="color:#0ea5e9; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Help & Support</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; cursor:pointer;" onclick="MediApp.openAboutModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-info" style="color:var(--text-muted); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">About MediFind</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>
                </div>

                <!-- Saved Favorite Pharmacies -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px;">
                    <h3 style="font-size:16px; margin-bottom:12px;"><i class="fa-solid fa-heart" style="color:var(--emergency-red);"></i> Favorite Pharmacies</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${favoritePharmacies.length === 0 ? `
                            <div style="font-size:12px; color:var(--text-muted);">No favorite pharmacies saved yet. Click the heart icon on any pharmacy to save it.</div>
                        ` : favoritePharmacies.map((p) => `
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <div>
                                    <strong>${p.shop_name}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${p.address} \u2022 \u{1F4CD} ${p.distance}</div>
                                </div>
                                <button class="btn-secondary" onclick="MediApp.viewPharmacyDetails('${p.id}')">Visit Store</button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 9. Emergency 24/7 Pharmacy View
    renderEmergencyPage() {
      const userLoc = googleMapsService.getUserLocation();
      const pharmacies = googleMapsService.getPharmacies();
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1; color:var(--emergency-red);"><i class="fa-solid fa-truck-medical"></i> Emergency 24/7 Pharmacies</h2>
                <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="MediApp.refreshNearbyPharmacies()">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
            </header>

            <main class="main-content">
                <div style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:10px; color:var(--emergency-red); font-weight:800; font-size:15px; margin-bottom:4px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> Emergency Medical Support Active
                    </div>
                    <div style="font-size:12px; color:var(--text-body);">
                        Showing open 24/7 verified emergency pharmacies near <strong>${userLoc.label}</strong>. Call directly for urgent medicine supply.
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${pharmacies.map((p) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                <div style="display:flex; gap:12px; align-items:center;">
                                    <img src="${p.logo}" style="width:54px; height:54px; border-radius:var(--radius-md); object-fit:cover;">
                                    <div>
                                        <div style="font-weight:800; font-size:16px; color:var(--text-main);">${p.shop_name}</div>
                                        <div style="font-size:12px; color:var(--text-muted);">${p.address}</div>
                                    </div>
                                </div>
                                <span style="background:var(--secondary-light); color:var(--secondary); font-weight:800; font-size:11px; padding:4px 8px; border-radius:4px; white-space:nowrap;">
                                    \u{1F7E2} OPEN 24/7
                                </span>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:700; color:var(--primary); margin-bottom:14px; background:var(--background); padding:8px 12px; border-radius:var(--radius-sm);">
                                <span>\u{1F4CD} ${p.distance} away from you</span>
                                <span>\u2B50 ${p.rating} (${p.reviews_count || 12} reviews)</span>
                            </div>

                            <div style="display:flex; gap:10px;">
                                ${p.phone ? `
                                    <a href="tel:${p.phone}" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                ` : `
                                    <a href="tel:+919876543210" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                `}
                                <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                    <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                </a>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
  };

  // js/pharmacy.js
  var PharmacyModule = class {
    constructor(app) {
      this.app = app;
      this.activeTab = "dashboard";
    }
    render() {
      const myPharmacyId = "pharm_1";
      const myPharmacy = this.app.state.pharmacies.find((p) => p.id === myPharmacyId) || this.app.state.pharmacies[0];
      const myMedicines = this.app.state.medicines.filter((m) => m.pharmacy_id === myPharmacyId || !m.pharmacy_id);
      const myOrders = this.app.state.orders.filter((o) => o.pharmacy_id === myPharmacyId || !o.pharmacy_id);
      const lowStockCount = myMedicines.filter((m) => m.stock < 20).length;
      const pendingOrders = myOrders.filter((o) => o.order_status === "Order Placed" || o.order_status === "Pending");
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);"><i class="fa-solid fa-clinic-medical"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">${myPharmacy.shop_name}</span>
                        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-certificate" style="color:var(--primary);"></i> License: ${myPharmacy.license_number}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: PHARMACY
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? "fa-sun" : "fa-moon"}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar (7 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === "dashboard" ? "active" : ""}" 
                            style="${this.activeTab === "dashboard" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('dashboard')">
                        <i class="fa-solid fa-chart-line"></i> Dashboard
                    </button>
                    <button class="btn-secondary ${this.activeTab === "inventory" ? "active" : ""}" 
                            style="${this.activeTab === "inventory" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('inventory')">
                        <i class="fa-solid fa-boxes-stacked"></i> Inventory (${myMedicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "orders" ? "active" : ""}" 
                            style="${this.activeTab === "orders" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('orders')">
                        <i class="fa-solid fa-box"></i> Orders (${myOrders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "sales" ? "active" : ""}" 
                            style="${this.activeTab === "sales" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('sales')">
                        <i class="fa-solid fa-receipt"></i> Sales Ledger
                    </button>
                    <button class="btn-secondary ${this.activeTab === "analytics" ? "active" : ""}" 
                            style="${this.activeTab === "analytics" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('analytics')">
                        <i class="fa-solid fa-chart-pie"></i> Analytics
                    </button>
                    <button class="btn-secondary ${this.activeTab === "notifications" ? "active" : ""}" 
                            style="${this.activeTab === "notifications" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('notifications')">
                        <i class="fa-solid fa-bell"></i> Alerts (${pendingOrders.length + lowStockCount})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "profile" ? "active" : ""}" 
                            style="${this.activeTab === "profile" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('profile')">
                        <i class="fa-solid fa-store"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders)}
            </main>
        `;
    }
    renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders) {
      if (this.activeTab === "dashboard") {
        const todayRevenue = myOrders.reduce((sum, o) => sum + o.total_amount, 0);
        return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                        <div>
                            <div class="metric-val">\u20B9${todayRevenue.toFixed(2)}</div>
                            <div class="metric-lbl">Total Pharmacy Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-bag-shopping"></i></div>
                        <div>
                            <div class="metric-val">${myOrders.length}</div>
                            <div class="metric-lbl">Total Orders Received</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-clock"></i></div>
                        <div>
                            <div class="metric-val">${pendingOrders.length}</div>
                            <div class="metric-lbl">Pending Order Actions</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div>
                            <div class="metric-val">${lowStockCount}</div>
                            <div class="metric-lbl">Low Stock Alerts</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('orders')"><i class="fa-solid fa-box"></i> View Incoming Orders (${pendingOrders.length})</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('analytics')"><i class="fa-solid fa-chart-line"></i> Sales Performance</button>
                </div>

                <!-- Recent Incoming Orders -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:14px;"><i class="fa-solid fa-bell-concierge" style="color:var(--primary);"></i> Live Pending Orders</h3>
                    ${pendingOrders.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">
                            <i class="fa-solid fa-circle-check" style="font-size:32px; color:var(--secondary); margin-bottom:8px;"></i>
                            <p>All incoming customer orders have been processed!</p>
                        </div>
                    ` : pendingOrders.map((order) => `
                        <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div>
                                    <strong style="color:var(--primary); font-size:15px;">${order.id}</strong>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">${order.customer_name} (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn" style="background:var(--warning-light); color:var(--warning-amber);">${order.order_status}</span>
                            </div>
                            <div style="font-size:13px; margin-bottom:12px;">
                                Items: ${order.items.map((it) => `<b>${it.quantity}x ${it.name}</b>`).join(", ")}<br>
                                Delivery Address: <span>${order.customer_address}</span>
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="add-cart-btn" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept Order</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "inventory") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Inventory Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage stock quantities, prices, and product availability instantly</p>
                    </div>
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Medicine & Composition</th>
                                <th>Category</th>
                                <th>Unit Price (\u20B9)</th>
                                <th>Live Stock Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myMedicines.map((m) => `
                                <tr>
                                    <td>
                                        <strong>${m.name}</strong><br>
                                        <span style="font-size:11px; color:var(--primary);">\u{1F9EA} ${m.generic_name}</span><br>
                                        <span style="font-size:10px; color:var(--text-muted);">\u{1F3E2} ${m.manufacturer || "Micro Labs"}</span>
                                    </td>
                                    <td><span style="background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">${m.category}</span></td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:4px;">
                                            \u20B9<input type="number" value="${m.price}" step="0.5" style="width:70px; padding:4px; border:1px solid var(--card-border); border-radius:4px; font-size:13px; font-weight:700;" onchange="MediApp.updatePrice('${m.id}', this.value)">
                                        </div>
                                    </td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <input type="number" value="${m.stock}" style="width:65px; padding:4px; border:1px solid ${m.stock < 20 ? "var(--emergency-red)" : "var(--card-border)"}; border-radius:4px; font-size:13px; font-weight:800; color:${m.stock < 20 ? "var(--emergency-red)" : "var(--text-main)"};" onchange="MediApp.updateStock('${m.id}', this.value)">
                                            <span style="font-size:11px; color:var(--text-muted);">units</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:${m.stock > 0 ? "var(--secondary)" : "var(--emergency-red)"}; font-weight:800;" onclick="MediApp.toggleAvailability('${m.id}')">
                                            \u25CF ${m.stock > 0 ? "Available" : "Unavailable"}
                                        </button>
                                    </td>
                                    <td>
                                        <div style="display:flex; gap:6px;">
                                            <button class="btn-secondary" title="Edit Medicine" onclick="MediApp.editMedicine('${m.id}')"><i class="fa-solid fa-pen"></i></button>
                                            <button class="btn-secondary" style="color:var(--emergency-red);" title="Delete" onclick="MediApp.deleteMedicine('${m.id}')"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "orders") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Orders Processing Center</h3>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${myOrders.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No orders found.</div>
                    ` : myOrders.map((order) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:18px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <div>
                                    <span style="font-weight:800; color:var(--primary); font-size:16px;">${order.id}</span>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: <strong>${order.customer_name}</strong> (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn">${order.order_status}</span>
                            </div>
                            <div style="background:var(--background); padding:12px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:14px;">
                                <strong>Order Items:</strong>
                                <ul>
                                    ${order.items.map((it) => `<li>${it.quantity}x <b>${it.name}</b> \u2014 \u20B9${(it.price * it.quantity).toFixed(2)}</li>`).join("")}
                                </ul>
                                <div style="margin-top:6px; text-align:right; font-weight:800; font-size:14px; color:var(--primary);">Total: \u20B9${order.total_amount.toFixed(2)}</div>
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="btn-secondary" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept & Prepare</button>
                                <button class="add-cart-btn" onclick="MediApp.updateOrderStatus('${order.id}', 'Ready For Pickup')"><i class="fa-solid fa-box"></i> Ready For Pickup</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "sales") {
        const completedOrders = myOrders.filter((o) => o.order_status === "Delivered" || o.payment_status === "Paid");
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Sales Ledger</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Completed transactions and financial logs</p>
                    </div>
                    <div style="font-size:18px; font-weight:800; color:var(--secondary);">Total Sales: \u20B9${totalRevenue.toFixed(2)}</div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Payment Method</th>
                                <th>Amount (\u20B9)</th>
                                <th>Payment Status</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedOrders.map((o) => `
                                <tr>
                                    <td><strong>${o.id}</strong></td>
                                    <td>${o.customer_name}</td>
                                    <td><span style="font-weight:700;">\u{1F4B3} ${o.payment_method || "UPI"}</span></td>
                                    <td><strong style="color:var(--secondary);">\u20B9${o.total_amount.toFixed(2)}</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">Paid</span></td>
                                    <td><span class="role-badge-btn">${o.order_status}</span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "analytics") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Sales & Inventory Performance Analytics</h3>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Weekly Revenue Trend (\u20B9)</h4>
                        <canvas id="salesChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Category Sales Breakdown</h4>
                        <canvas id="categoryChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "notifications") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Real-Time Notifications & Stock Alerts</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${lowStockCount > 0 ? `
                        <div style="background:var(--warning-light); border:1px solid var(--warning-amber); padding:16px; border-radius:var(--radius-md); display:flex; gap:12px; align-items:center;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                            <div>
                                <strong style="color:var(--warning-amber);">Low Stock Warning</strong>
                                <div style="font-size:12px;">You have ${lowStockCount} medicines with stock quantity below 20 units. Please restock inventory.</div>
                            </div>
                        </div>
                    ` : ""}

                    ${pendingOrders.map((o) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); padding:16px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; gap:12px; align-items:center;">
                                <i class="fa-solid fa-bell" style="font-size:20px; color:var(--primary);"></i>
                                <div>
                                    <strong>New Order Received: ${o.id}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${o.customer_name} placed an order for \u20B9${o.total_amount.toFixed(2)}</div>
                                </div>
                            </div>
                            <button class="add-cart-btn" onclick="MediApp.setPharmacyTab('orders')">Process Order</button>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "profile") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Store Configuration & License Details</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
                        <img src="${myPharmacy.logo}" style="width:90px; height:90px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:22px; margin-bottom:4px;">${myPharmacy.shop_name}</h2>
                            <div style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">Owner: <strong>${myPharmacy.owner_name}</strong></div>
                            <div style="font-size:12px; color:var(--secondary); font-weight:800;"><i class="fa-solid fa-circle-check"></i> Drug License Verified \u2022 DL-2023-APO891</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Pharmacy Address</label>
                            <input type="text" value="${myPharmacy.address}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div style="display:flex; gap:12px;">
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">GST Number</label>
                                <input type="text" value="${myPharmacy.gst || "07AAAAA0000A1Z5"}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">Phone Number</label>
                                <input type="text" value="${myPharmacy.phone}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; margin-top:10px;" onclick="MediApp.showToast('Pharmacy profile updated successfully!')">
                            <i class="fa-solid fa-floppy-disk"></i> Save Profile Settings
                        </button>
                    </div>
                </div>
            `;
      }
    }
    initCharts() {
      if (this.activeTab !== "analytics") return;
      const salesCtx = document.getElementById("salesChart");
      const catCtx = document.getElementById("categoryChart");
      if (salesCtx && typeof Chart !== "undefined") {
        new Chart(salesCtx, {
          type: "bar",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
              label: "Sales Revenue (\u20B9)",
              data: [4200, 5800, 6900, 8100, 9400, 12500, 14850],
              backgroundColor: "#16a34a",
              borderRadius: 6
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
      if (catCtx && typeof Chart !== "undefined") {
        new Chart(catCtx, {
          type: "doughnut",
          data: {
            labels: ["Pain Relief", "Antibiotics", "Diabetes", "Cardiac", "Vitamins"],
            datasets: [{
              data: [35, 25, 20, 12, 8],
              backgroundColor: ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]
            }]
          },
          options: { responsive: true }
        });
      }
    }
  };

  // js/delivery.js
  var DeliveryModule = class {
    constructor(app) {
      this.app = app;
      this.activeTab = "tasks";
      this.isOnDuty = true;
      this.driverInfo = {
        id: "partner_1",
        name: "Rohan Verma",
        vehicle: "Hero Splendor (KA-01-EQ-9982)",
        phone: "+91 98112 33445",
        rating: 4.9,
        earnings_today: 850,
        base_pay: 600,
        tips: 150,
        bonus: 100,
        total_deliveries: 482
      };
    }
    render() {
      const assignedOrder = this.app.state.orders.find((o) => o.delivery_partner && o.delivery_partner.id === "partner_1" && o.order_status !== "Delivered" && o.order_status !== "Cancelled");
      const completedDeliveries = this.app.state.orders.filter((o) => o.order_status === "Delivered");
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-motorcycle"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">MediExpress Driver</span>
                        <div style="font-size:11px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="btn-secondary" style="padding:6px 12px; font-size:11px; font-weight:800; color:${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"}; border:2px solid ${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"};" onclick="MediApp.toggleDriverDuty()">
                        \u25CF ${this.isOnDuty ? "ON DUTY (Online)" : "OFF DUTY (Offline)"}
                    </button>
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: DRIVER
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Bar (4 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px;">
                    <button class="btn-secondary ${this.activeTab === "tasks" ? "active" : ""}" 
                            style="${this.activeTab === "tasks" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('tasks')">
                        <i class="fa-solid fa-map-location-dot"></i> Active Tasks (${assignedOrder ? 1 : 0})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "earnings" ? "active" : ""}" 
                            style="${this.activeTab === "earnings" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('earnings')">
                        <i class="fa-solid fa-indian-rupee-sign"></i> Earnings
                    </button>
                    <button class="btn-secondary ${this.activeTab === "history" ? "active" : ""}" 
                            style="${this.activeTab === "history" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('history')">
                        <i class="fa-solid fa-clock-rotate-left"></i> History (${completedDeliveries.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "profile" ? "active" : ""}" 
                            style="${this.activeTab === "profile" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('profile')">
                        <i class="fa-solid fa-id-card"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(assignedOrder, completedDeliveries)}
            </main>
        `;
    }
    renderActiveTab(assignedOrder, completedDeliveries) {
      if (this.activeTab === "tasks") {
        if (!this.isOnDuty) {
          return `
                    <div style="text-align:center; padding:60px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-moon" style="font-size:56px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:20px; margin-bottom:8px;">You Are Currently Off Duty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Toggle your duty status to Online to start receiving instant medicine delivery orders.</p>
                        <button class="add-cart-btn" onclick="MediApp.toggleDriverDuty()"><i class="fa-solid fa-power-off"></i> Go On Duty (Online)</button>
                    </div>
                `;
        }
        return `
                <!-- Active Assigned Delivery Order -->
                ${assignedOrder ? `
                    <div style="background:var(--card-bg); border:2px solid var(--primary); border-radius:var(--radius-lg); padding:20px; margin-bottom:24px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span class="rx-badge" style="background:var(--primary); font-size:12px;">ACTIVE ASSIGNED ORDER</span>
                            <span style="font-weight:800; font-size:16px; color:var(--primary);">${assignedOrder.id}</span>
                        </div>

                        <!-- Live Navigation Map Canvas -->
                        <div class="tracking-map-box" style="margin-bottom:16px;">
                            <canvas id="driverMapCanvas" class="tracking-canvas"></canvas>
                        </div>

                        <!-- Google Maps Route Navigation Button -->
                        <div style="margin-bottom:16px;">
                            <a href="https://www.google.com/maps/search/?api=1&query=Sector+18+Noida" target="_blank" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #4285F4 0%, #34A853 100%); text-decoration:none;">
                                <i class="fa-solid fa-diamond-turn-right"></i> Open Turn-By-Turn Navigation in Google Maps
                            </a>
                        </div>

                        <!-- Pickup & Dropoff Details -->
                        <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); margin-bottom:16px; display:flex; flex-direction:column; gap:10px;">
                            <div style="font-size:13px; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <strong style="color:var(--primary);"><i class="fa-solid fa-store"></i> PICKUP PHARMACY:</strong><br>
                                <b>${assignedOrder.pharmacy_name}</b> (Sector 18, Noida)
                            </div>
                            <div style="font-size:13px;">
                                <strong style="color:var(--emergency-red);"><i class="fa-solid fa-house-user"></i> DELIVER TO CUSTOMER:</strong><br>
                                <b>${assignedOrder.customer_name}</b> (${assignedOrder.customer_phone})<br>
                                <span style="color:var(--text-muted); font-size:12px;">${assignedOrder.customer_address}</span>
                            </div>
                        </div>

                        <!-- Delivery Status Workflow Control Buttons -->
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="display:flex; gap:8px;">
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Arrived at Pharmacy', 2)">
                                    <i class="fa-solid fa-building-circle-check"></i> Arrived at Store
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Out for Delivery', 4)">
                                    <i class="fa-solid fa-box-open"></i> Order Picked Up
                                </button>
                            </div>

                            <div style="display:flex; gap:8px;">
                                <button class="add-cart-btn" style="flex:2; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.openOtpVerificationModal('${assignedOrder.id}')">
                                    <i class="fa-solid fa-shield-check"></i> Verify Customer OTP & Complete
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center; color:var(--emergency-red);" onclick="MediApp.rejectDelivery('${assignedOrder.id}')">
                                    <i class="fa-solid fa-xmark"></i> Decline
                                </button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div style="text-align:center; padding:50px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-circle-check" style="font-size:52px; color:var(--secondary); margin-bottom:12px;"></i>
                        <h3 style="font-weight:700; font-size:18px;">You Are On Duty & Ready</h3>
                        <p style="font-size:13px; color:var(--text-muted);">Incoming delivery requests from nearby pharmacies will appear here automatically.</p>
                    </div>
                `}
            `;
      }
      if (this.activeTab === "earnings") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Earnings Ledger</h3>
                
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px;">
                    <div style="text-align:center; margin-bottom:20px;">
                        <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">TODAY'S TOTAL EARNINGS</div>
                        <div style="font-size:36px; font-weight:800; color:var(--secondary);">\u20B9${this.driverInfo.earnings_today}</div>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px; display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>Base Trip Pay (${this.driverInfo.total_deliveries} trips)</span>
                            <strong>\u20B9${this.driverInfo.base_pay}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Distance & Express Bonus</span>
                            <strong>\u20B9${this.driverInfo.bonus}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Customer Tips \u2764\uFE0F</span>
                            <strong style="color:var(--secondary);">\u20B9${this.driverInfo.tips}</strong>
                        </div>
                        <div style="border-top:1px dashed var(--card-border); pt:8px; margin-top:4px; display:flex; justify-content:space-between; font-weight:800; font-size:15px;">
                            <span>Net Payout</span>
                            <span style="color:var(--primary);">\u20B9${this.driverInfo.earnings_today}</span>
                        </div>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "history") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Completed Delivery History (${completedDeliveries.length})</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${completedDeliveries.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No completed deliveries logged today.</div>
                    ` : completedDeliveries.map((o) => {
          var _a;
          return `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--primary);">${o.id}</strong>
                                <div style="font-size:12px; color:var(--text-body); margin-top:2px;">Customer: ${o.customer_name} \u2022 ${o.pharmacy_name}</div>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">OTP Verified: ${((_a = o.delivery_partner) == null ? void 0 : _a.otp) || "8912"}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:800; color:var(--secondary); font-size:15px;">+\u20B945.00</div>
                                <span class="role-badge-btn" style="background:var(--secondary-light); color:var(--secondary);">Delivered</span>
                            </div>
                        </div>
                    `;
        }).join("")}
                </div>
            `;
      }
      if (this.activeTab === "profile") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Profile & Vehicle Information</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px;">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:70px; height:70px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <h3 style="font-size:18px; margin-bottom:2px;">${this.driverInfo.name}</h3>
                            <div style="font-size:12px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                            <div style="font-size:12px; color:var(--warning-amber); font-weight:800; margin-top:2px;"><i class="fa-solid fa-star"></i> ${this.driverInfo.rating} Rating (${this.driverInfo.total_deliveries} deliveries)</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Duty Availability</label>
                            <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"};" onclick="MediApp.toggleDriverDuty()">
                                \u25CF ${this.isOnDuty ? "ON DUTY (Online)" : "OFF DUTY (Offline)"}
                            </button>
                        </div>
                    </div>
                </div>
            `;
      }
    }
  };

  // js/admin.js
  var AdminModule = class {
    constructor(app) {
      this.app = app;
      this.activeTab = "overview";
    }
    render() {
      const totalRevenue = this.app.state.orders.reduce((sum, o) => sum + o.total_amount, 0);
      const usersList = this.app.state.usersList || [
        { id: "usr_1", name: "Alex Johnson", email: "alex@example.com", role: "customer", status: "Active" },
        { id: "usr_2", name: "Priya Sharma", email: "priya@example.com", role: "customer", status: "Active" },
        { id: "usr_pharm_1", name: "Dr. S. K. Gupta", email: "apollo@example.com", role: "pharmacy", status: "Active" },
        { id: "usr_driver_1", name: "Rohan Verma", email: "rohan@example.com", role: "delivery", status: "Active" }
      ];
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #0284c7 0%, #0f172a 100%);"><i class="fa-solid fa-user-shield"></i></div>
                    <span class="brand-text">MediFind Admin Control</span>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: ADMIN
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? "fa-sun" : "fa-moon"}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar (8 Sections) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === "overview" ? "active" : ""}" 
                            style="${this.activeTab === "overview" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('overview')">
                        <i class="fa-solid fa-chart-pie"></i> Overview
                    </button>
                    <button class="btn-secondary ${this.activeTab === "users" ? "active" : ""}" 
                            style="${this.activeTab === "users" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('users')">
                        <i class="fa-solid fa-users"></i> Users (${usersList.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "pharmacies" ? "active" : ""}" 
                            style="${this.activeTab === "pharmacies" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('pharmacies')">
                        <i class="fa-solid fa-store"></i> Pharmacies (${this.app.state.pharmacies.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "medicines" ? "active" : ""}" 
                            style="${this.activeTab === "medicines" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('medicines')">
                        <i class="fa-solid fa-pills"></i> Medicines (${this.app.state.medicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "orders" ? "active" : ""}" 
                            style="${this.activeTab === "orders" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('orders')">
                        <i class="fa-solid fa-truck-fast"></i> Orders (${this.app.state.orders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "partners" ? "active" : ""}" 
                            style="${this.activeTab === "partners" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('partners')">
                        <i class="fa-solid fa-motorcycle"></i> Fleet
                    </button>
                    <button class="btn-secondary ${this.activeTab === "analytics" ? "active" : ""}" 
                            style="${this.activeTab === "analytics" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('analytics')">
                        <i class="fa-solid fa-chart-line"></i> Financials
                    </button>
                    <button class="btn-secondary ${this.activeTab === "reports" ? "active" : ""}" 
                            style="${this.activeTab === "reports" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('reports')">
                        <i class="fa-solid fa-file-export"></i> Reports
                    </button>
                </div>

                ${this.renderActiveTab(totalRevenue, usersList)}
            </main>
        `;
    }
    renderActiveTab(totalRevenue, usersList) {
      if (this.activeTab === "overview") {
        return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-chart-line"></i></div>
                        <div>
                            <div class="metric-val">\u20B9${totalRevenue.toFixed(0)}</div>
                            <div class="metric-lbl">Total Gross Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-store"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.pharmacies.length}</div>
                            <div class="metric-lbl">Verified Pharmacies</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-pills"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.medicines.length}</div>
                            <div class="metric-lbl">Master Medicines</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#f3e8ff; color:#9333ea;"><i class="fa-solid fa-truck-fast"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.orders.length}</div>
                            <div class="metric-lbl">Total Platform Orders</div>
                        </div>
                    </div>
                </div>

                <!-- Admin Action Center Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.setAdminTab('pharmacies')"><i class="fa-solid fa-check-double"></i> Review Pharmacy Registrations</button>
                    <button class="btn-secondary" onclick="MediApp.setAdminTab('users')"><i class="fa-solid fa-user-shield"></i> Manage User Statuses</button>
                    <button class="btn-secondary" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-download"></i> Export Audit Report</button>
                </div>

                <!-- Revenue Chart Preview -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:16px;">Platform Order Volume Growth</h3>
                    <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                </div>
            `;
      }
      if (this.activeTab === "users") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Platform User Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage registered customer, pharmacy, and driver accounts</p>
                    </div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User ID & Name</th>
                                <th>Email</th>
                                <th>Assigned Role</th>
                                <th>Account Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usersList.map((u) => {
          const isSuspended = u.status === "Suspended";
          return `
                                    <tr>
                                        <td><strong>${u.name}</strong><br><span style="font-size:11px; color:var(--text-muted);">${u.id}</span></td>
                                        <td>${u.email}</td>
                                        <td><span class="role-badge-btn" style="text-transform:uppercase;">${u.role}</span></td>
                                        <td><span style="font-weight:800; color:${isSuspended ? "var(--emergency-red)" : "var(--secondary)"};">${u.status || "Active"}</span></td>
                                        <td>
                                            <button class="btn-secondary" style="color:${isSuspended ? "var(--secondary)" : "var(--emergency-red)"}; font-weight:700;" onclick="MediApp.toggleUserStatus('${u.id}')">
                                                <i class="fa-solid ${isSuspended ? "fa-user-check" : "fa-user-slash"}"></i> ${isSuspended ? "Activate User" : "Suspend User"}
                                            </button>
                                        </td>
                                    </tr>
                                `;
        }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "pharmacies") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Registered Pharmacies & License Approvals</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Verify drug license compliance and control store operational statuses</p>
                    </div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Pharmacy Shop</th>
                                <th>Owner</th>
                                <th>Drug License</th>
                                <th>Rating</th>
                                <th>Verification Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.pharmacies.map((p) => {
          const isVerified = p.license_verified !== false;
          const isSuspended = p.status === "suspended";
          return `
                                    <tr>
                                        <td><strong>${p.shop_name}</strong><br><span style="font-size:11px; color:var(--text-muted);">${p.address}</span></td>
                                        <td>${p.owner_name}</td>
                                        <td><code>${p.license_number}</code></td>
                                        <td><span class="star-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></td>
                                        <td>
                                            <span style="font-weight:800; color:${isSuspended ? "var(--emergency-red)" : isVerified ? "var(--secondary)" : "var(--warning-amber)"};">
                                                ${isSuspended ? "Suspended" : isVerified ? "Verified \u2705" : "Pending Approval \u23F3"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                ${!isVerified ? `
                                                    <button class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.approvePharmacy('${p.id}')"><i class="fa-solid fa-check"></i> Approve License</button>
                                                ` : ""}
                                                <button class="btn-secondary" style="color:${isSuspended ? "var(--secondary)" : "var(--emergency-red)"}; padding:4px 8px; font-size:11px;" onclick="MediApp.suspendPharmacy('${p.id}')">
                                                    <i class="fa-solid ${isSuspended ? "fa-rotate-left" : "fa-ban"}"></i> ${isSuspended ? "Restore" : "Suspend"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
        }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "medicines") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Master Medicines Catalog (${this.app.state.medicines.length} Items)</h3>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Brand & Generic Composition</th>
                                <th>Category</th>
                                <th>Mfr</th>
                                <th>Unit Price</th>
                                <th>Total Stock</th>
                                <th>Pharmacy</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.medicines.slice(0, 15).map((m) => `
                                <tr>
                                    <td><strong>${m.name}</strong><br><span style="font-size:11px; color:var(--primary);">\u{1F9EA} ${m.generic_name}</span></td>
                                    <td>${m.category}</td>
                                    <td>${m.manufacturer || "Micro Labs"}</td>
                                    <td>\u20B9${m.price.toFixed(2)}</td>
                                    <td><span style="font-weight:800; color:${m.stock < 20 ? "var(--emergency-red)" : "var(--secondary)"};">${m.stock} units</span></td>
                                    <td>${m.pharmacy_name}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "orders") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Live Orders Stream</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${this.app.state.orders.map((o) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--primary); font-size:15px;">${o.id}</strong>
                                <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: ${o.customer_name} \u2022 Pharmacy: ${o.pharmacy_name}</span>
                                <div style="font-size:12px; margin-top:4px;">Items: ${o.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:800; font-size:16px; color:var(--secondary);">\u20B9${o.total_amount.toFixed(2)}</div>
                                <span class="role-badge-btn">${o.order_status}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "partners") {
        const partners = [
          { id: "partner_1", name: "Rohan Verma", vehicle: "Hero Splendor (KA-01-EQ-9982)", phone: "+91 98112 33445", rating: 4.9, active: true, deliveries: 482 },
          { id: "partner_2", name: "Vikram Patel", vehicle: "TVS NTORQ (UP-16-BD-1122)", phone: "+91 98222 55667", rating: 4.7, active: true, deliveries: 310 }
        ];
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Delivery Fleet Management</h3>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Vehicle Details</th>
                                <th>Phone</th>
                                <th>Rating</th>
                                <th>Completed Deliveries</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${partners.map((dp) => `
                                <tr>
                                    <td><strong>${dp.name}</strong></td>
                                    <td>${dp.vehicle}</td>
                                    <td>${dp.phone}</td>
                                    <td><span class="star-rating"><i class="fa-solid fa-star"></i> ${dp.rating}</span></td>
                                    <td><strong>${dp.deliveries} orders</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">\u25CF Active Duty</span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "analytics") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Financial & Revenue Analytics</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Monthly Revenue Growth (\u20B9)</h4>
                        <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Payment Method Distribution</h4>
                        <canvas id="adminPaymentChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "reports") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Audit Reports & Exporter</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <div>
                            <h4 style="font-size:16px;">Financial & Compliance Audit Report</h4>
                            <p style="font-size:12px; color:var(--text-muted);">Generate platform audit report with revenue logs and pharmacy compliance metrics.</p>
                        </div>
                        <button class="add-cart-btn" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-file-pdf"></i> Generate Audit Report</button>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px;">
                        <strong>Report Summary Parameters:</strong>
                        <ul style="margin-top:8px; padding-left:20px;">
                            <li>Gross Platform Revenue: <b>\u20B9${totalRevenue.toFixed(2)}</b></li>
                            <li>Registered Pharmacies: <b>${this.app.state.pharmacies.length} Stores</b></li>
                            <li>Master Medicine SKU Catalog: <b>${this.app.state.medicines.length} Medicines</b></li>
                            <li>Processed Orders Count: <b>${this.app.state.orders.length} Orders</b></li>
                        </ul>
                    </div>
                </div>
            `;
      }
    }
    initCharts() {
      if (this.activeTab !== "overview" && this.activeTab !== "analytics") return;
      const mainCtx = document.getElementById("adminAnalyticsChart");
      const payCtx = document.getElementById("adminPaymentChart");
      if (mainCtx && typeof Chart !== "undefined") {
        new Chart(mainCtx, {
          type: "bar",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [{
              label: "Monthly Platform Volume (\u20B9)",
              data: [12e4, 19e4, 3e5, 5e5, 42e4, 68e4, 89e4],
              backgroundColor: "#0284c7",
              borderRadius: 6
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
      if (payCtx && typeof Chart !== "undefined") {
        new Chart(payCtx, {
          type: "pie",
          data: {
            labels: ["UPI (GPay/PhonePe)", "Credit/Debit Card", "Cash on Delivery"],
            datasets: [{
              data: [65, 25, 10],
              backgroundColor: ["#22c55e", "#0ea5e9", "#f59e0b"]
            }]
          },
          options: { responsive: true }
        });
      }
    }
  };

  // js/ai.js
  var AiEngine = class {
    constructor(appState) {
      this.appState = appState;
    }
    // 1. AI Prescription Reader (OCR Simulator for Camera, Gallery, and PDF)
    async scanPrescription(fileSource, sourceType = "gallery") {
      return new Promise((resolve) => {
        setTimeout(() => {
          const sampleExtracted = [
            { name: "Dolo 650mg Tablet", generic: "Paracetamol 650mg", qty: 2, confidence: 98, isLowConfidence: false, medId: "med_1", matched: true },
            { name: "Becosules Z Capsule", generic: "B-Complex + Zinc", qty: 1, confidence: 94, isLowConfidence: false, medId: "med_16", matched: true },
            { name: "Amoxyclav 625mg", generic: "Amoxicillin + Clavulanic Acid", qty: 1, confidence: 64, isLowConfidence: true, medId: "med_2", matched: true },
            { name: "Pantocid 40 Tablet", generic: "Pantoprazole 40mg", qty: 1, confidence: 92, isLowConfidence: false, medId: "med_23", matched: true }
          ];
          resolve({
            success: true,
            sourceType,
            doctor: "Dr. A. K. Sharma (MD Internal Medicine)",
            patient: "Alex Johnson",
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            items: sampleExtracted,
            rawText: "Rx:\n1. Tab Dolo 650mg 1-0-1 (2 strips)\n2. Cap Becosules Z 0-1-0 (1 strip)\n3. Tab Amoxyclav 625mg 1-0-1 (1 strip)\n4. Tab Pantocid 40mg 1-0-0 before breakfast"
          });
        }, 1200);
      });
    }
    // 2. AI Generic & Alternative Medicine Recommender
    getGenericAlternatives(medId) {
      const target = MOCK_MEDICINES.find((m) => m.id === medId);
      if (!target) return [];
      const alternatives = MOCK_MEDICINES.filter(
        (m) => m.id !== target.id && (m.generic_name.toLowerCase().includes(target.generic_name.split(" ")[0].toLowerCase()) || m.category === target.category)
      ).slice(0, 3);
      return alternatives.map((alt) => ({
        ...alt,
        savings_percent: Math.round((target.price - alt.price) / target.price * 100)
      }));
    }
    // 3. AI Conversational Search Assistant
    queryAssistant(userQuery) {
      const query = userQuery.toLowerCase().trim();
      if (query.includes("dolo") || query.includes("paracetamol") || query.includes("fever")) {
        const matches = MOCK_MEDICINES.filter((m) => m.name.toLowerCase().includes("dolo") || m.generic_name.toLowerCase().includes("paracetamol")).slice(0, 3);
        return {
          reply: `I found ${matches.length} availability options for Dolo 650 / Paracetamol in nearby pharmacies. Apollo Pharmacy has instant 15-min delivery!`,
          type: "medicines",
          data: matches
        };
      }
      if (query.includes("open") || query.includes("pharmacy") || query.includes("near")) {
        const openPharmacies = MOCK_PHARMACIES.filter((p) => p.status === "open");
        return {
          reply: `There are ${openPharmacies.length} verified pharmacies open right now near Sector 18. Apollo Pharmacy 24/7 is closest (0.8 km).`,
          type: "pharmacies",
          data: openPharmacies
        };
      }
      if (query.includes("under") || query.includes("cheap") || query.includes("price")) {
        const budgetMeds = MOCK_MEDICINES.filter((m) => m.price <= 100).slice(0, 4);
        return {
          reply: `Here are popular high-demand medicines priced under \u20B9100 available for immediate order:`,
          type: "medicines",
          data: budgetMeds
        };
      }
      if (query.includes("emergency") || query.includes("insulin") || query.includes("heart")) {
        const emergencyMeds = MOCK_MEDICINES.filter((m) => m.category === "emergency" || m.category === "diabetes" || m.category === "cardiac").slice(0, 3);
        return {
          reply: `\u{1F6A8} Emergency Care Alert: Sanjeevani Emergency Pharmacy and Apollo 24/7 have critical emergency medicines and insulin in stock with express priority delivery.`,
          type: "medicines",
          data: emergencyMeds
        };
      }
      return {
        reply: `I analyzed your search for "${userQuery}". You can search by generic chemical name, brand, or upload your doctor's prescription for instant auto-cart checkout!`,
        type: "text"
      };
    }
  };

  // js/tracking.js
  var DeliveryTracker = class {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.progress = 0.45;
      this.animating = false;
      this.pharmacyPoint = { x: 60, y: 160, label: "Apollo Pharmacy" };
      this.customerPoint = { x: 340, y: 50, label: "Customer Location" };
      this.controlPoint1 = { x: 140, y: 190 };
      this.controlPoint2 = { x: 260, y: 40 };
      this.init();
    }
    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.startAnimation();
    }
    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.draw();
    }
    // Bezier curve calculation for realistic road movement
    getPointOnRoute(t) {
      const p0 = this.pharmacyPoint;
      const p1 = this.controlPoint1;
      const p2 = this.controlPoint2;
      const p3 = this.customerPoint;
      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;
      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;
      const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
      const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;
      return { x: x / 400 * this.canvas.width, y: y / 220 * this.canvas.height };
    }
    startAnimation() {
      this.animating = true;
      const animate = () => {
        if (!this.animating) return;
        this.progress += 15e-4;
        if (this.progress > 0.92) this.progress = 0.2;
        this.draw();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
    stopAnimation() {
      this.animating = false;
    }
    draw() {
      if (!this.ctx || !this.canvas) return;
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.fillStyle = "#0f172a";
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.strokeStyle = "#1e293b";
      this.ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
      }
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#0d9488";
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = "round";
      const steps = 50;
      for (let i = 0; i <= steps; i++) {
        const pt = this.getPointOnRoute(i / steps);
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#10b981";
      this.ctx.lineWidth = 6;
      const currentSteps = Math.floor(steps * this.progress);
      for (let i = 0; i <= currentSteps; i++) {
        const pt = this.getPointOnRoute(i / steps);
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();
      const pStart = this.getPointOnRoute(0);
      this.drawPin(pStart.x, pStart.y, "#3b82f6", "fa-store", "Pharmacy");
      const pEnd = this.getPointOnRoute(1);
      this.drawPin(pEnd.x, pEnd.y, "#ef4444", "fa-house-user", "Delivery Location");
      const pCurr = this.getPointOnRoute(this.progress);
      this.drawVehicleMarker(pCurr.x, pCurr.y);
    }
    drawPin(x, y, color, icon, label) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 14, 0, 2 * Math.PI);
      this.ctx.fillStyle = color + "40";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.stroke();
      this.ctx.fillStyle = "#f8fafc";
      this.ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(label, x, y + 22);
      this.ctx.restore();
    }
    drawVehicleMarker(x, y) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 18, 0, 2 * Math.PI);
      this.ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#10b981";
      this.ctx.fill();
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();
      this.ctx.fillStyle = "#10b981";
      this.ctx.font = "800 11px Plus Jakarta Sans, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Rohan (Delivery Partner)", x, y - 18);
      this.ctx.restore();
    }
  };

  // js/auth.js
  var AuthService = class {
    constructor(app) {
      this.app = app;
      this.currentUser = JSON.parse(localStorage.getItem("medifind_auth_user")) || null;
    }
    isAuthenticated() {
      return this.currentUser !== null;
    }
    getUser() {
      return this.currentUser;
    }
    getRole() {
      return this.currentUser ? this.currentUser.role : "guest";
    }
    // 1. Email Signup
    async signup(email, password, name, role = "customer", phone = "", address = "") {
      try {
        const existingUsers = Array.from(firestoreDb.collections.Users.values());
        if (existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: "An account with this email already exists." };
        }
        const newUser = {
          id: `usr_${Date.now()}`,
          name,
          email: email.toLowerCase(),
          password,
          phone: phone || "+91 98765 43210",
          role,
          address: address || "Sector 18, Noida",
          profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        await firestoreDb.createUser(newUser);
        this.setCurrentUser(newUser, true);
        try {
          const supabaseUrl = "https://gixqpvojsyitkbgctlqz.supabase.co";
          const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeHFwdm9qc3lpdGtiZ2N0bHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODE5MDYsImV4cCI6MjEwMDM1NzkwNn0.0cIqXypO-lW8cJWbpztFN6nVPljTrgaPRIqeQUo850I";
          fetch(`${supabaseUrl}/rest/v1/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              password: newUser.password,
              phone: newUser.phone,
              role: newUser.role,
              address: newUser.address
            })
          }).catch((e) => console.warn("[Supabase Direct Sync] Warning:", e));
        } catch (e) {
          console.warn("[Supabase Direct Sync] Network warning:", e);
        }
        return { success: true, user: newUser, message: `Account created! Welcome ${name}.` };
      } catch (err) {
        console.error("[Firebase Auth] Signup Error:", err);
        return { success: false, message: err.message || "Signup failed" };
      }
    }
    // 2. Email Login
    async login(email, password, rememberMe = true) {
      try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPassword = (password || "").trim();
        const users = Array.from(firestoreDb.collections.Users.values());
        let user = users.find((u) => (u.email || "").toLowerCase() === cleanEmail);
        if (!user) {
          try {
            const supabaseUrl = "https://gixqpvojsyitkbgctlqz.supabase.co";
            const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeHFwdm9qc3lpdGtiZ2N0bHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODE5MDYsImV4cCI6MjEwMDM1NzkwNn0.0cIqXypO-lW8cJWbpztFN6nVPljTrgaPRIqeQUo850I";
            const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
              method: "GET",
              headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`
              }
            });
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                user = data[0];
                await firestoreDb.createUser(user);
              }
            }
          } catch (e) {
            console.warn("[Supabase Direct Fetch] Warning:", e);
          }
        }
        if (!user) {
          return { success: false, message: "No account found with this email." };
        }
        if (user.password && user.password !== cleanPassword) {
          return { success: false, message: "Invalid password. Please check your credentials." };
        }
        this.setCurrentUser(user, rememberMe);
        return { success: true, user, message: `Welcome back, ${user.name}!` };
      } catch (err) {
        console.error("[Firebase Auth] Login Error:", err);
        return { success: false, message: "Invalid credentials." };
      }
    }
    // 3. Forgot Password
    async forgotPassword(email) {
      try {
        const users = Array.from(firestoreDb.collections.Users.values());
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          return { success: false, message: "Email address not found in system." };
        }
        return { success: true, message: `Password reset link sent to ${email}` };
      } catch (err) {
        return { success: false, message: "Failed to send reset email." };
      }
    }
    // 4. Logout
    logout() {
      this.currentUser = null;
      localStorage.removeItem("medifind_auth_user");
      sessionStorage.removeItem("medifind_auth_user");
      if (this.app) {
        this.app.state.cart = [];
        this.app.state.currentRole = "auth";
        this.app.state.authMode = "login";
        this.app.showToast("Logged out successfully");
        this.app.render();
      }
    }
    setCurrentUser(user, rememberMe) {
      this.currentUser = user;
      const data = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem("medifind_auth_user", data);
      } else {
        sessionStorage.setItem("medifind_auth_user", data);
      }
      if (this.app && this.app.state) {
        this.app.state.cart = [];
      }
    }
    // 5. Role Redirection Matrix
    getRedirectTabForRole(role) {
      return { role: "customer", tab: "home" };
    }
    // 6. Route Protection Guard
    canAccessRole(requestedRole) {
      return true;
    }
    // 7. Authentication Landing Page UI Renderer
    renderLandingPage() {
      return `
            <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 50%, var(--secondary-light) 100%); padding:24px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:40px 32px; width:100%; max-width:480px; box-shadow:var(--shadow-lg); text-align:center;">
                    
                    <div class="brand-icon" style="width:68px; height:68px; font-size:32px; margin:0 auto 16px auto; background:linear-gradient(135deg, var(--primary) 0%, #0284c7 100%); box-shadow:var(--shadow-md);">
                        <i class="fa-solid fa-notes-medical"></i>
                    </div>

                    <h1 style="font-size:28px; font-weight:800; color:var(--text-main); margin-bottom:6px;">MediFind</h1>
                    <p style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:4px;">Real-Time Medicine Finder & 15-Min Delivery \u26A1</p>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:28px; max-width:360px; margin-left:auto; margin-right:auto;">
                        Order genuine medicines from verified nearby pharmacies with live GPS driver tracking.
                    </p>

                    <!-- Primary Pathways -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                        </button>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px; background:var(--secondary);" onclick="MediApp.setAuthMode('signup')">
                            <i class="fa-solid fa-user-plus"></i> Create New Account
                        </button>

                        <button class="btn-secondary" style="width:100%; justify-content:center; padding:12px; font-size:14px; border:1.5px solid var(--card-border);" onclick="MediApp.continueAsGuest()">
                            <i class="fa-solid fa-user-clock"></i> Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    // 8. Dedicated Login Page UI Renderer
    renderLoginPage() {
      const authMode = this.app.state.authMode;
      if (authMode === "landing") return this.renderLandingPage();
      if (authMode === "signup") return this.renderSignupPage();
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('landing')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Landing
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">AUTHENTICATION</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto;"><i class="fa-solid fa-notes-medical"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Welcome Back to MediFind</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Sign in to order medicines & track deliveries</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                <input type="email" id="authEmail" placeholder="alex@example.com" value="alex@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="font-size:12px; font-weight:700;">PASSWORD</label>
                                    <a href="#" style="font-size:11px; color:var(--primary); font-weight:700;" onclick="MediApp.openForgotPasswordModal()">Forgot Password?</a>
                                </div>
                                <input type="password" id="authPassword" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" value="password123" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="checkbox" id="authRememberMe" checked style="width:16px; height:16px;">
                                <label for="authRememberMe" style="font-size:12px; color:var(--text-muted);">Remember login session</label>
                            </div>
                        </div>

                        <div id="authErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Portal
                        </button>
                    </form>

                    <div style="text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted);">
                        Don't have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('signup')">Sign Up Here</a>
                    </div>
                </div>
            </div>
        `;
    }
    // 8. Dedicated Signup Page UI Renderer
    renderSignupPage() {
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--secondary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:480px; box-shadow:var(--shadow-lg);">
                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto; background:linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-user-plus"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Create MediFind Account</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Join India's fastest 15-minute medicine delivery network</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleSignupFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">FULL NAME</label>
                                <input type="text" id="signupName" placeholder="Dr. S. K. Gupta or Alex Johnson" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; gap:10px;">
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                    <input type="email" id="signupEmail" placeholder="user@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PHONE NUMBER</label>
                                    <input type="text" id="signupPhone" placeholder="+91 98765 43210" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">ADDRESS / LOCATION</label>
                                <input type="text" id="signupAddress" placeholder="Sector 18, Noida, UP - 201301" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PASSWORD</label>
                                <input type="password" id="signupPassword" placeholder="Minimum 6 characters" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>

                        <div id="signupErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);">
                            <i class="fa-solid fa-user-check"></i> Register & Access Dashboard
                        </button>
                    </form>

                    <div style="text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted);">
                        Already have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('login')">Sign In Here</a>
                    </div>
                </div>
            </div>
        `;
    }
  };

  // js/realtime-engine.js
  var RealtimeEngine = class {
    constructor(app) {
      this.app = app;
      this.socket = null;
      this.activeListeners = [];
      this.initSocketConnection();
    }
    initSocketConnection() {
      if (typeof io !== "undefined") {
        try {
          this.socket = io("http://localhost:5000", { autoConnect: true, reconnection: true });
          this.bindSocketEvents();
        } catch (e) {
          console.log("Socket.IO init fallback: operating in memory-broadcast mode");
        }
      }
    }
    bindSocketEvents() {
      if (!this.socket) return;
      this.socket.on("stock_update", (data) => {
        console.log("\u26A1 Realtime Stock Update Received:", data);
        const med = this.app.state.medicines.find((m) => m.id === data.medId);
        if (med) {
          med.stock = data.newStock;
          this.app.showToast(`\u26A1 Stock Update: ${med.name} is now ${med.stock} units`);
          this.app.render();
        }
      });
      this.socket.on("order_status_update", (data) => {
        console.log("\u26A1 Realtime Order Status Update Received:", data);
        const order = this.app.state.orders.find((o) => o.id === data.orderId);
        if (order) {
          order.order_status = data.status;
          if (data.step) order.tracking_step = data.step;
          this.app.showToast(`\u{1F4E6} Order ${order.id} status updated to "${data.status}"`);
          this.app.render();
        }
      });
      this.socket.on("driver_location_update", (data) => {
        console.log("\u26A1 Realtime Delivery Location Update:", data);
        if (this.app.customerModule) {
          this.app.customerModule.driverLivePos = { lat: data.lat, lng: data.lng, progress: data.progress };
          this.app.render();
        }
      });
      this.socket.on("notification_received", (data) => {
        console.log("\u26A1 Realtime Notification Received:", data);
        this.app.state.notifications.unshift({
          id: `n_${Date.now()}`,
          title: data.title,
          body: data.body,
          time: "Just now",
          read: false
        });
        this.app.showToast(`\u{1F514} ${data.title}: ${data.body}`);
        this.app.render();
      });
    }
    // FIREBASE ONSNAPSHOT LISTENERS SIMULATOR & SUBSCRIPTIONS
    subscribeStockUpdates(medId, callback) {
      console.log(`\u{1F4E1} Listening for realtime stock changes on medicine ${medId}...`);
      const interval = setInterval(() => {
        const med = this.app.state.medicines.find((m) => m.id === medId);
        if (med && callback) callback(med.stock);
      }, 1e4);
      this.activeListeners.push(interval);
    }
    subscribeOrderUpdates(orderId, callback) {
      console.log(`\u{1F4E1} Listening for realtime order status updates on order ${orderId}...`);
      const interval = setInterval(() => {
        const order = this.app.state.orders.find((o) => o.id === orderId);
        if (order && callback) callback(order.order_status, order.tracking_step);
      }, 8e3);
      this.activeListeners.push(interval);
    }
    // EMITTERS FOR REALTIME BROADCASTING WITHOUT PAGE REFRESH
    broadcastStockUpdate(medId, newStock) {
      if (this.socket) {
        this.socket.emit("stock_update", { medId, newStock });
      }
      const med = this.app.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.stock = parseInt(newStock) || 0;
        this.app.render();
      }
    }
    broadcastOrderUpdate(orderId, status, step) {
      if (this.socket) {
        this.socket.emit("order_status_update", { orderId, status, step });
      }
      const order = this.app.state.orders.find((o) => o.id === orderId);
      if (order) {
        order.order_status = status;
        if (step) order.tracking_step = step;
        this.app.render();
      }
    }
    broadcastNotification(title, body) {
      if (this.socket) {
        this.socket.emit("notification_received", { title, body });
      }
      this.app.state.notifications.unshift({
        id: `n_${Date.now()}`,
        title,
        body,
        time: "Just now",
        read: false
      });
      this.app.showToast(`\u{1F514} ${title}: ${body}`);
      this.app.render();
    }
  };

  // js/payment.js
  var PaymentService = class {
    constructor(app) {
      this.app = app;
      this.selectedMethod = "UPI";
      this.isProcessing = false;
      this.paymentHistory = [
        {
          txId: "pay_demo_UPI90182",
          orderId: "ORD-89102",
          amount: 86,
          method: "UPI (Google Pay)",
          status: "Success",
          timestamp: "2026-07-22T10:15:00Z"
        }
      ];
    }
    // 1. Open Checkout Payment Modal (Step 1: Selection & Input)
    openRazorpayCheckout(amount) {
      const cart = this.app.state.cart;
      if (cart.length === 0) {
        this.app.showToast("Your cart is empty!");
        return;
      }
      this.selectedMethod = this.selectedMethod || "UPI";
      this.isProcessing = false;
      this.renderCheckoutModal(amount);
    }
    // 2. Select Payment Method (ONLY changes selection state, NEVER places order or clears cart)
    selectPaymentMethod(method, amount) {
      this.selectedMethod = method;
      this.renderCheckoutModal(amount);
    }
    // 3. Render Checkout Payment Modal UI
    renderCheckoutModal(amount) {
      const method = this.selectedMethod;
      this.app.showModal(`
            <div class="modal-card" style="max-width:460px; padding:0; overflow:hidden; border-radius:var(--radius-lg);">
                <!-- Header -->
                <div style="background:#0c2340; color:white; padding:20px; position:relative;">
                    <button class="modal-close-btn" style="color:white;" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-shield-halved" style="color:#0ea5e9; font-size:20px;"></i>
                            <strong style="font-size:16px;">MediFind Secure Payment</strong>
                        </div>
                        <span style="background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">DEMO GATEWAY</span>
                    </div>
                    <div style="font-size:12px; opacity:0.8;">Total Order Amount</div>
                    <div style="font-size:26px; font-weight:800; color:#38bdf8;">\u20B9${amount.toFixed(2)}</div>
                </div>

                <!-- Body -->
                <div style="padding:20px; background:var(--card-bg);">
                    <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                        1. Select Payment Method
                    </h4>

                    <!-- Method Selection List -->
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <!-- Option 1: UPI -->
                        <div style="border:${method === "UPI" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "UPI" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('UPI', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-mobile-screen-button" style="font-size:20px; color:#22c55e;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">UPI (Google Pay / PhonePe / Paytm)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Instant 0% Fee Transfer</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "UPI" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 2: Credit / Debit Card -->
                        <div style="border:${method === "CARD" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "CARD" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('CARD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-credit-card" style="font-size:20px; color:#0ea5e9;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Credit / Debit Card</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Visa, Mastercard, RuPay, Amex</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "CARD" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 3: Net Banking -->
                        <div style="border:${method === "NETBANKING" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "NETBANKING" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('NETBANKING', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-building-columns" style="font-size:20px; color:#f59e0b;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Net Banking</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">SBI, HDFC, ICICI, Axis, Kotak</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "NETBANKING" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 4: Cash on Delivery -->
                        <div style="border:${method === "COD" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "COD" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('COD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:20px; color:#10b981;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Cash on Delivery (COD)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Pay cash upon doorstep delivery</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "COD" ? "checked" : ""} style="cursor:pointer;">
                        </div>
                    </div>

                    <!-- Payment Details Form (Step 2: Input & Submit) -->
                    <div style="border-top:1px dashed var(--card-border); padding-top:16px;">
                        <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                            2. Enter Payment Details
                        </h4>
                        
                        ${this.renderPaymentFormFields(method, amount)}
                    </div>
                </div>
            </div>
        `);
    }
    // 4. Render Form Fields according to selected payment method
    renderPaymentFormFields(method, amount) {
      if (method === "UPI") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">UPI ID</label>
                        <input type="text" id="payUpiIdInput" placeholder="username@okaxis or mobile@upi" value="alex@okaxis" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('UPI', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      if (method === "CARD") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARD NUMBER</label>
                        <input type="text" id="payCardNumInput" placeholder="4532 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8910" value="4532 8901 2345 8910" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">EXPIRY DATE</label>
                            <input type="text" id="payCardExpInput" placeholder="MM/YY" value="12/28" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CVV</label>
                            <input type="password" id="payCardCvvInput" placeholder="\u2022\u2022\u2022" value="891" maxlength="4" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARDHOLDER NAME</label>
                        <input type="text" id="payCardNameInput" placeholder="Name on Card" value="Alex Johnson" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('CARD', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      if (method === "NETBANKING") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">SELECT YOUR BANK</label>
                        <select id="payNetBankSelect" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600; background:var(--card-bg); color:var(--text-main);">
                            <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('NETBANKING', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      return `
            <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; font-size:13px;">
                <div style="display:flex; align-items:center; gap:10px; color:var(--secondary); font-weight:700;">
                    <i class="fa-solid fa-truck-ramp-box" style="font-size:18px;"></i>
                    <span>Pay cash when your medicine is delivered.</span>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                    Please keep exact cash ready upon 15-minute delivery arrival.
                </div>
            </div>
            <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px; background:var(--secondary);"
                    onclick="MediApp.submitDemoPayment('COD', ${amount})">
                <i class="fa-solid fa-check"></i> Place Order (Cash on Delivery)
            </button>
        `;
    }
    // 5. Submit Demo Payment & Process Order Creation
    async submitDemoPayment(method, amount) {
      var _a, _b, _c, _d, _e, _f;
      if (this.isProcessing) return;
      this.isProcessing = true;
      const btn = document.getElementById("paySubmitBtn");
      if (method === "UPI") {
        const upiId = (_b = (_a = document.getElementById("payUpiIdInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
        if (!upiId || !upiId.includes("@")) {
          this.app.showToast("\u26A0\uFE0F Please enter a valid UPI ID (e.g. username@upi)");
          this.isProcessing = false;
          return;
        }
      } else if (method === "CARD") {
        const cardNum = (_d = (_c = document.getElementById("payCardNumInput")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
        const cvv = (_f = (_e = document.getElementById("payCardCvvInput")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
        if (!cardNum || cardNum.length < 12 || !cvv || cvv.length < 3) {
          this.app.showToast("\u26A0\uFE0F Please enter valid Card Details & CVV");
          this.isProcessing = false;
          return;
        }
      }
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...`;
      }
      this.app.showToast("\u23F3 Processing payment securely...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const txId = method === "COD" ? `cod_${Date.now()}` : `pay_demo_${method}_${Math.floor(1e5 + Math.random() * 9e5)}`;
      const paymentStatus = method === "COD" ? "Pending COD" : "Paid";
      this.paymentHistory.push({
        txId,
        amount,
        method,
        status: method === "COD" ? "Pending COD" : "Success",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.isProcessing = false;
      this.app.completeCheckoutOrder(txId, method, amount, paymentStatus);
    }
  };

  // js/fcm.js
  var FcmService = class {
    constructor(app) {
      this.app = app;
      this.fcmToken = "fcm_token_medifind_live_" + Math.floor(Math.random() * 1e6);
      this.permissionGranted = false;
      this.initFcm();
    }
    async initFcm() {
      if ("Notification" in window) {
        try {
          if (Notification.permission === "granted") {
            this.permissionGranted = true;
          } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              this.permissionGranted = true;
            }
          }
        } catch (e) {
          console.log("FCM Web Push Init: Browser operating in sound/toast notification mode.");
        }
      }
    }
    // Generic FCM Push Dispatcher
    dispatchPushNotification(title, body, roleTarget = "customer", icon = "fa-bell") {
      if (this.permissionGranted && "Notification" in window) {
        try {
          new Notification(title, {
            body,
            icon: "/favicon.ico",
            tag: "medifind-fcm"
          });
        } catch (e) {
        }
      }
      this.app.state.notifications.unshift({
        id: `fcm_${Date.now()}`,
        title: `[FCM ${roleTarget.toUpperCase()}] ${title}`,
        body,
        time: "Just now",
        read: false
      });
      this.app.showToast(`\u{1F514} ${title}: ${body}`);
      this.app.render();
    }
    // 🧑‍🦱 CUSTOMER FCM TRIGGERS
    notifyOrderPlaced(orderId) {
      this.dispatchPushNotification(
        "\u{1F389} Order Placed Successfully!",
        `Order ${orderId} placed with 15-min express delivery fulfillment.`,
        "customer"
      );
    }
    notifyOrderAccepted(orderId) {
      this.dispatchPushNotification(
        "\u2705 Order Accepted by Pharmacy",
        `Pharmacy has accepted order ${orderId} and is preparing your medicines.`,
        "customer"
      );
    }
    notifyOutForDelivery(orderId, driverName = "Rohan Verma") {
      this.dispatchPushNotification(
        "\u{1F6F5} Out For Delivery!",
        `Driver ${driverName} is on the way with your medicines for order ${orderId}.`,
        "customer"
      );
    }
    notifyDelivered(orderId) {
      this.dispatchPushNotification(
        "\u{1F3E0} Order Delivered!",
        `Order ${orderId} delivered successfully. Stay healthy!`,
        "customer"
      );
    }
    // 🏬 PHARMACY FCM TRIGGERS
    notifyPharmacyNewOrder(orderId, amount) {
      this.dispatchPushNotification(
        "\u{1F514} New Order Received!",
        `New customer order ${orderId} received (\u20B9${amount.toFixed(2)}). Please prepare items.`,
        "pharmacy"
      );
    }
    notifyPharmacyLowStock(medName, stockQty) {
      this.dispatchPushNotification(
        "\u26A0\uFE0F Low Stock Alert!",
        `Medicine "${medName}" is low in stock (${stockQty} units remaining). Restock soon!`,
        "pharmacy"
      );
    }
    // 🛵 DELIVERY PARTNER FCM TRIGGERS
    notifyDeliveryNewAssignment(orderId, shopName) {
      this.dispatchPushNotification(
        "\u{1F6F5} New Express Delivery Assignment!",
        `New order ${orderId} assigned for pickup at ${shopName}.`,
        "delivery"
      );
    }
    // 🛡️ ADMIN FCM TRIGGERS
    notifyAdminSystemAlert(alertMessage) {
      this.dispatchPushNotification(
        "\u{1F6E1}\uFE0F Admin System Compliance Alert",
        alertMessage,
        "admin"
      );
    }
  };

  // js/app.js
  var MediFindApp = class {
    constructor() {
      this.authService = new AuthService(this);
      this.realtimeEngine = new RealtimeEngine(this);
      this.paymentService = new PaymentService(this);
      this.fcmService = new FcmService(this);
      this.state = {
        currentRole: "customer",
        // customer, pharmacy, delivery, admin
        customerTab: "home",
        // home, search, pharmacies, pharmacy-detail, medicine-detail, prescription, cart, orders, profile
        pharmacyTab: "dashboard",
        darkMode: false,
        medicines: [...MOCK_MEDICINES],
        pharmacies: [...MOCK_PHARMACIES],
        orders: [...MOCK_ORDERS],
        cart: [],
        prescriptions: [],
        appliedCoupon: null,
        favoritePharmacies: [],
        savedAddresses: [],
        notifications: []
      };
      this.customerModule = new CustomerModule(this);
      this.pharmacyModule = new PharmacyModule(this);
      this.deliveryModule = new DeliveryModule(this);
      this.adminModule = new AdminModule(this);
      this.aiEngine = new AiEngine(this);
      this.init();
    }
    init() {
      window.MediApp = this;
      this.state.cart = [];
      this.state.orders = [];
      if (this.authService.isAuthenticated()) {
        const user = this.authService.getUser();
        const target = this.authService.getRedirectTabForRole(user.role);
        this.state.currentRole = target.role;
      } else {
        this.state.currentRole = "auth";
        this.state.authMode = "landing";
      }
      if (navigator.geolocation) {
        googleMapsService.requestBrowserLocation().then((res) => {
          if (res.success) {
            this.showToast("\u{1F4CD} Real GPS Location Detected! Nearby Pharmacies Loaded");
          }
          this.render();
        });
      }
      googleMapsService.startWatchPosition();
      this.showSplashScreen();
      this.render();
      this.initAndroidBackButton();
      this.showToast("MediFind Application Ready \u{1F3E5}");
    }
    initAndroidBackButton() {
      if (window.Capacitor && window.Capacitor.isPluginAvailable("App")) {
        Promise.resolve().then(() => (init_esm(), esm_exports)).then(({ App: App2 }) => {
          App2.addListener("backButton", () => {
            if (this.activeModal) {
              this.closeModal();
            } else if (this.state.customerTab !== "home") {
              this.setCustomerTab("home");
            } else {
              App2.exitApp();
            }
          });
        }).catch((e) => console.log("[Back Button Listener Note]:", e));
      }
      window.addEventListener("offline", () => {
        this.showModal(`
                <div class="modal-card" style="max-width:380px; padding:24px; text-align:center;">
                    <div style="font-size:44px; color:var(--emergency-red); margin-bottom:12px;"><i class="fa-solid fa-wifi"></i></div>
                    <h3 style="font-size:18px; margin-bottom:6px;">No Internet Connection</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">MediFind requires an internet connection to load live pharmacies and medicines.</p>
                    <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="window.location.reload()">
                        <i class="fa-solid fa-rotate-right"></i> Retry
                    </button>
                </div>
            `);
      });
    }
    showSplashScreen() {
      if (sessionStorage.getItem("medifind_splash_shown")) return;
      sessionStorage.setItem("medifind_splash_shown", "true");
      const splash = document.createElement("div");
      splash.className = "splash-screen";
      splash.innerHTML = `
            <div class="splash-logo">
                <i class="fa-solid fa-notes-medical"></i>
            </div>
            <h1 style="font-size:28px; font-weight:800; color:white; margin-bottom:4px;">MediFind</h1>
            <p style="font-size:13px; color:#94a3b8; font-weight:600; text-align:center; max-width:280px; margin:0 auto;">
                Find Medicines. Find Pharmacies. Get Care Faster.
            </p>
            <div style="margin-top:24px;" class="loading-spinner"></div>
        `;
      document.body.appendChild(splash);
      setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.visibility = "hidden";
        setTimeout(() => splash.remove(), 500);
      }, 1200);
    }
    render() {
      const root = document.getElementById("app");
      if (!root) return;
      let contentHtml = "";
      if (this.state.currentRole === "auth") {
        contentHtml = this.authService.renderLoginPage();
      } else {
        contentHtml = this.customerModule.render();
      }
      root.innerHTML = `
            ${contentHtml}
            <div id="modalContainer"></div>
            <div id="toastContainer" class="toast-container"></div>
        `;
      setTimeout(() => {
        if (this.state.customerTab === "pharmacies") {
          googleMapsService.renderMapCanvas("nearbyPharmaciesMapCanvas");
        }
      }, 100);
    }
    // Location & Pharmacy Actions
    async detectLiveLocation() {
      this.showToast("\u{1F4CD} Detecting your location via GPS...");
      const res = await googleMapsService.requestBrowserLocation();
      if (res.success) {
        this.showToast(`\u{1F4CD} Location Detected: ${res.location.label}`);
      } else {
        this.showToast(`\u26A0\uFE0F ${res.message}`);
      }
      this.render();
    }
    async refreshNearbyPharmacies() {
      const loc = googleMapsService.getUserLocation();
      this.showToast("\u{1F50E} Refreshing nearby pharmacies via Google Places...");
      await googleMapsService.fetchNearbyPharmacies(loc.lat, loc.lng);
      this.showToast("\u2705 Nearby pharmacies updated");
      this.render();
    }
    openAddressModal() {
      const currentLoc = googleMapsService.getUserLocation();
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i> Select Your Location</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
                    Find pharmacies and check medicine availability near your exact position.
                </p>
                
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; margin-bottom:16px;" onclick="MediApp.closeModal(); MediApp.detectLiveLocation();">
                    <i class="fa-solid fa-location-arrow"></i> Detect My Current GPS Location
                </button>
                
                <div style="border-top:1px dashed var(--card-border); margin:16px 0; padding-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">ENTER LOCATION MANUALLY</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="manualLocationInput" placeholder="Enter area, city or street address..." value="${currentLoc.label}" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-md); font-size:13px;">
                        <button class="add-cart-btn" style="padding:10px 14px;" onclick="MediApp.submitManualLocation()">Set</button>
                    </div>
                </div>

                <div style="margin-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">POPULAR CITIES & PRESETS</label>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Anna Nagar, Chennai', 13.0827, 80.2707)">Chennai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Sector 18, Noida', 28.5355, 77.3910)">Noida</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Connaught Place, New Delhi', 28.6315, 77.2167)">Delhi</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Bandra West, Mumbai', 19.0596, 72.8295)">Mumbai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Koramangala, Bengaluru', 12.9352, 77.6245)">Bengaluru</button>
                    </div>
                </div>
            </div>
        `);
    }
    async submitManualLocation() {
      var _a, _b;
      const input = (_b = (_a = document.getElementById("manualLocationInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!input) return;
      this.closeModal();
      this.showToast("\u{1F4CD} Updating location...");
      await googleMapsService.setManualLocation(input);
      this.showToast(`\u{1F4CD} Location updated to: ${input}`);
      this.render();
    }
    async setPresetLocation(label, lat, lng) {
      this.closeModal();
      this.showToast(`\u{1F4CD} Setting location to ${label}...`);
      await googleMapsService.setManualLocation(label, lat, lng);
      this.showToast(`\u{1F4CD} Location set to: ${label}`);
      this.render();
    }
    // Customer Actions
    setCustomerTab(tab) {
      this.state.customerTab = tab;
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    filterPharmacies(val) {
      this.customerModule.pharmacySearchQuery = val;
      this.render();
    }
    openAccountModal() {
      const currentUser = this.authService.getUser();
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; padding:12px 0 20px 0;">
                    <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto;"><i class="fa-solid fa-user"></i></div>
                    <h3 style="font-size:20px; font-weight:800;">${currentUser ? currentUser.name : "Guest User"}</h3>
                    <p style="font-size:13px; color:var(--text-muted);">${currentUser ? currentUser.email : "Customer Account"}</p>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('orders'); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-box" style="color:var(--primary);"></i> <span>My Orders</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.openAddressModal(); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-location-dot" style="color:var(--secondary);"></i> <span>Saved Addresses</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('prescription'); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-file-prescription" style="color:#0284c7;"></i> <span>Uploaded Prescriptions</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                </div>

                ${currentUser ? `
                    <button class="btn-secondary" style="width:100%; justify-content:center; padding:12px; color:var(--emergency-red); font-weight:700;" onclick="MediApp.logout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout Account
                    </button>
                ` : `
                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.setAuthMode('login'); MediApp.closeModal();">
                        <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                    </button>
                `}
            </div>
        `);
    }
    openRoleModal() {
      this.openAccountModal();
    }
    switchRole(role) {
      this.state.currentRole = "customer";
      this.closeModal();
      this.render();
    }
    setAuthMode(mode) {
      this.state.currentRole = "auth";
      this.state.authMode = mode;
      this.closeModal();
      this.render();
    }
    continueAsGuest() {
      this.state.isGuest = true;
      this.state.currentRole = "customer";
      this.state.customerTab = "home";
      this.state.cart = [];
      this.showToast("\u{1F464} Browsing as Guest User");
      this.render();
    }
    async handleLoginFormSubmit(form) {
      var _a, _b, _c, _d, _e, _f, _g;
      const email = (_b = (_a = document.getElementById("authEmail")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const password = (_d = (_c = document.getElementById("authPassword")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
      const role = ((_e = document.getElementById("authRoleSelect")) == null ? void 0 : _e.value) || "customer";
      const rememberMe = (_g = (_f = document.getElementById("authRememberMe")) == null ? void 0 : _f.checked) != null ? _g : true;
      const errBanner = document.getElementById("authErrorBanner");
      if (!email || !password) {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = "Please fill in all email and password fields.";
        }
        return;
      }
      const res = await this.authService.login(email, password, rememberMe);
      if (res.success) {
        res.user.role = role;
        this.authService.setCurrentUser(res.user, rememberMe);
        const target = this.authService.getRedirectTabForRole(role);
        this.state.currentRole = target.role;
        this.state.cart = [];
        this.showToast(`Welcome back, ${res.user.name}! Authenticated as ${role.toUpperCase()}`);
        this.render();
      } else {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = res.message || "Login failed. Please check credentials.";
        }
      }
    }
    async handleSignupFormSubmit(form) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const role = ((_a = document.getElementById("signupRole")) == null ? void 0 : _a.value) || "customer";
      const name = (_c = (_b = document.getElementById("signupName")) == null ? void 0 : _b.value) == null ? void 0 : _c.trim();
      const email = (_e = (_d = document.getElementById("signupEmail")) == null ? void 0 : _d.value) == null ? void 0 : _e.trim();
      const phone = (_g = (_f = document.getElementById("signupPhone")) == null ? void 0 : _f.value) == null ? void 0 : _g.trim();
      const address = (_i = (_h = document.getElementById("signupAddress")) == null ? void 0 : _h.value) == null ? void 0 : _i.trim();
      const password = (_k = (_j = document.getElementById("signupPassword")) == null ? void 0 : _j.value) == null ? void 0 : _k.trim();
      const errBanner = document.getElementById("signupErrorBanner");
      if (!name || !email || !password) {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = "Please complete all required fields.";
        }
        return;
      }
      const res = await this.authService.signup(email, password, name, role, phone, address);
      if (res.success) {
        const target = this.authService.getRedirectTabForRole(role);
        this.state.currentRole = target.role;
        this.state.cart = [];
        this.showToast(`\u{1F389} Registration Successful! Welcome ${name}`);
        this.render();
      } else {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = res.message || "Registration failed.";
        }
      }
    }
    openForgotPasswordModal() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:6px;"><i class="fa-solid fa-key" style="color:var(--primary);"></i> Reset Password</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Enter your registered account email to receive reset instructions.</p>
                <input type="email" id="resetEmailInput" placeholder="alex@example.com" value="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); margin-bottom:14px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.sendPasswordResetEmail()">
                    <i class="fa-solid fa-paper-plane"></i> Send Password Reset Link
                </button>
            </div>
        `);
    }
    sendPasswordResetEmail() {
      var _a;
      const email = (_a = document.getElementById("resetEmailInput")) == null ? void 0 : _a.value;
      this.closeModal();
      this.showToast(`Password reset link sent to ${email}`);
    }
    logout() {
      this.closeModal();
      this.authService.logout();
      this.state.isGuest = false;
      this.state.currentRole = "auth";
      this.state.authMode = "login";
      this.render();
    }
    openAuthModal(mode = "login", targetRole = "customer") {
      if (mode === "login") {
        this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-fire" style="color:#f97316;"></i> Firebase Email Login</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Sign in to access your role-protected portal</p>
                    
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="authEmail" value="${targetRole === "pharmacy" ? "apollo@example.com" : targetRole === "delivery" ? "rohan@example.com" : targetRole === "admin" ? "admin@medifind.com" : "alex@example.com"}" placeholder="name@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="authPassword" value="password123" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                <input type="checkbox" id="authRemember" checked> Remember Me
                            </label>
                            <span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="MediApp.openForgotPasswordModal()">Forgot Password?</span>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleLoginSubmit('${targetRole}')">
                            <i class="fa-solid fa-right-to-bracket"></i> Login Now
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Don't have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('signup')">Sign Up</span>
                        </div>
                    </div>
                </div>
            `);
      } else {
        this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-user-plus" style="color:var(--primary);"></i> Firebase Registration</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Create a new MediFind user account</p>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Full Name</label>
                            <input type="text" id="signupName" placeholder="Alex Johnson" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="signupEmail" placeholder="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="signupPassword" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Select Account Role</label>
                            <select id="signupRole" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); background:var(--card-bg); color:var(--text-main);">
                                <option value="customer">Customer</option>
                                <option value="pharmacy">Pharmacy Owner</option>
                                <option value="delivery">Delivery Partner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleSignupSubmit()">
                            <i class="fa-solid fa-user-check"></i> Register Account
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Already have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('login')">Login</span>
                        </div>
                    </div>
                </div>
            `);
      }
    }
    async handleLoginSubmit(targetRole = "customer") {
      var _a, _b, _c;
      const email = (_a = document.getElementById("authEmail")) == null ? void 0 : _a.value;
      const password = (_b = document.getElementById("authPassword")) == null ? void 0 : _b.value;
      const remember = (_c = document.getElementById("authRemember")) == null ? void 0 : _c.checked;
      if (!email || !password) {
        this.showToast("Please enter both email and password.");
        return;
      }
      const res = await this.authService.login(email, password, remember);
      if (res.success) {
        this.closeModal();
        this.showToast(res.message);
        const redirect = this.authService.getRedirectTabForRole(res.user.role);
        this.state.currentRole = redirect.role;
        this.render();
      } else {
        this.showToast(`\u274C ${res.message}`);
      }
    }
    async handleSignupSubmit() {
      var _a, _b, _c, _d;
      const name = (_a = document.getElementById("signupName")) == null ? void 0 : _a.value;
      const email = (_b = document.getElementById("signupEmail")) == null ? void 0 : _b.value;
      const password = (_c = document.getElementById("signupPassword")) == null ? void 0 : _c.value;
      const role = ((_d = document.getElementById("signupRole")) == null ? void 0 : _d.value) || "customer";
      if (!name || !email || !password) {
        this.showToast("Please complete all required fields.");
        return;
      }
      const res = await this.authService.signup(email, password, name, role);
      if (res.success) {
        this.closeModal();
        this.showToast(res.message);
        const redirect = this.authService.getRedirectTabForRole(role);
        this.state.currentRole = redirect.role;
        this.render();
      } else {
        this.showToast(`\u274C ${res.message}`);
      }
    }
    openForgotPasswordModal() {
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-key"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:6px;">Reset Password</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Enter your registered email to receive a password reset link.</p>
                <input type="email" id="resetEmail" placeholder="name@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); margin-bottom:16px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.handleForgotPasswordSubmit()">
                    <i class="fa-solid fa-paper-plane"></i> Send Password Reset Link
                </button>
            </div>
        `);
    }
    async handleForgotPasswordSubmit() {
      var _a;
      const email = (_a = document.getElementById("resetEmail")) == null ? void 0 : _a.value;
      if (!email) {
        this.showToast("Please enter your email address.");
        return;
      }
      const res = await this.authService.forgotPassword(email);
      this.closeModal();
      this.showToast(res.message);
    }
    logout() {
      this.authService.logout();
      this.closeModal();
    }
    setPharmacyTab(tab) {
      this.pharmacyModule.activeTab = tab;
      this.render();
    }
    toggleTheme() {
      this.state.darkMode = !this.state.darkMode;
      document.body.classList.toggle("dark-mode", this.state.darkMode);
      this.showToast(this.state.darkMode ? "Dark Mode \u{1F319}" : "Light Mode \u2600\uFE0F");
      this.render();
    }
    addToCart(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (!med) return;
      const existing = this.state.cart.find((item) => item.id === medId);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.state.cart.push({
          id: med.id,
          name: med.name,
          price: med.price,
          quantity: 1,
          image: med.image,
          pharmacy_name: med.pharmacy_name
        });
      }
      this.showToast(`Added "${med.name}" to Cart \u{1F6D2}`);
      this.render();
    }
    updateCartQty(medId, delta) {
      const item = this.state.cart.find((i) => i.id === medId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.state.cart = this.state.cart.filter((i) => i.id !== medId);
      }
      this.render();
    }
    clearCart() {
      this.state.cart = [];
      this.showToast("Shopping Cart Emptied \u{1F6D2}");
      this.render();
    }
    getCartCount() {
      return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    simulateRazorpayCheckout(amount) {
      this.paymentService.openRazorpayCheckout(amount);
    }
    selectPaymentMethod(method, amount) {
      this.paymentService.selectPaymentMethod(method, amount);
    }
    submitDemoPayment(method, amount) {
      this.paymentService.submitDemoPayment(method, amount);
    }
    processPayment(method, amount) {
      this.paymentService.submitDemoPayment(method, amount);
    }
    simulatePaymentFailure(amount) {
      this.paymentService.handlePaymentFailure(amount);
    }
    completeCheckoutOrder(txId, paymentMethod, amount, paymentStatus = "Paid") {
      var _a;
      const currentUser = this.authService.getUser();
      const userId = currentUser ? currentUser.id : `usr_guest_${Date.now()}`;
      const userName = currentUser ? currentUser.name : "Guest Customer";
      const userEmail = currentUser ? currentUser.email : "guest@example.com";
      const userPhone = currentUser ? currentUser.phone || "+91 98765 43210" : "+91 98765 43210";
      const userAddress = ((_a = document.getElementById("deliveryAddressInput")) == null ? void 0 : _a.value) || ((currentUser == null ? void 0 : currentUser.address) ? typeof currentUser.address === "string" ? currentUser.address : `${currentUser.address.street || ""}, ${currentUser.address.city || ""}` : "Flat 402, Block B, Sector 18, Noida");
      const newOrderId = `ORD-${Math.floor(1e4 + Math.random() * 9e4)}`;
      const newOrder = {
        id: newOrderId,
        user_id: userId,
        customer_id: userId,
        customer_name: userName,
        customer_email: userEmail,
        customer_phone: userPhone,
        customer_address: userAddress,
        pharmacy_id: "pharm_1",
        pharmacy_name: "Apollo Pharmacy 24/7",
        pharmacy_phone: "+91 98765 12345",
        items: [...this.state.cart],
        total_amount: amount || 150,
        payment_method: paymentMethod,
        payment_status: paymentStatus || (paymentMethod === "COD" ? "Pending COD" : "Paid"),
        payment_id: txId,
        order_status: "Confirmed",
        tracking_step: 1,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        delivery_partner: {
          id: "partner_1",
          name: "Rohan Verma",
          phone: "+91 98112 33445",
          vehicle: "Hero Splendor (KA-01-EQ-9982)",
          rating: 4.9,
          otp: "8912"
        }
      };
      this.state.orders.unshift(newOrder);
      this.state.cart = [];
      this.closeModal();
      this.setCustomerTab("orders");
      this.showToast(paymentMethod === "COD" ? `\u{1F389} COD Order ${newOrderId} Placed!` : `\u{1F389} Payment Successful! Order ${newOrderId} Confirmed`);
      this.openTrackingModal(newOrderId);
    }
    openGstInvoiceModal(orderId) {
      this.paymentService.openGstInvoiceModal(orderId);
    }
    openTrackingModal(orderId) {
      const order = this.state.orders.find((o) => o.id === orderId) || this.state.orders[0];
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary);">${order.id}</div>
                        <div style="font-size:12px; color:var(--text-muted);">Estimated Arrival: <strong>12-15 Mins</strong></div>
                    </div>
                    <span class="role-badge-btn">${order.order_status}</span>
                </div>

                <div class="tracking-map-box">
                    <canvas id="liveTrackingCanvas" class="tracking-canvas"></canvas>
                </div>

                <div class="timeline-steps">
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Placed</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Accepted</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Preparing</div></div>
                    <div class="timeline-step active"><div class="step-node"><i class="fa-solid fa-motorcycle"></i></div><div class="step-label">On Way</div></div>
                    <div class="timeline-step"><div class="step-node"><i class="fa-solid fa-house"></i></div><div class="step-label">Delivered</div></div>
                </div>

                <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:44px; height:44px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <div style="font-weight:700; font-size:14px;">${order.delivery_partner.name}</div>
                            <div style="font-size:11px; color:var(--text-muted);">${order.delivery_partner.vehicle}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:11px; color:var(--text-muted);">Delivery OTP</div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary); letter-spacing:2px;">${order.delivery_partner.otp}</div>
                    </div>
                </div>
            </div>
        `);
      setTimeout(() => {
        new DeliveryTracker("liveTrackingCanvas");
      }, 100);
    }
    openAiDrawer() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px;"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--primary);"></i> MediAI Health Assistant</h3>
                
                <div id="chatBox" class="chat-messages">
                    <div class="chat-bubble bot">Hello Alex! Ask me about medicine availability, generic substitutes, or pharmacy hours.</div>
                </div>

                <div style="display:flex; gap:8px;">
                    <input type="text" id="aiQueryInput" placeholder="Ask 'Find Dolo 650' or 'Open pharmacies'..." 
                           style="flex:1; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-full); font-size:13px;"
                           onkeypress="if(event.key === 'Enter') MediApp.sendAiMessage()">
                    <button class="add-cart-btn" onclick="MediApp.sendAiMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        `);
    }
    sendAiMessage() {
      const input = document.getElementById("aiQueryInput");
      const chatBox = document.getElementById("chatBox");
      if (!input || !input.value.trim()) return;
      const query = input.value.trim();
      chatBox.innerHTML += `<div class="chat-bubble user">${query}</div>`;
      input.value = "";
      setTimeout(() => {
        const res = this.aiEngine.queryAssistant(query);
        chatBox.innerHTML += `<div class="chat-bubble bot">${res.reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 400);
    }
    async simulateOcrScan() {
      const area = document.getElementById("ocrStatusArea");
      if (!area) return;
      area.innerHTML = `
            <div style="text-align:center; padding:16px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:var(--primary); margin-bottom:8px;"></i>
                <div style="font-weight:700; font-size:13px;">AI Vision Scanning Prescription Text...</div>
            </div>
        `;
      const result = await this.aiEngine.scanPrescription();
      area.innerHTML = `
            <div style="background:var(--background); padding:16px; border-radius:var(--radius-md);">
                <div style="font-weight:800; color:var(--secondary); font-size:14px; margin-bottom:8px;"><i class="fa-solid fa-circle-check"></i> OCR Scan Complete!</div>
                <div style="font-size:12px; margin-bottom:8px;">Doctor: <b>${result.doctor}</b></div>
                <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Detected Medicines:</div>
                <ul style="font-size:12px; padding-left:18px; margin-bottom:12px;">
                    ${result.items.map((it) => `<li><b>${it.name}</b> (${it.qty} strips) - ${it.confidence} match</li>`).join("")}
                </ul>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.addOcrToCart()">
                    <i class="fa-solid fa-cart-plus"></i> Auto-Add Prescribed Medicines to Cart
                </button>
            </div>
        `;
    }
    addOcrToCart() {
      this.addToCart("med_1");
      this.addToCart("med_16");
      this.setCustomerTab("cart");
      this.showToast("Prescription items added to cart!");
    }
    showToast(message) {
      const container = document.getElementById("toastContainer");
      if (!container) return;
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:var(--primary);"></i> ${message}`;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3e3);
    }
    showModal(html) {
      const container = document.getElementById("modalContainer");
      if (!container) return;
      container.innerHTML = `<div class="modal-overlay active">${html}</div>`;
    }
    closeModal() {
      const container = document.getElementById("modalContainer");
      if (container) container.innerHTML = "";
    }
    filterCategory(catId) {
      this.customerModule.selectedCategory = catId;
      this.setCustomerTab("search");
    }
    handleSearchInput(val) {
      this.customerModule.searchQuery = val;
      this.render();
      const searchInput = document.getElementById("mainSearchInputField");
      if (searchInput) {
        searchInput.focus();
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
      }
    }
    openVoiceSearchModal() {
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:30px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:64px; height:64px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto; animation:pulse 1.5s infinite;">
                    <i class="fa-solid fa-microphone"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:8px;">Listening... Speak Medicine Name</h3>
            </div>
        `);
      setTimeout(() => {
        this.customerModule.searchQuery = "Dolo 650";
        this.closeModal();
        this.setCustomerTab("search");
        this.showToast('Voice Recognized: "Dolo 650"');
      }, 2e3);
    }
    filterPharmacies(val) {
      this.customerModule.pharmacySearchQuery = val;
      this.render();
    }
    updateOrderStatus(orderId, status, step) {
      const order = this.state.orders.find((o) => o.id === orderId);
      if (order) {
        order.order_status = status;
        if (step) order.tracking_step = step;
        if (status === "Preparing") {
          this.fcmService.notifyOrderAccepted(orderId);
        } else if (status === "Out for Delivery") {
          this.fcmService.notifyOutForDelivery(orderId);
        } else if (status === "Delivered") {
          this.fcmService.notifyDelivered(orderId);
        } else {
          this.showToast(`Order ${orderId} status set to "${status}"`);
        }
        this.render();
      }
    }
    updateStock(medId, newStock) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.stock = parseInt(newStock) || 0;
        if (med.stock < 20) {
          this.fcmService.notifyPharmacyLowStock(med.name, med.stock);
        } else {
          this.showToast(`Stock for ${med.name} updated to ${med.stock} units`);
        }
        this.render();
      }
    }
    updatePrice(medId, newPrice) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.price = parseFloat(newPrice) || med.price;
        this.showToast(`Price for ${med.name} updated to \u20B9${med.price.toFixed(2)}`);
        this.render();
      }
    }
    toggleAvailability(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        if (med.stock > 0) {
          med.previousStock = med.stock;
          med.stock = 0;
          this.showToast(`Marked ${med.name} as Unavailable (Out of Stock)`);
        } else {
          med.stock = med.previousStock || 50;
          this.showToast(`Marked ${med.name} as Available (${med.stock} units)`);
        }
        this.render();
      }
    }
    acceptOrder(orderId) {
      this.updateOrderStatus(orderId, "Preparing", 3);
      this.showToast(`\u2705 Accepted Order ${orderId}`);
    }
    rejectOrder(orderId) {
      if (confirm(`Reject order ${orderId}?`)) {
        this.updateOrderStatus(orderId, "Cancelled", 0);
        this.showToast(`\u274C Rejected Order ${orderId}`);
      }
    }
    cancelOrder(orderId) {
      if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        this.updateOrderStatus(orderId, "Cancelled", 0);
        this.showToast(`Order ${orderId} has been cancelled.`);
      }
    }
    reorder(orderId) {
      const order = this.state.orders.find((o) => o.id === orderId);
      if (order && order.items.length > 0) {
        order.items.forEach((item) => {
          this.addToCart(item.id);
        });
        this.setCustomerTab("cart");
        this.showToast(`Items from order ${orderId} added to cart!`);
      }
    }
    toggleFavoritePharmacy(pharmId) {
      if (!this.state.favoritePharmacies) this.state.favoritePharmacies = [];
      const index = this.state.favoritePharmacies.indexOf(pharmId);
      if (index > -1) {
        this.state.favoritePharmacies.splice(index, 1);
        this.showToast("Removed pharmacy from favorites \u2764\uFE0F");
      } else {
        this.state.favoritePharmacies.push(pharmId);
        this.showToast("Saved pharmacy to favorites \u2764\uFE0F");
      }
      this.render();
    }
    saveAddress(label, text) {
      if (!text) return;
      const newAddr = {
        id: `addr_${Date.now()}`,
        label: label || "Home",
        text,
        isDefault: false
      };
      this.state.savedAddresses.push(newAddr);
      this.closeModal();
      this.showToast(`Saved new address: "${label}"`);
      this.render();
    }
    applyCoupon(code) {
      if (code && code.toUpperCase() === "MEDI20") {
        this.state.appliedCoupon = "MEDI20";
        this.showToast('\u{1F389} Promo Code "MEDI20" Applied! 20% Discount Activated.');
        this.render();
      } else {
        this.showToast('\u274C Invalid Promo Code. Try "MEDI20"');
      }
    }
    openNotificationsModal() {
      const list = this.state.notifications || [];
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-bell" style="color:var(--primary);"></i> Customer Notifications</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${list.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">No new notifications.</div>
                    ` : list.map((n) => `
                        <div style="background:var(--background); padding:12px; border-radius:var(--radius-md); border-left:4px solid var(--primary);">
                            <div style="font-weight:700; font-size:14px;">${n.title}</div>
                            <div style="font-size:12px; color:var(--text-body); margin-top:2px;">${n.body}</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${n.time}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `);
    }
    setAdminTab(tab) {
      this.adminModule.activeTab = tab;
      this.render();
    }
    toggleUserStatus(userId) {
      if (!this.state.usersList) {
        this.state.usersList = [
          { id: "usr_1", name: "Alex Johnson", email: "alex@example.com", role: "customer", status: "Active" },
          { id: "usr_2", name: "Priya Sharma", email: "priya@example.com", role: "customer", status: "Active" },
          { id: "usr_pharm_1", name: "Dr. S. K. Gupta", email: "apollo@example.com", role: "pharmacy", status: "Active" },
          { id: "usr_driver_1", name: "Rohan Verma", email: "rohan@example.com", role: "delivery", status: "Active" }
        ];
      }
      const user = this.state.usersList.find((u) => u.id === userId);
      if (user) {
        user.status = user.status === "Suspended" ? "Active" : "Suspended";
        this.showToast(`User ${user.name} set to ${user.status}`);
        this.render();
      }
    }
    approvePharmacy(pharmId) {
      const pharm = this.state.pharmacies.find((p) => p.id === pharmId);
      if (pharm) {
        pharm.license_verified = true;
        this.showToast(`\u2705 Approved drug license for "${pharm.shop_name}"`);
        this.render();
      }
    }
    suspendPharmacy(pharmId) {
      const pharm = this.state.pharmacies.find((p) => p.id === pharmId);
      if (pharm) {
        if (pharm.status === "suspended") {
          pharm.status = "open";
          this.showToast(`Restored operational status for "${pharm.shop_name}"`);
        } else {
          pharm.status = "suspended";
          this.showToast(`\u{1F6AB} Suspended "${pharm.shop_name}"`);
        }
        this.render();
      }
    }
    generateAdminReport() {
      const totalRev = this.state.orders.reduce((sum, o) => sum + o.total_amount, 0);
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:6px;">Audit Report Downloaded</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Financial summary generated: Gross Revenue <strong>\u20B9${totalRev.toFixed(2)}</strong> across ${this.state.orders.length} orders.</p>
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }
    setDeliveryTab(tab) {
      this.deliveryModule.activeTab = tab;
      this.render();
    }
    toggleDriverDuty() {
      this.deliveryModule.isOnDuty = !this.deliveryModule.isOnDuty;
      const statusStr = this.deliveryModule.isOnDuty ? "ON DUTY (Online)" : "OFF DUTY (Offline)";
      this.showToast(`Driver status set to ${statusStr}`);
      this.render();
    }
    acceptDelivery(orderId) {
      this.updateOrderStatus(orderId, "Out for Delivery", 4);
      this.showToast(`\u2705 Delivery Accepted for Order ${orderId}`);
    }
    rejectDelivery(orderId) {
      if (confirm(`Decline delivery assignment for ${orderId}?`)) {
        const order = this.state.orders.find((o) => o.id === orderId);
        if (order) order.delivery_partner = null;
        this.showToast(`Decline assignment for ${orderId}`);
        this.render();
      }
    }
    async simulateOcrScan(sourceType = "gallery") {
      this.showToast(`\u{1F4F7} Accessing ${sourceType.toUpperCase()} & Running AI OCR Scanner...`);
      const results = await this.aiEngine.scanPrescription(null, sourceType);
      this.customerModule.ocrResults = results;
      this.showToast("\u2705 OCR Extraction Complete! Extracted 4 prescription medicines.");
      this.render();
    }
    addPrescriptionItemsToCart() {
      const results = this.customerModule.ocrResults;
      if (results && results.items) {
        results.items.forEach((item) => {
          if (item.medId) {
            for (let i = 0; i < (item.qty || 1); i++) {
              this.addToCart(item.medId);
            }
          }
        });
        this.showToast("\u{1F389} Added all prescription medicines to cart!");
        this.setCustomerTab("cart");
      }
    }
    approvePrescription(id) {
      const rx = this.state.prescriptions.find((p) => p.id === id);
      if (rx) {
        rx.status = "Approved";
        this.showToast(`Prescription #${id} Approved!`);
        this.render();
      }
    }
    rejectPrescription(id) {
      const rx = this.state.prescriptions.find((p) => p.id === id);
      if (rx) {
        rx.status = "Rejected";
        this.showToast(`Prescription #${id} Rejected.`);
        this.render();
      }
    }
    openAddMedicineModal() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;">Add Medicine to Inventory</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <input type="text" id="newMedName" placeholder="Medicine Brand Name (e.g. Crocin 500mg)" style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    <input type="text" id="newMedGeneric" placeholder="Generic Composition (e.g. Paracetamol)" style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    <div style="display:flex; gap:10px;">
                        <input type="number" id="newMedPrice" placeholder="Price (\u20B9)" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        <input type="number" id="newMedStock" placeholder="Stock Qty" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <button class="add-cart-btn" style="justify-content:center; padding:12px;" onclick="MediApp.saveNewMedicine()">
                        <i class="fa-solid fa-check"></i> Save Medicine
                    </button>
                </div>
            </div>
        `);
    }
    saveNewMedicine() {
      var _a, _b, _c, _d;
      const name = (_a = document.getElementById("newMedName")) == null ? void 0 : _a.value;
      const generic = (_b = document.getElementById("newMedGeneric")) == null ? void 0 : _b.value;
      const price = parseFloat((_c = document.getElementById("newMedPrice")) == null ? void 0 : _c.value) || 50;
      const stock = parseInt((_d = document.getElementById("newMedStock")) == null ? void 0 : _d.value) || 100;
      if (!name) {
        this.showToast("Please enter a medicine name");
        return;
      }
      const newMed = {
        id: `med_${Date.now()}`,
        name,
        generic_name: generic || name,
        category: "pain_relief",
        price,
        original_price: price * 1.2,
        stock,
        dosage: "1 Tablet Daily",
        pharmacy_id: "pharm_1",
        pharmacy_name: "Apollo Pharmacy 24/7",
        pharmacy_distance: "0.8 km",
        requires_prescription: false,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
        expiry_date: "2027-12-31"
      };
      this.state.medicines.unshift(newMed);
      this.closeModal();
      this.showToast(`Added "${name}" to Inventory`);
      this.render();
    }
    editMedicine(id) {
      const med = this.state.medicines.find((m) => m.id === id);
      if (!med) return;
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;">Edit Medicine: ${med.name}</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="font-size:12px; color:var(--text-muted);">Price (\u20B9)</label>
                        <input type="number" id="editMedPrice" value="${med.price}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-muted);">Stock Units</label>
                        <input type="number" id="editMedStock" value="${med.stock}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <button class="add-cart-btn" style="justify-content:center; padding:12px;" onclick="MediApp.saveEditMedicine('${id}')">
                        <i class="fa-solid fa-check"></i> Update Inventory
                    </button>
                </div>
            </div>
        `);
    }
    saveEditMedicine(id) {
      var _a, _b;
      const med = this.state.medicines.find((m) => m.id === id);
      if (med) {
        const price = parseFloat((_a = document.getElementById("editMedPrice")) == null ? void 0 : _a.value);
        const stock = parseInt((_b = document.getElementById("editMedStock")) == null ? void 0 : _b.value);
        if (price) med.price = price;
        if (stock !== void 0) med.stock = stock;
        this.closeModal();
        this.showToast(`Updated "${med.name}"`);
        this.render();
      }
    }
    deleteMedicine(id) {
      const med = this.state.medicines.find((m) => m.id === id);
      if (confirm(`Are you sure you want to delete ${(med == null ? void 0 : med.name) || "this item"}?`)) {
        this.state.medicines = this.state.medicines.filter((m) => m.id !== id);
        this.showToast("Medicine deleted from inventory");
        this.render();
      }
    }
    openOtpVerificationModal(orderId) {
      var _a;
      const order = this.state.orders.find((o) => o.id === orderId) || this.state.orders[0];
      const otp = ((_a = order.delivery_partner) == null ? void 0 : _a.otp) || "8912";
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-shield-keyhole"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:4px;">Customer Delivery OTP</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Ask customer for 4-digit code (Hint: ${otp})</p>
                <input type="text" id="otpInput" placeholder="Enter 4-digit OTP" maxlength="4" style="text-align:center; font-size:24px; letter-spacing:8px; font-weight:800; padding:10px; border:2px solid var(--primary); border-radius:var(--radius-md); width:180px; margin-bottom:16px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.verifyDeliveryOtp('${order.id}', '${otp}')">
                    <i class="fa-solid fa-circle-check"></i> Complete Delivery
                </button>
            </div>
        `);
    }
    verifyDeliveryOtp(orderId, expectedOtp) {
      var _a, _b;
      const inputOtp = (_b = (_a = document.getElementById("otpInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (inputOtp === expectedOtp || inputOtp === "8912") {
        this.updateOrderStatus(orderId, "Delivered", 5);
        this.closeModal();
        this.showToast("\u2705 Order Delivered Successfully!");
      } else {
        this.showToast("\u274C Invalid OTP! Please check with customer.");
      }
    }
    openAddressModal() {
      const currentLoc = googleMapsService.getUserLocation();
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:4px;"><i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i> Select / Detect User Location</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Active: <strong>${currentLoc.label}</strong></p>

                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:14px; margin-bottom:14px;" onclick="MediApp.detectLiveLocation()">
                    <i class="fa-solid fa-location-arrow"></i> Detect My Live GPS Location
                </button>

                <div style="text-align:center; font-size:11px; color:var(--text-muted); margin-bottom:14px; position:relative;">
                    <span style="background:var(--card-bg); padding:0 8px; position:relative; z-index:1;">OR SEARCH MANUALLY</span>
                    <hr style="position:absolute; top:50%; left:0; right:0; border:0; border-top:1px solid var(--card-border); margin:0;">
                </div>

                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    <input type="text" id="manualLocationInput" placeholder="Enter city, sector or landmark (e.g. Indiranagar, Bengaluru)..." style="flex:1; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                    <button class="btn-secondary" style="padding:10px 14px; font-size:13px;" onclick="MediApp.setManualLocationFromInput()">Save</button>
                </div>

                <div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">SAVED ADDRESSES</div>
                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
                    ${(this.state.savedAddresses || []).map((addr) => `
                        <div style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--background);" onclick="MediApp.selectSavedAddress('${addr.label}', '${addr.text}')">
                            <div style="font-weight:700; font-size:13px;"><i class="fa-solid fa-house"></i> ${addr.label}</div>
                            <div style="font-size:11px; color:var(--text-muted);">${addr.text}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `);
    }
    async detectLiveLocation() {
      this.showToast("\u{1F4E1} Requesting Browser GPS Permission...");
      const res = await googleMapsService.requestBrowserLocation();
      if (res.success) {
        this.closeModal();
        this.showToast(res.message);
        this.render();
      } else {
        this.showToast(`\u26A0\uFE0F ${res.message} Please type address manually.`);
      }
    }
    async setManualLocationFromInput() {
      var _a, _b;
      const val = (_b = (_a = document.getElementById("manualLocationInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!val) {
        this.showToast("Please enter an address or city name.");
        return;
      }
      this.showToast(`\u{1F50D} Locating "${val}"...`);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const lat = parseFloat(parseFloat(data[0].lat).toFixed(4));
            const lng = parseFloat(parseFloat(data[0].lon).toFixed(4));
            const displayLabel = data[0].display_name.split(",").slice(0, 2).join(", ");
            googleMapsService.setManualLocation(displayLabel || val, lat, lng);
          } else {
            googleMapsService.setManualLocation(val);
          }
        } else {
          googleMapsService.setManualLocation(val);
        }
      } catch (e) {
        googleMapsService.setManualLocation(val);
      }
      this.closeModal();
      this.showToast(`\u{1F4CD} Real-Time Location Updated: "${val}"`);
      this.render();
    }
    selectSavedAddress(label, text) {
      googleMapsService.setManualLocation(`${label}: ${text}`);
      this.closeModal();
      this.showToast(`\u{1F4CD} Selected Address: ${label}`);
      this.render();
    }
    openHelpSupportModal() {
      this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; margin-bottom:16px;">
                    <div style="width:56px; height:56px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 10px auto;">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h3 style="font-size:18px;">MediFind 24/7 Support</h3>
                    <p style="font-size:12px; color:var(--text-muted);">We are here to help you with medicine orders, prescription uploads, or pharmacy queries.</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    <a href="tel:+919876543210" class="add-cart-btn" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-phone"></i> Call Emergency Support (+91 98765 43210)
                    </a>
                    <a href="mailto:support@medifind.health" class="btn-secondary" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-envelope"></i> Email Customer Care
                    </a>
                </div>
                <button class="btn-secondary" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }
    openAboutModal() {
      this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px; text-align:center;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div class="splash-logo" style="margin:0 auto 14px auto; width:64px; height:64px; font-size:32px;">
                    <i class="fa-solid fa-notes-medical"></i>
                </div>
                <h2 style="font-size:20px; font-weight:800; margin-bottom:2px;">MediFind</h2>
                <div style="font-size:12px; color:var(--primary); font-weight:700; margin-bottom:12px;">"Find Medicines. Find Pharmacies. Get Care Faster."</div>
                <p style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
                    MediFind is a modern, mobile-first real-time medicine discovery and 15-minute home delivery platform built for final-year project demonstration using HTML5 Geolocation, Google Places API, PWA, and Socket.IO.
                </p>
                <div style="font-size:11px; color:var(--text-muted); background:var(--background); padding:10px; border-radius:var(--radius-md); margin-bottom:16px;">
                    Version 2.5.0 \u2022 PWA Enabled \u2022 License: Open Demonstration
                </div>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Got it!</button>
            </div>
        `);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        window.MediApp = new MediFindApp();
      } catch (e) {
        console.error("MediFindApp init error:", e);
      }
    });
  } else {
    try {
      window.MediApp = new MediFindApp();
    } catch (e) {
      console.error("MediFindApp init error:", e);
    }
  }
})();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
