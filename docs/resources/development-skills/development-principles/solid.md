# SOLID Principle

SOLID refers to a set of five principles at the base of a good software design.

## Single Responsibility Principle

Robert C. Martin, one of the co-authors of the Agile Manifesto has the following definition: 

> A class should have only one reason to change

This definition means that a class has only one responsibility, but it doesn't mean an object of this class can only do one thing, rather it can do more things that are related to only one responsibility. 

In summary, the actions assigned to an object must be consistent with one unique responsibility.

For example, let's say we want to model the objects to build a TODOs app.

First we will have the base class to model the Todo object:

```js
class Todo {
  constructor(description) {
    this.id = 0;
    this.description = description;
    this.completed = false;
  }
}
```

Once having the Todo class defined, we can add another class to manage the Todo list. 

```js
class TodoManager {
  constructor() {
    this.items = [];
  }

  /**
   * Add a new Todo item to the list of items.
   * @param {string} description - Description of the new item.
   */  
  addItem(description) {
    var todoItem = new Todo(description);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        var response = JSON.parse(xhr.responseText);
        
        if (response.id) {
          todoItem.id = response.id;
          this.items.push(todoItem);
        }
      } else {
        // Right here we can handle the error.
      }
    };

    xhr.onerror = function () {
      // Right here we can handle the error.
    };

    xhr.send(JSON.stringify(todoItem));
  }

  /**
   * Mark the Todo item as completed.
   * @param {number} itemId - Id of the Todo item.
   */  
  completeItem(itemId) {
    var xhr = new XMLHttpRequest();

    xhr.open("PATCH", "/api/todos/" + itemId + "/complete");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        var response = JSON.parse(xhr.responseText);

        this.items
          .filter(function(item) {
            return item.id == itemId;
          })
          .map(function(item) {
            item.completed = response.completed;
          });
      } else {
        // Right here we can handle the error.
      }
    };

    xhr.onerror = function () {
      // Right here we can handle the error.
    };

    xhr.send();
  }
}
```

If we verify the TodoManager class, we may think that the responsibility of the class is to manage Todo items inside a Todo list. The responsibility of the class is clear, so we should only change the class when we want to modify something related to the Todo list.

Now, if we review the methods to add and complete Todo items, we can say that it's also communicating with an API to store that information in some server. By now, it's using XMLHttpRequest to make the request to the API,  but what if in the future we want to change the way it's making the request? For example, use a different library like axios. We will need to modify TodoManager class, but the change won't be related to the responsibility of the class, if we try to change the way it's communicating with the API, we can detect a new responsibility right there, and with two responsibilities we're breaking the Single Responsibility Principle.

In order to apply the Single Responsibility Principle, we need to move the communication with the API to another class.

```js
class TodoAPI {
  constructor() { }

  /**
   * Sends a request to create a new Todo record in server
   * @param {Todo} todo - Todo record.
   */  
  createTodo(todo) {
    new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/todos");
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

      xhr.send(JSON.stringify(todo));
    });
  }

  /**
   * Send a request to complete an existing Todo record.
   * @param {number} itemId - Id of the Todo item.
   */  
  completeItem(itemId) {
    new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open("PATCH", "/api/todos/" + itemId + "/complete");
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

      xhr.send();
    });
  }
}
```

Then, we can rewrite the TodoManager class to only handle logic related to the Todo list.

```js
class TodoManager {
  constructor() {
    this.items = [];
    this.todoAPI = new TodoAPI();
  }

  /**
   * Add a new Todo item to the list of items.
   * @param {string} description - Description of the new item.
   */  
  addItem(description) {
    var todoItem = new Todo(description);

    this.todoAPI.createTodo(todoItem)
      .then(function(response) {
        if (response.id) {
          todoItem.id = response.id;
          this.items.push(todoItem);
        }
      })
      .catch(function (err) {
        // Right here we can handle the error.
      });
  }

  /**
   * Mark the Todo item as completed.
   * @param {number} itemId - Id of the Todo item.
   */  
  completeItem(itemId) {
    this.todoAPI.completeItem(itemId)
      .then(function(response) {
        this.items
          .filter(function(item) {
            return item.id == itemId;
          })
          .map(function(item) {
            item.completed = response.completed;
          });
      })
      .catch(function (err) {
        // Right here we can handle the error.
      });
  }
}
```

Each of these two classes has only one responsibility. You will change TodoManager class when it's something related to the todo list, and you will change TodoAPI when it's something related to the communication with the API.

You can find the full example [here.](/src/examples/development-skills/development-principles/solid-single-responsability-principle.js)

## Open/Closed Principle

The principle states:

> Software entities like classes, modules and functions should be open for extension but
closed for modifications.

When we're talking about **open for extension**, it means the components should be adjustable to the changing needs of the application, and when talking about **closed for modifications**, it means the required changes should not involve the original component itself.

For example, let's say we have a course selling app where you can add courses to the shopping cart and then proceed with the purchase. It looks like this:

