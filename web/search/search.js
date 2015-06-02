var lbsappstore = {
    init: function () {
        $.getJSON('/getdata').success(function (data) {
            //console.log(data)
            //var vm = new viewModel();
            //vm.populateFromRawData(data)
            //ko.applyBindings(vm);
            //$('pre code').each(function (i, e) { hljs.highlightBlock(e) });
            return populateFromRawData(data);
        });
    }
};

var viewModel = function () {
    var self = this;
    self.Beverages = ko.observableArray();
    self.BeveragesToShow = ko.observableArray();
    self.searchValue = ko.observable($('#searchValue').val()).extend({throttle:700});
    self.activeBeverage = ko.observable(null);
    self.sortorderpricehigh = ko.observable(false);
    self.sortValue = ko.observable('Sortera');

    self.myFavorites = ko.observableArray();
    
    //Loads the data
    $.getJSON('/getdata').success(function (data) {
        self.populateFromRawData(data);
    });

    self.populateFromRawData = function (rawData) {
        console.log("nu kör vi!")
        $.each(rawData.artiklar.artikel, function(index, art){
            var art = new Beverage(rawData.artiklar.artikel[index]);
            self.Beverages.push(art);          
        });
    }
    self.searchValue.subscribe(function(searchString){
        self.sortValue('Sortera');
        if(searchString.length >= 3){    
        self.BeveragesToShow.removeAll();
        $.each(self.Beverages(), function(index, beverage){
            if(index< 1000000){
                if(beverage.string.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ){
                    self.BeveragesToShow.push(beverage);
                }
            }
        }); 
        }
         else{
            self.BeveragesToShow.removeAll();
         }
    });

    self.highprice = function(){
        self.sortorderpricehigh(true);
        self.BeveragesToShow.sort(sortResult); 
        self.sortValue('Dyrast först');
    }
    self.lowprice = function(){
        self.sortorderpricehigh(false);
        self.BeveragesToShow.sort(sortResult); 
        self.sortValue('Billigast först');
    }

    self.signin = function(){
        $.post('/login',{ username: "admin", password: "admin" }).success(function (data) {
            console.log(data)
        });
    }

    function sortResult(a,b){
            if(self.sortorderpricehigh()){
                console.log("Dyrast");
                if(a){
                    if(b){
                        if(Math.round(a.Prisinklmoms) < Math.round(b.Prisinklmoms)){
                            return 1
                        }
                        if(Math.round(b.Prisinklmoms) < Math.round(a.Prisinklmoms)){
                            return -1
                        } 
                        else{
                            return 0
                        }   
                    }
                }
            }

            if(!self.sortorderpricehigh()){
                console.log("billigast");
                if(a){
                    if(b){
                        if(Math.round(a.Prisinklmoms) > Math.round(b.Prisinklmoms)){
                            return 1
                        }
                        if(Math.round(b.Prisinklmoms) > Math.round(a.Prisinklmoms)){
                            return -1
                        } 
                        else{
                            return 0
                        }   
                    }
                }
            }
    }

    function Beverage(rawBeverage){
        this.name = rawBeverage.Namn;
        this.name2 = rawBeverage.Namn2;
        this.percent = rawBeverage.Alkoholhalt;
        this.literprice = rawBeverage.PrisPerLiter;
        this.nr = rawBeverage.nr;
        this.Prisinklmoms = Math.round(rawBeverage.Prisinklmoms);
        this.Volymiml = rawBeverage.Volymiml;
        this.Producent = rawBeverage.Producent;
        this.Forpackning = rawBeverage.Forpackning;
        this.Varugrupp = rawBeverage.Varugrupp;
        this.url = GetMedia(rawBeverage);
        this.selected = ko.observable(false);
        this.Ursprunglandnamn = rawBeverage.Ursprunglandnamn;

        var compressedDataString = rawBeverage.Namn+""+ rawBeverage.Ursprunglandnamn +""+ rawBeverage.Namn2;
        //$.each(rawBeverage,function(index, data){
        //    compressedDataString = compressedDataString + data;
        //});

        this.open = function(data){
            self.activeBeverage(data);
            $("#myModal").modal('show');
        }

        this.toggle = function(){
            this.selected(!this.selected()); 
        }

        this.addtofavorite = function(beverage){
            var matchingLine = ko.utils.arrayFirst(self.myFavorites(), function(line) {
                return line.nr === beverage.nr; 
            });
            if(!matchingLine){
                self.myFavorites.push(beverage);
                console.log("Tillagd till favoriter")
            }
        }

        this.string = compressedDataString;
        return this;
    }

    function GetMedia(beverage){
        if(beverage.Varugrupp === 'Rött vin'){
            return "resources/redwine.png";
        }
        else if(beverage.Varugrupp === 'Mousserande vin'){
            return  "resources/mousserande.png";
        }
        else if(beverage.Varugrupp === 'Öl'){
            return "resources/beer.png";
        }
        else if(beverage.Varugrupp === 'Whisky'){
            return "resources/whisky.png";
        }
        else if(beverage.Varugrupp === 'Cognac'){
            return "resources/cognac.png";
        }
        else if(beverage.Varugrupp === 'Vitt vin'){
            return "resources/whitewine.png";
        }
        else if(beverage.Varugrupp === 'Rom'){
            return "resources/rom.png";
        }
        else if(beverage.Varugrupp === 'Smaksatt sprit'){
            return "resources/sprit.png";
        }
        else{
            return "resources/beer.png";
        }
    }

};


$(function () {
    $(document).ready(function () {
        new WOW().init();
        var vm = new viewModel();
        //vm.populateFromRawData(data)
        ko.applyBindings(vm);

        //console.log(lbsappstore.init());

    });
});