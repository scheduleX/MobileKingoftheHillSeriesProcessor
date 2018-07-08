var EntitySystem;
(function (EntitySystem) {
    var EntitySet = /** @class */ (function () {
        function EntitySet(options) {
            this.spreadSheet = options.spreadSheet;
            this.tableName = options.tableName;
        }
        EntitySet.prototype.load = function () {
            return Loader.loadEntities(this.spreadSheet, this.tableName);
        };
        EntitySet.prototype.update = function (entities) {
            Updater.updateEntities(this.spreadSheet, this.tableName, entities);
        };
        return EntitySet;
    }());
    EntitySystem.EntitySet = EntitySet;
    var Loader = /** @class */ (function () {
        function Loader() {
        }
        Loader.loadEntities = function (spreadSheet, tableName) {
            var tableSheet = spreadSheet.getSheetByName(tableName);
            var rows = tableSheet.getLastRow();
            var columns = tableSheet.getLastColumn();
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = range.getValues();
            var propertyNames = values.shift();
            var entities = new Array();
            for (var key in values) {
                if (values.hasOwnProperty(key)) {
                    var element = values[key];
                    var entity = Loader.loadEntity(propertyNames, element);
                    entities.push(entity);
                }
            }
            return entities;
        };
        Loader.loadEntity = function (propertyNames, row) {
            var entity = {};
            for (var propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++) {
                entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
            }
            return entity;
        };
        return Loader;
    }());
    var Updater = /** @class */ (function () {
        function Updater() {
        }
        Updater.updateEntities = function (spreadSheet, tableName, entities) {
            var tableSheet = spreadSheet.getSheetByName(tableName);
            var keys = Object.keys(entities[0]);
            var rows = entities.length + 1;
            var columns = keys.length;
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = [keys];
            for (var key in entities) {
                if (entities.hasOwnProperty(key)) {
                    var element = entities[key];
                    var rowValues = Updater.generateEntityRow(element);
                    values.push(rowValues);
                }
            }
            tableSheet.clearContents();
            return range.setValues(values);
        };
        Updater.generateEntityRow = function (entity) {
            var row = [];
            for (var key in entity) {
                if (entity.hasOwnProperty(key)) {
                    var element = entity[key];
                    row.push(element);
                }
            }
            return row;
        };
        return Updater;
    }());
})(EntitySystem || (EntitySystem = {}));
function EntitySystemTest() {
    var newPlayerSet = Array();
    PlayerList.forEach(function (x) {
        var playerEntity = new PlayerEntity();
        playerEntity.id = getHash(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, x.name + x.joinDate, Utilities.Charset.UTF_8));
        playerEntity.name = x.name;
        playerEntity.joinDate = x.joinDate;
        newPlayerSet.push(playerEntity);
    });
    function getHash(numbers) {
        var output = "";
        numbers.forEach(function (element) {
            output += (element < 0 ? element + 256 : element).toString(16);
        });
        return output;
    }
    PlayerEntitySet.update(newPlayerSet);
}
