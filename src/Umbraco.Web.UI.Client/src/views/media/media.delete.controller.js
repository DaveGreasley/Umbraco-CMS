/**
 * @ngdoc controller
 * @name Umbraco.Editors.ContentDeleteController
 * @function
 * 
 * @description
 * The controller for deleting content
 */
function MediaDeleteController($scope, mediaResource, treeService, navigationService, editorState, $location) {

    $scope.performDelete = function() {

        //mark it for deletion (used in the UI)
        $scope.currentNode.loading = true;

        mediaResource.deleteById($scope.currentNode.id).then(function () {
            $scope.currentNode.loading = false;

            //get the root node before we remove it
            var rootNode = treeService.getTreeRoot($scope.currentNode);

            treeService.removeNode($scope.currentNode);

            if (rootNode) {
                //ensure the recycle bin has child nodes now            
                var recycleBin = treeService.getDescendantNode(rootNode, -21);
                if (recycleBin) {
                    recycleBin.hasChildren = true;
                }
            }
            
            //if the current edited item is the same one as we're deleting, we need to navigate elsewhere
            if (editorState.current && editorState.current.id == $scope.currentNode.id) {

            	//If the deleted item lived at the root then just redirect back to the root, otherwise redirect to the item's parent
            	var location = "/media";
            	if ($scope.currentNode.parentId != -1)
            		location = "/media/media/edit/" + $scope.currentNode.parentId;

                $location.path(location);
            }

            navigationService.hideMenu();

        },function() {
            $scope.currentNode.loading = false;
        });
    };

    $scope.cancel = function() {
        navigationService.hideDialog();
    };
}

angular.module("umbraco").controller("Umbraco.Editors.Media.DeleteController", MediaDeleteController);
