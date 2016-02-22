$(document).ready(function(){
    
    var ObserverSubject = function() {
            this.subscribers = [];
    } // End ObserverSubject
        
    ObserverSubject.prototype = {
        attach: function(callback) {
            // In most situations, you would check to see if the
            // callback already exists within the subscribers array,
            // but for the sake of keeping us on track and because
            // this isn't necessarily included, we'll leave it out.
            // Just add the callback to the subscribers list
            this.subscribers.push(callback);
        },
        detach: function(callback) {
            var i = 0,
                len = this.subscribers.length;
    
            // Iterate through the array and if the callback is
            // found, remove it.
            for (; i < len; i++) {
                if (this.subscribers[i] === callback) {
                    this.subscribers.splice(i, 1);
                    // Once we've found it, we don't need to
                    // continue, so just return.
                    return;
                }
            }
        },
        notify: function(stocker, newPrice) {
            var i = 0,
                len = this.subscribers.length;
    
            // Iterate over the subscribers array and call each of
            // the callback functions.
            for (; i < len; i++) {
                this.subscribers[i](stocker, newPrice);
            }
        }
    };
    
    var Observer = function (stocker, newPrice) {
        var oldPrice = parseInt($(stocker).find("td.old-price").html());
        var percent = parseFloat(newPrice - oldPrice)*100/oldPrice;
        $(stocker).find("td.new-price").html(newPrice);
        $(stocker).find("td.old-price").html(oldPrice);
        if(percent >0) {
            $(stocker).find("td.percent").html( "+" + percent.toFixed(2)+ "%");
        } else {
        $(stocker).find("td.percent").html( percent.toFixed(2)+ "%");    
        }
        
        
    }
        
    // Here's where it gets used.
    observerSubject = new ObserverSubject();
    observerSubject.attach(Observer);
    
    var stockerNameArr = ['IBM', 'Google'];
    var randomNumber = function(min , max) {
        var randomValue = Math.floor((Math.random() * max) + min);
        return randomValue;
    }
    
    var updateUI = function() {
        stockers = $("table tbody").find("tr");
        console.log("UdateUI with Stocker: " + stockers.length);
        if(stockers.length > 0) {
             var newPrice = 0;
            stockers.each(function(index, stocker) {
                console.log("new price: " + newPrice);
                newPrice = randomNumber(1, 100);
                observerSubject.notify(stocker, newPrice);
            });    
        }
    } // end updateUI
    
    var createNewStocker = function(stockerName) {
        var htmlTemplate = '<tr id="' + stockerName +'"><td class="name">' + stockerName +
        '</td><td class="old-price">' + randomNumber(1, 100) +
        '</td><td class="new-price">' + randomNumber(1, 100)+
        '</td><td class="percent">12%</td></tr>';
        return htmlTemplate;
    }
    $("#add-new-stocker-btn").click(function(event) {
        event.preventDefault(true);
        var stockerName = $("#stocker-name").val();
        stockers = $("table tbody").find("tr");
        
        if(stockers.length == 10) {
                $("#error-lbl").removeClass("hidden");
                $("#error-lbl").html('Maximum Stocker is 10');
                return false;
        }
        
        if(stockerName == "") {
            $("#error-lbl").removeClass("hidden");
            $("#error-lbl").html('Please enter stocker name, ex: EUR,VNH, FB see more:<a href="https://www.google.com/finance">https://www.google.com/finance</a>');
            $("#stocker-name").focus();
            return false;
        } 
        if($.inArray(stockerName, stockerNameArr) != -1) {
                $("#error-lbl").removeClass("hidden");
                $("#error-lbl").html('Stocker name is existed, try another, see more:<a href="https://www.google.com/finance">https://www.google.com/finance</a>');
                return false;
        }
        
        //everything is ok!
        $("table tbody").append(createNewStocker(stockerName));
        $("#error-lbl").addClass("hidden");    
        stockerNameArr.push(stockerName);
            
        
        console.log("form submit");
        
    });
    
    setInterval(updateUI, 1000);

   
    
});