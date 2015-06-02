var setup = {
    init: function () {
        var vm = new viewModel();
        ko.applyBindings(vm);
    }
};

var viewModel = function () {
    var self = this;
    self.test = ko.observable("hejhej");
};


$(function () {
    $(document).ready(function () {
        setup.init();
    });
});