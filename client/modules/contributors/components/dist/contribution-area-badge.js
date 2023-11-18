"use strict";
exports.__esModule = true;
var react_1 = require("react");
var get_contribution_area_text_1 = require("@/modules/contributors/uilts/get-contribution-area-text");
var badge_1 = require("@/components/ui/badge");
var ContributionAreaBadge = function (_a) {
    var area = _a.area;
    var text = get_contribution_area_text_1["default"](area);
    return react_1["default"].createElement(badge_1.Badge, null, text);
};
exports["default"] = ContributionAreaBadge;
