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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var design_system_1 = require("@adminjs/design-system");
var axios_1 = require("axios");
var styles_components_1 = require("./styles-components");
var react_modal_1 = require("react-modal");
var react_select_1 = require("react-select");
var moment_1 = require("moment");
var HeaderClass = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
};
var CardClass = {
    boxShadow: '1px 2px 6px rgba(0, 0, 0, .28)',
    boxSizing: 'border-box',
    margin: '10px 15px',
    width: '150px',
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center'
};
var hostUrl = 'http://192.168.222.45:4000/api/v1/';
var ViewPage = function (props) {
    var _a = (0, react_1.useState)(null), ev = _a[0], setEv = _a[1];
    var _b = (0, react_1.useState)([]), stages = _b[0], setStages = _b[1];
    var _c = (0, react_1.useState)(false), createStageDialogOpen = _c[0], setCreateStageDialogOpen = _c[1];
    var _d = (0, react_1.useState)(0), stageNumber = _d[0], setStageNumber = _d[1];
    var _e = (0, react_1.useState)(new Date()), submissionStart = _e[0], setSubmissionStart = _e[1];
    var _f = (0, react_1.useState)(new Date), submissionEnd = _f[0], setSubmissionEnd = _f[1];
    var _g = (0, react_1.useState)({ label: 'Felitering', value: 1 }), stageStatus = _g[0], setStageStatus = _g[1];
    var _h = (0, react_1.useState)(''), stageTitle = _h[0], setStageTitle = _h[1];
    (0, react_1.useEffect)(function () {
        loadData();
    }, []);
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, axios_1.default.post(hostUrl + 'event/admin-display', { event_id: props.record.params.id })];
                case 1:
                    res = (_a.sent()).data;
                    console.log(res);
                    if (res && (res === null || res === void 0 ? void 0 : res.status)) {
                        setEv(res.data);
                        loadEventStages(res.data);
                    }
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var loadEventStages = function (v) {
        var _a;
        var num = v.stage_count;
        var arr = [];
        var _loop_1 = function (i) {
            var obj = {};
            if ((_a = v === null || v === void 0 ? void 0 : v.event_stages) === null || _a === void 0 ? void 0 : _a.length) {
                var placeholder = v.event_stages.filter(function (el, index) { return el.stage_number === i; });
                if (placeholder === null || placeholder === void 0 ? void 0 : placeholder.length) {
                    obj = placeholder[0];
                }
                else {
                    obj['stage_number'] = i;
                }
            }
            else {
                obj['stage_number'] = i;
            }
            arr.push(obj);
        };
        for (var i = 1; i <= num; i++) {
            _loop_1(i);
        }
        setStages(arr);
    };
    var canPublish = function (num, current, date) {
        if (num !== current)
            return false;
        if ((0, moment_1.default)(date).isAfter(new Date()))
            return false;
        return true;
    };
    var handleOpenCreateStageDialog = function (stageNum) {
        setStageNumber(stageNum);
        setCreateStageDialogOpen(true);
    };
    var hanldeCreateStage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!stageTitle || !stageStatus || !submissionEnd || !submissionStart)
                        return [2];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, axios_1.default.post(hostUrl + 'event/stage', {
                            stage_number: stageNumber,
                            status: stageStatus.value,
                            submission_start: submissionStart,
                            submission_end: submissionEnd,
                            title: stageTitle,
                            event_id: ev.id
                        })];
                case 2:
                    res = (_a.sent()).data;
                    if (res === null || res === void 0 ? void 0 : res.status) {
                        setStageNumber(0);
                        setStageTitle('');
                        setSubmissionStart(new Date());
                        setSubmissionEnd(new Date());
                        setCreateStageDialogOpen(false);
                        loadData();
                        return [2];
                    }
                    return [3, 4];
                case 3:
                    err_2 = _a.sent();
                    return [2, alert(err_2 === null || err_2 === void 0 ? void 0 : err_2.message)];
                case 4: return [2];
            }
        });
    }); };
    var handleDeactivateVoting = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, axios_1.default.post(hostUrl + 'event/deactivate-voting', { event_id: ev === null || ev === void 0 ? void 0 : ev.id })];
                case 1:
                    res = (_a.sent()).data;
                    if (res && (res === null || res === void 0 ? void 0 : res.status)) {
                        loadData();
                        return [2];
                    }
                    if (res && (res === null || res === void 0 ? void 0 : res.status) === false) {
                        alert((res === null || res === void 0 ? void 0 : res.message) || 'message');
                    }
                    return [3, 3];
                case 2:
                    err_3 = _a.sent();
                    alert(err_3 === null || err_3 === void 0 ? void 0 : err_3.message);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var handleActivateVoting = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, axios_1.default.post(hostUrl + 'event/activate-voting', { event_id: ev === null || ev === void 0 ? void 0 : ev.id })];
                case 1:
                    res = (_a.sent()).data;
                    if (res && (res === null || res === void 0 ? void 0 : res.status)) {
                        loadData();
                        return [2];
                    }
                    if (res && (res === null || res === void 0 ? void 0 : res.status) === false) {
                        alert((res === null || res === void 0 ? void 0 : res.message) || 'message');
                    }
                    return [3, 3];
                case 2:
                    err_4 = _a.sent();
                    alert(err_4 === null || err_4 === void 0 ? void 0 : err_4.message);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var handleStagePublish = function (num) { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, axios_1.default.post(hostUrl + 'event/stage-publish', { stage_id: num })];
                case 1:
                    res = (_a.sent()).data;
                    if (res && (res === null || res === void 0 ? void 0 : res.status)) {
                        loadData();
                        return [2];
                    }
                    if (res && (res === null || res === void 0 ? void 0 : res.status) === false) {
                        alert((res === null || res === void 0 ? void 0 : res.message) || 'message');
                    }
                    return [3, 3];
                case 2:
                    err_5 = _a.sent();
                    alert((err_5 === null || err_5 === void 0 ? void 0 : err_5.message) || 'server error');
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var handleStageUnpublish = function (num) { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, axios_1.default.post(hostUrl + 'event/stage-unpublish', { stage_id: num })];
                case 1:
                    res = (_a.sent()).data;
                    if (res && (res === null || res === void 0 ? void 0 : res.status)) {
                        loadData();
                        return [2];
                    }
                    if (res && (res === null || res === void 0 ? void 0 : res.status) === false) {
                        alert((res === null || res === void 0 ? void 0 : res.message) || 'message');
                    }
                    return [3, 3];
                case 2:
                    err_6 = _a.sent();
                    alert((err_6 === null || err_6 === void 0 ? void 0 : err_6.message) || 'server error');
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    return (<design_system_1.Box style={{ marginBottom: "25px" }}>
            <div style={HeaderClass}>
                <div style={CardClass}><h1>Title:</h1>{props.record.params.title}</div>
                
                <div style={CardClass}><h1>Start Date:</h1>{(0, moment_1.default)(props.record.params.start_date).format('DD/MM/YYYY')}</div>
                
                <div style={CardClass}><h1>End Date:</h1>{(0, moment_1.default)(props.record.params.end_date).format('DD/MM/YYYY')}</div>
                
                <div style={CardClass}>
                    <h1>Registration Start:</h1>
                    {(0, moment_1.default)(props.record.params.registration_start).format('DD/MM/YYYY')}
                </div>
                
                <div style={CardClass}>
                    <h1>Registration End:</h1>
                    {(0, moment_1.default)(props.record.params.registration_end).format('DD/MM/YYYY')}
                </div>
                
                <div style={CardClass}>
                    <h1>Subscription Count:</h1>
                    {ev === null || ev === void 0 ? void 0 : ev.subscription_count}
                </div>
                
                <div style={CardClass}>
                    <h1>Participants Count</h1>
                    {ev === null || ev === void 0 ? void 0 : ev.participants_count}
                </div>
            </div>

            <styles_components_1.CardsWrapper>
                {stages.map(function (item, i) {
            return ((item === null || item === void 0 ? void 0 : item.id) ?
                <styles_components_1.EventStageCard key={"evenn-stage-card-".concat(i)}>
                                <p>Title: {item.title}</p>
                                <p>Submission Start: {(0, moment_1.default)(item.submission_start).format('DD/MM/YYYY')}</p>
                                <p>Submission End: {(0, moment_1.default)(item.submission_end).format('DD/MM/YYYY')}</p>
                                {(item === null || item === void 0 ? void 0 : item.status) === 1 ?
                        <design_system_1.Button onClick={function () { return handleStagePublish(item.id); }} disabled={!canPublish(item.stage_number, ev.current_stage, item.submission_end)}>Publish</design_system_1.Button> :
                        <design_system_1.Button onClick={function () { return handleStageUnpublish(item.id); }}>Unpublish</design_system_1.Button>}
                            </styles_components_1.EventStageCard> :
                <design_system_1.Button onClick={function () { return handleOpenCreateStageDialog(item.stage_number); }} style={{ margin: '0 5px' }} key={"evenn-stage-card-".concat(i)}>Create Event {item.stage_number}</design_system_1.Button>);
        })}
            </styles_components_1.CardsWrapper>

            <styles_components_1.ActionsWrapper>
                {(ev === null || ev === void 0 ? void 0 : ev.can_vote) ?
            <design_system_1.Button onClick={handleDeactivateVoting}>Deactivate Voting</design_system_1.Button> :
            <design_system_1.Button onClick={handleActivateVoting}>Activate Voting</design_system_1.Button>}
            </styles_components_1.ActionsWrapper>

            <react_modal_1.default style={styles_components_1.StageCreateDialogStyles} isOpen={createStageDialogOpen}>
                <styles_components_1.CreateStageDialog>
                    <h1 className="header">Create Stage: {stageNumber}</h1>
                    <div className="form-control">
                        <label>Title:</label>
                        <design_system_1.Input className='input' type="text" value={stageTitle} onChange={function (e) { return setStageTitle(e.target.value); }}/>
                    </div>
                    <div className="form-control">
                        <label>Submission Start:</label>
                        <design_system_1.Input min={new Date()} className='input' type="date" value={submissionStart} onChange={function (e) { return setSubmissionStart(e.target.value); }}/>
                    </div>
                    <div className="form-control">
                        <label>Submission end:</label>
                        <design_system_1.Input min={new Date()} className='input' type="date" value={submissionEnd} onChange={function (e) { return setSubmissionEnd(e.target.value); }}/>
                    </div>
                    <div className="form-control">
                        <label>Status:</label>
                        <react_select_1.default className='input' value={stageStatus} options={[{ label: 'Filtering', value: 1 }, { label: 'Published', value: 2 }]} onChange={function (e) { return setStageStatus(e.value); }}/>
                    </div>

                    <div className="actions">
                        <design_system_1.Button onClick={function () { return setCreateStageDialogOpen(false); }}>Cancel</design_system_1.Button>
                        <design_system_1.Button style={{ marginLeft: 10 }} onClick={hanldeCreateStage}>Save</design_system_1.Button>
                    </div>
                </styles_components_1.CreateStageDialog>
            </react_modal_1.default>
        </design_system_1.Box>);
};
exports.default = ViewPage;
