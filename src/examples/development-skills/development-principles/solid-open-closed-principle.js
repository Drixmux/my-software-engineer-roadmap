class Course {
    constructor(name, description, price) {
      this.name = name;
      this.description = description;
      this.price = price;
    }
  }
  
  class Purchase {
    constructor(customerId) {
      this.customerId = customerId;
      this.totalAmount = 0;
      this.items = [];
    }
  }
  
  class CourseAPI {
    constructor() { }
  
    /**
     * Sends a request to purchase all the courses in shopping cart.
     * @param {Purchase} purchase - Shopping cart data.
     */  
    purchaseCourses(purchase) {
      new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/courses/purchase");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            var response = JSON.parse(xhr.responseText);
            resolve(xhr.response);
          } else {
            // In the reject method, you can send anything related to the error.
            reject({});
          }
        };
  
        xhr.onerror = function () {
          // In the reject method, you can send anything related to the error.
          reject({});
        };
  
        xhr.send(JSON.stringify(purchase));
      });
    }
  }
  
  class CourseManager {
    // Discounters is going to be private.
    #discounters = [];
    
    constructor() {
      this.courseAPI = new CourseAPI();
    }
  
    /**
     * Create a new shopping cart to purchase courses.
     * @param {Course} course - Instance of course.
     */  
    createPurchase(customerId) {
      this.purchase = new Purchase(customerId);
    }
  
    /**
     * Add a new course to shopping cart.
     * @param {Course} course - Instance of course.
     */  
    addItem(course) {
      this.purchase.items.push(course);
      this.purchase.totalAmount = this.totalAmount + course.price;
    }
  
    /**
     * Function to register a new discounter
     * @param {Course} course - Instance of course.
     */
    registerDiscounter(discounter) {
      this.#discounters.push(discounter);
    }
  
    /**
     * Calculates the discount.
     * @param {Purchase} purchase - Shopping cart data.
     */  
    applyDiscount(purchase) {
      var discountApplied = false;
      this.#discounters.forEach(discounter => {
        if (discounter.isApplicable(purchase) && !discountApplied) {
          discounter.applyCoupon(purchase);
          discountApplied = true;
        }
      });
    }
  
    /**
     * Complete the courses purchase.
     */  
    completePurchase() {
      this.applyDiscount(this.purchase);
  
      this.courseAPI.purchaseCourses(this.purchase)
        .then(function(response) {
          console.log("Purchase completed");
        })
        .catch(function (err) {
          // Right here we can handle the error.
        });
    }
  }
  
  // We can create these coupons and register them as discounters.
  var bronzeDiscounter = {
    isApplicable: function(order) {
      var itemsCount = order.items.length;
      return (itemsCount >= 10 && itemsCount < 20)
    },
    apply: function(order) {
      order.totalAmount = order.totalAmount - order.totalAmount * 10 / 100;
    }
  };
  
  var silverDiscounter = {
    isApplicable: function(order) {
      var itemsCount = order.items.length;
      return (itemsCount >= 20 && itemsCount < 30)
    },
    apply: function(order) {
      order.totalAmount = order.totalAmount - order.totalAmount * 30 / 100;
    }
  };
  
  var goldDiscounter = {
    isApplicable: function(order) {
      var itemsCount = order.items.length;
      return (itemsCount >= 30)
    },
    apply: function(order) {
      order.totalAmount = order.totalAmount - order.totalAmount * 50 / 100;
    }
  };
  
  var courseManager = new CourseManager();
  
  courseManager.registerDiscounter(bronzeDiscounter);
  courseManager.registerDiscounter(silverDiscounter);
  courseManager.registerDiscounter(goldDiscounter);