```js
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
   * Complete the courses purchase.
   */  
  completePurchase() {
    this.courseAPI.purchaseCourses(this.purchase)
      .then(function(response) {
        console.log("Purchase completed");
      })
      .catch(function (err) {
        // Right here we can handle the error.
      });
  }
}
```

We want to extend this app by adding discount coupons, so the first idea would we to add some logic to apply the discount from coupons before completing the purchase. The discount would be by how many courses the user buys.

We would add a new method to calculate the discount and apply it to the purchase, and edit completePurchase method so we can calculate the discount before sending the request to purchase the courses.

```js
/**
 * Calculates the discount.
 * @param {Purchase} purchase - Shopping cart data.
 */  
applyDiscount(purchase) {
  var itemsCount = purchase.items.length;
  var discountPercentage = 0;
  if (itemsCount >= 10 && itemsCount < 20) {
    discountPercentage = 10;
  } else if (itemsCount >= 20 && itemsCount < 30) {
    discountPercentage = 20;
  } else if (itemsCount >= 30) {
    discountPercentage = 30;
  }

  purchase.totalAmount = purchase.totalAmount - purchase.totalAmount * discountPercentage / 100;
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
```

This new feature seems to work right, but what if we want to add one more discount option? The quick solution would be to add one more **if** statement with the new discount option. By adding this new discount option, we're only respecting one part of Open/Closed Principle that states: open for extension, but not the last part that states: closed for modifications. We're extending the CourseManager object, but we're also modifying this object.

We may implement a different solution to respect the Open/Closed Principle, and it would look like this:

```js
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
```

With this new solution, we can say it's respecting both parts of Open/Closed Principle.

You can find the full example [here.](/src/examples/development-skills/development-principles/solid-open-closed-principle.js)

## Liskov Substitution Principle

This principle states:

> Subtypes must be substitutable for their base types.

When talking about **Liskov Substitution Principle**, we must mention that somehow it's an extension of the Open/Closed Principle. It's related to extending a component by using inheritance, but by changing the functionality of the parent object on the child object and when it happens, we can have undesired effects when they interact with existing components.

In summary, for this principle, when using inheritance, the child object must be semantically equivalent to the parent object.

Let's use the example of discounter feature on course selling app, for example by adding a different kind of discounter. This new discounter will evaluate course prices instead of course amounts.

Let's create first a Discounter class:

```js
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
```

Having this object, let's create a discount based on the amount of the purchase instead of the quantity of items. We're going to override isApplicable method:

```js
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
```

By overriding this method of the parent class, we're changing the semantics of the parent class and it violates the Liskov Substitution Principle. This results in an unpredictable result. In other languages, it can be solved by using interfaces instead of inheritance.

You can find the full example about what you have and don't have to do [here.](/src/examples/development-skills/development-principles/solid-liskov-substitution-principle-wrong.js)

## Interface Segregation Principle

This principle states:

> Clients should not be forced to depend on methods they do not use.

When talking about this principle, we can mention that when designing the interface of an object, we should limit to define what is strictly necessary. We don't want to add some stuff that is not going to be used in the interface.

As an example, we can think on building an app to manage the roles within a development team. The roles can be programmer, teamLead, and businessAnalyst.

Given JavaScript doesn't support interfaces, we can have the example done in C#. 

Let's start by modeling teamLead object:

```c#
public interface ILead
{
  void CreateSubTask();
  void AssignTask();
  void WorkOnTask();
}

public class TeamLead : ILead
{
  public void AssignTask()
  {
    //Code to assign a task.
  }

  public void CreateSubTask()
  {
    //Code to create a sub task.
  }

  public void WorkOnTask()
  {
    //Code to implement perform assigned task.
  }
}
```

In this case, the interface is fine to create the TeamLead class, but what about using the same interface to create Manager class?

```c#
public class Manager: ILead
{
  public void AssignTask()
  {
    //Code to assign a task.
  }

  public void CreateSubTask()
  {
    //Code to create a sub task.
  }

  public void WorkOnTask()
  {
    throw new Exception("Manager can't work on Task");
  }
}
```

As you can see on Manager class, there is a method implemented but not used and this case will also happen when modeling Programmer object. To solve this problem, we should first analize the existing roles and what every role can do:

- Manager - can assign tasks and create sub tasks.
- TeamLead - can assign tasks, create sub tasks and work on tasks.
- Programmer - can only work on tasks.

Given that information, we can divide the interfaces by actions.

```c#
public interface IProgrammer
{
  void WorkOnTask();
}

public interface ILead
{
  void CreateSubTask();
  void AssignTask();
}
```

Having this interfaces, the implementation would look like this:

