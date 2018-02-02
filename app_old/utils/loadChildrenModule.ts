export const loadChildrenModule = (function (isAOT) {

    const module = isAOT ? _moduleAOT : _module;
    const filepath = isAOT ? _filepathAOT : _filepath;

    return function (filename, moduleName) {
        return () => {
            return System.import(filepath(filename))
                .then(mod => mod[module(moduleName)]);
        };
    };

} (process.env.AOT));

function _filepath(filename) {
    return `/${filename}/${filename}.module`;
}
function _filepathAOT(filename) {
    return `/${filename}/${filename}.module.ngfactory`;
}

function _module(moduleName) {
    return moduleName;
}
function _moduleAOT(moduleName) {
    return `${moduleName}NgFactory`;
}