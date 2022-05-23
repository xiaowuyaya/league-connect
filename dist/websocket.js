"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.LeagueWebSocket = void 0;
const https_1 = __importDefault(require("https"));
const ws_1 = __importDefault(require("ws"));
/**
 * WebSocket extension
 */
class LeagueWebSocket extends ws_1.default {
    constructor(address, options) {
        super(address, options);
        this.subscriptions = new Map();
        // Subscribe to Json API
        this.on('open', () => {
            this.send(JSON.stringify([5, 'OnJsonApiEvent']));
        });
        // Attach the LeagueWebSocket subscription hook
        this.on('message', (content) => {
            var _a;
            // Attempt to parse into JSON and dispatch events
            try {
                const json = JSON.parse(content);
                const [res] = json.slice(2);
                if (this.subscriptions.has(res.uri)) {
                    (_a = this.subscriptions.get(res.uri)) === null || _a === void 0 ? void 0 : _a.forEach((cb) => {
                        cb(res.data, res);
                    });
                }
            }
            catch (_b) { }
        });
    }
    subscribe(path, effect) {
        var _a;
        const p = `/${trim(path)}`;
        if (!this.subscriptions.has(p)) {
            this.subscriptions.set(p, [effect]);
        }
        else {
            (_a = this.subscriptions.get(p)) === null || _a === void 0 ? void 0 : _a.push(effect);
        }
    }
    unsubscribe(path) {
        const p = `/${trim(path)}`;
        this.subscriptions.delete(p);
    }
}
exports.LeagueWebSocket = LeagueWebSocket;
function connect(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `wss://riot:${credentials.password}@127.0.0.1:${credentials.port}`;
        return new LeagueWebSocket(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64')
            },
            agent: new https_1.default.Agent(typeof (credentials === null || credentials === void 0 ? void 0 : credentials.certificate) === 'undefined'
                ? {
                    rejectUnauthorized: false
                }
                : {
                    ca: credentials === null || credentials === void 0 ? void 0 : credentials.certificate
                })
        });
    });
}
exports.connect = connect;
/**
 * Trim slashes in front of a string
 * @param s
 */
function trim(s) {
    let r = s;
    while (r.startsWith('/')) {
        r = r.substr(1);
    }
    return r;
}