```c#
public class Programmer: IProgrammer
{
  public void WorkOnTask()
  {
    //code to implement to work on the Task.
  }
}

public class Manager: ILead
{
  public void AssignTask()
  {
    //Code to assign a Task
  }

  public void CreateSubTask()
  {
  //Code to create a sub taks from a task.
  }
}
  
public class TeamLead: IProgrammer, ILead
{
  public void AssignTask()
  {
    //Code to assign a Task
  }

  public void CreateSubTask()
  {
    //Code to create a sub task from a task.
  }
  
  public void WorkOnTask()
  {
    //code to implement to work on the Task.
  }
}
```

With multiple interfaces, we separated responsibilities and purposes and provides a good level of abstraction too.

You can find the full example about what you don't have to do [here.](/src/examples/development-skills/development-principles/solid-interface-segregation-principle-wrong.cs)
You can find the full example about what you have to do [here.](/src/examples/development-skills/development-principles/solid-interface-segregation-principle.cs)

## Dependency Inversion Principle

This principle states:

> 1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
> 2. Abstractions should not depend upon details. Details should depend on abstractions.

When talking about this principle, first we need to think on the usage of instances of other classes inside an specific class, and when that happens we can say both classes are coupled. For example, let's say we have an application to send email notifications.

The example is going to be done by using C#.

```c#
using System;

public class EmailNotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the email notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by Email to user with ID: " + userId);
  }
}

public class NotificationManager
{
   public void SendNotification(int userId, string message)
   {
      EmailNotificationSender emailNotificationSender = new EmailNotificationSender();
      emailNotificationSender.SendNotification(userId, message);
   }
}

public class Program
{
  public static void Main()
  {
    int userId = 1;
    string message = "Some message";
    
    new NotificationManager().SendNotification(userId, message);
  }
}
```

It looks good, right? But what if we want to add a new notification, like SMS message for example? The code would look like this:

```c#
using System;

public class EmailNotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the email notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by Email to user with ID: " + userId);
  }
}

public class SMSNotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the sms notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by SMS to user with ID: " + userId);
  }
}

public class NotificationManager
{
  public void SendNotificationByEmail(int userId, string message)
  {
    EmailNotificationSender emailNotificationSender = new EmailNotificationSender();
    emailNotificationSender.SendNotification(userId, message);
  }

  public void SendNotificationBySMS(int userId, string message)
  {
    SMSNotificationSender smsNotificationSender = new SMSNotificationSender();
    smsNotificationSender.SendNotification(userId, message);
  }
} 

public class Program
{
  public static void Main()
  {
    int userId = 1;
    string message = "Some message";
    string notificationType = "sms";
    
    switch (notificationType) {
      case "email":
        new NotificationManager().SendNotificationByEmail(userId, message);
        break;
      case "sms":
        new NotificationManager().SendNotificationBySMS(userId, message);
        break;
    }
  }
}
```

As you see in the previous example, we added SMSNotificationSender class to handle SMS notifications, and we also modified NotificationManager and Program classes. This becomes a problem because whenever we want to add a new notification type, we will need to modify this two classes, and at the end, NotificationManager is going to grow up with every new notification type.

We can solve this problem by following this principle and decoupling NotificationManager from every notification type class. We will accomplish this by creating an abstraction between NotificationManager and notification type classes.

```c#
using System;

public interface INotificationSender
{
	void SendNotification(int userId, string message);
}

public class EmailNotificationSender: INotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the email notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by Email to user with ID: " + userId);
  }
}

public class SMSNotificationSender: INotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the sms notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by SMS to user with ID: " + userId);
  }
}

public class NotificationManager
{
  private INotificationSender _notificationSender;

  public NotificationManager(INotificationSender aNotificationSender) {
    this._notificationSender = aNotificationSender;
  }

  public void SendNotification(int userId, string message)
  {
    this._notificationSender.SendNotification(userId, message);
  }
}

public class Program
{
  public static void Main()
  {
    int userId = 1;
    string message = "Some message";
    string notificationType = "email";

    NotificationManager _notificationManager;
    
    switch (notificationType) {
      case "email":
        _notificationManager = new NotificationManager(new EmailNotificationSender());
        _notificationManager.SendNotification(userId, message);
        break;
      case "sms":
        _notificationManager = new NotificationManager(new SMSNotificationSender());
        _notificationManager.SendNotification(userId, message);
        break;
    }
  }
}
```

This way, every time we need to add a new notification type, we only need to add a new class, implement the interface and add the condition on the Program class. We no longer need to modify NotificationManager class anymore.

You can find the full example about what you don't have to do [here.](/src/examples/development-skills/development-principles/solid-depency-inversion-principle-wrong.cs)
You can find the full example about what you have to do [here.](/src/examples/development-skills/development-principles/solid-depency-inversion-principle.cs)

# References
- [Mastering JavaScript Object-Oriented Programming](https://www.amazon.com/-/es/Andrea-Chiarelli/dp/1785889109) by Andrea Chiarelli.
- [C Sharp Corner - SOLID Principles in C#.](https://www.c-sharpcorner.com/UploadFile/damubetha/solid-principles-in-C-Sharp)