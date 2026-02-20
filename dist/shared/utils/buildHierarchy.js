"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHierarchy = void 0;
const buildHierarchy = (departments) => {
    const deptMap = new Map();
    const roots = [];
    // Prepare department nodes
    departments.forEach(d => {
        deptMap.set(d._id.toString(), { ...d, children: [] });
    });
    // Build department tree
    departments.forEach(d => {
        if (d.parentDepartment) {
            const parent = deptMap.get(d.parentDepartment.toString());
            parent?.children.push(deptMap.get(d._id.toString()));
        }
        else {
            roots.push(deptMap.get(d._id.toString()));
        }
    });
    // Build user reporting hierarchy inside each department
    const buildUserTree = (users) => {
        const map = new Map();
        const roots = [];
        users.forEach(u => map.set(u._id.toString(), { ...u, children: [] }));
        users.forEach(u => {
            if (u.reportingManager && map.has(u.reportingManager.toString())) {
                map.get(u.reportingManager.toString()).children.push(map.get(u._id.toString()));
            }
            else {
                roots.push(map.get(u._id.toString()));
            }
        });
        return roots;
    };
    // Attach user hierarchy to each department
    const attachUsers = (dept) => {
        // dept.userHierarchy = buildUserTree(dept.employees || []);
        dept.children.forEach(attachUsers);
    };
    roots.forEach(attachUsers);
    return roots;
};
exports.buildHierarchy = buildHierarchy;
//# sourceMappingURL=buildHierarchy.js.map