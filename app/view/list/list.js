var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
//var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var page;

var groceryList = new GroceryListViewModel([]);
var pageData = new Observable({
    groceryList: groceryList,
    grocery: "",
    disc : ""
});

exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("groceryList");

  //  if (page.ios) {
    //    swipeDelete.enable(listView, function(index) {
      //      groceryList.delete(index);
       // });
    //}
    
    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("grocery").trim() !== "" && pageData.get("disc").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("grocery").dismissSoftInput();
         page.getViewById("disc").dismissSoftInput();
        groceryList.add(pageData.get("grocery"),pageData.get("disc"))
            .catch(function(error) {
               // console.log(error);
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("disc", "");
        pageData.set("grocery", "");
         
    } else {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
    }
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = groceryList.length; i < size ; i++) {
        list.push(groceryList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};

//exports.delete = function(args) {
    //var item = args.view.bindingContext;
    //var index = groceryList.indexOf(item);
    //groceryList.delete(index);
//};

var app = require("application");
var color = require("color");
 
function creatingCheckbox(args) {
     var cb = new android.support.v7.widget.AppCompatCheckBox(app.android.currentContext);
     var backgroundColor = new color.Color("#F44336");
     cb.setButtonTintList(android.content.res.ColorStateList.valueOf(backgroundColor.android));
     cb.setText("");
     cb.setChecked(false);
     args.view = cb;
}
 
exports.creatingCheckbox = creatingCheckbox;