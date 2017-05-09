/**
 * Created by phonnavalli on 5/8/17.
 */

dashboard.service('formService', function() {
    return {
        getUserNameFromId:function (id) {
            var found = $filter('filter')($scope.User, {id: id}, true);
            if (found.length) {
                $scope.User.idUser = JSON.stringify(found[0]);
            } else {
                $scope.idUser = 'Not found';
            }
        },

        getType:function (x) {
            return typeof(x) ;
        },

        getReadOnly:function(field){
            readyOnly = false;
            field == 'created_by'?readOnly = true:readOnly=false;
            return readOnly;

        },

        editData:function (id, arrayRef) {
            //search user and update it
            arrayRef.objectIndex = id;
            arrayRef.userObject = angular.copy(arrayRef[id]);
            return arrayRef.userObject;
        },

        isFound:function (item,arrayObj) {
            var itemFound = $.grep(arrayObj, function(e){ return e.id == item.id; });
            var found = false;
            itemFound.length > 0?found=true:found=false;
            return found;


        },


    }

});
