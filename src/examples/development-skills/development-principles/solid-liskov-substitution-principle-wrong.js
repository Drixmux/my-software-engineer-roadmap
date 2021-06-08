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

class Discounter {
  constructor(min, max, discountPercentage) {
    this.min = min;
    this.max = max;
    this.discountPercentage = discountPercentage;
  }

  /**
   * Check if the discount is applicable to the purchase.
   * @param {Purchase} purchase - Shopping cart data.
   * @returns {boolean} - true if the discount applies to the purchase, otherwise false.
   */  
  isApplicable(purchase) {
    var itemsCount = purchase.items.length;
    return (itemsCount >= this.min && itemsCount < this.max);
  }

  /**
   * Apply the discount to the purchase
   * @param {Purchase} purchase - Shopping cart data.
   */ 
  apply(purchase) {
    purchase.totalAmount = purchase.totalAmount - purchase.totalAmount * this.discountPercentage / 100;
  }
}

class AmountDiscounter extends Discounter {
  constructor(min, max, discountPercentage) {
    super(min, max, discountPercentage);
  }

  /**
   * Check if the discount is applicable to the purchase.
   * @param {Purchase} purchase - Shopping cart data.
   * @returns {boolean} - true if the discount applies to the purchase, otherwise false.
   */  
  isApplicable(purchase) {
    var purchaseAmount = purchase.totalAmount;
    return (purchaseAmount >= this.min && purchaseAmount < this.max);
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
var bronzeDiscounter = new Discounter(10, 20, 10);
var silverDiscounter = new Discounter(20, 30, 30);
var goldDiscounter = new Discounter(30, 50, 50);

// This discounter violates the Liskov Substitution Principle.
var amountDiscounter = new AmountDiscounter(60, 1000, 60);

var courseManager = new CourseManager();

courseManager.registerDiscounter(bronzeDiscounter);
courseManager.registerDiscounter(silverDiscounter);
courseManager.registerDiscounter(goldDiscounter);

// This discounter violates the Liskov Substitution Principle.
courseManager.registerDiscounter(amountDiscounter);