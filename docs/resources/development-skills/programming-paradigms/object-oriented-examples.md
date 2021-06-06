# Object Oriented Programming Examples

## Upcasting and downcasting

Upcasting and downcasting is basically part of the concept typecasting that is converting one data type to another datatype implicitly or explicitly. Upcasting and downcasting concepts are specifically use when there's inheritance, it means, a parent and a child object.

Upcasting is when taking the object of child class and treats it as an object of parent class. The object will have access to all parent class properties, but won't have access to chile class properties. Talking about methods, the object will have access only to overridden methods. This process can be implicitly.

Downcasting is the inverse of upcasting. It's when taking the object of parent class and treats it as an object of child class. In this case, the created object will have to all the properties and methods from both, the parent and child class. This process can't be implicitly.

```c#
using System;
			

// Parent class
public class Parent {
  public String name;

  public Parent(String name) {
    this.name = name;
  }

  // A method which prints the
  // signature of the parent class
  public virtual void method()
  {
    Console.WriteLine("Method from Parent");
  }
}
 
// Child class
public class Child : Parent {
  public int id;

  public Child(String name) : base(name) { }

  // Overriding the parent method
  // to print the signature of the
  // child class
  public override void method()
  {
    Console.WriteLine("Method from Child");
  }
}

public class Program
{
  public static void Main()
  {
    // Upcasting
    Parent p = new Child("New Object");
    
    // This property is not accessible because Parent class doesn't have id property defined.
    // p.id = 1;
    Console.WriteLine(p.name); // Output: New Object
    p.method(); // Output: Method from Child
    
    // Downcasting
    // Trying downcasting implicitly.
    // Child c = new Parent(); -> Compile time error.
    
    // Downcasting explicitly
    Child c = (Child)p;
    
    c.id = 1;
    
    Console.WriteLine(c.id); // Output: 1
    Console.WriteLine(c.name); // Output: New Object
    c.method(); // Output: Method from Child
  }
}
```

## Overloading and Overriding 

Overloading is when you have multiple methods in the same scope, with the same name but different input parameters.

Overriding is a principle that allows you to change the functionality of a method in a child class.

To show some examples, first we have to understand that JavaScript only supports overriding but not overloading, but overriding in JavaScript means that if you define two functions with the same name, the last one defined will override the previously defined, and that means when calling that method, it will execute method that was defined last.

For example, let's say we have defined two methods to print a given text, but with an static prefix, like the following:

```js
function printLog(text) {
  console.log("[LOG] " + text);
}

function printLog(text) {
  console.log("[DEBUG] " + text);
}

printLog("The value of X is 10."); // Output: [Debug] The value of X is 10.
 
// The example shows that when calling printLog method, it will use the method that was defined last.
```

Let's use another example to explain both, overloading and overriding, but using C# as the programming language.

```c#
using System;

// Parent class
public class Parent {
  private String name;

  public Parent(String name) {
    this.name = name;
  }

  // Overloading setName method
  // the first one receives an string param,
  // the second one receives an string array param.
  public void setName(String name)
  {
    this.name = name;
  }

  public void setName(String[] names)
  {
    this.name = String.Join(" ", names);
  }

  public virtual String getName()
  {
    return this.name;
  }
}
 
// Child class
public class Child : Parent {
  public int id;

  public Child(String name) : base(name) { }

  // Overriding the getName method
  // to print a prefix [Child]
  // before the name.
  public override String getName()
  {
    return "[Child] " + base.getName();
  }
}

public class Program
{
  public static void Main()
  {
    Parent p = new Parent("Parent Object");
    p.setName("Name");
    Console.WriteLine(p.getName()); // Output: Name
    p.setName(new String[] { "New", "Parent", "Name" });
    Console.WriteLine(p.getName()); // Output: New Parent Name

    Child c = new Child("Child Object");
    c.setName("Name");
    Console.WriteLine(c.getName()); // Output: [Child] Name
    c.setName(new String[] { "New", "Parent", "Name" });
    Console.WriteLine(c.getName()); // Output: [Child] New Parent Name
  }
}
```

Using C# as the programming language, there are two ways to use overriding. We can use virtual or abstract identifier. The main difference between them is that Abstract methods allow you to make the declaration only, so you can't define the method in the base class, and also it's require to override the method on child method. By using Virtual methods, you can define the method in the base class, and it's not required to override it in the child class.

```c#
public abstract class BaseEmployee
{
  public string FirstName { get; set; }
  public string LastName { get; set; }
  
  public virtual string GetName()
  {
    return this.FirstName + " " + this.LastName;
  }

  public abstract float GetSalary();
}

public class DeveloperEmployees : BaseEmployee
{
  public int MonthlySalary { get; set; }

  public override float GetSalary()
  {
  return this.MonthlySalary * 12;
  }
}
```

## Interfaces vs Abstract Class

When using an Interface, you will only be able to have the signatures of the methods. Methods need to be implemented on classes implementing the interface.

This would be an example of using an interface:

```c#
using System;

// Interface
interface IAnimal 
{
  // Interface method (does not have a body)
  void animalSound();
}

// Dog "implements" the IAnimal interface
class Dog : IAnimal 
{
  public void animalSound() 
  {
    // The body of animalSound() is provided here
    Console.WriteLine("The dog says: Woof");
  }
}

public class Program
{
  public static void Main()
  {
    Dog myDog = new Dog();  // Create a Dog object
    myDog.animalSound(); // Output: The dog says: Woof
  }
}
```

When using an Abstract Class, you can have some methods implemented in the abstract class and also the signatures of the methods. For methods with only signatures, you need to use override on the child classes.

This would be an example of using an abstract class:

```c#
using System;

// Abstract Class
abstract class Animal 
{
  // Method with no body.
  public abstract void animalSound();

  // Method with body.
  public void sleep() {
    Console.WriteLine("Zzz");
  }
}

// Dog "implements" the IAnimal interface
class Dog : Animal 
{
  public override void animalSound() 
  {
    // The body of animalSound() is provided here
    Console.WriteLine("The dog says: Woof");
  }
}

public class Program
{
  public static void Main()
  {
    Dog myDog = new Dog();  // Create a Dog object
    myDog.animalSound(); // Output: The dog says: Woof
    myDog.sleep(); // Output: Zzz
  }
}
```

# References
- [C-Sharpcorner - Polymorphism, Upcasting and Downcasting](https://www.c-sharpcorner.com/article/polymorphism-up-casting-and-down-casting)
- [Geeks for Geeks - Upcasting Vs Downcasting in Java](https://www.geeksforgeeks.org/upcasting-vs-downcasting-in-java/)
- [Overloading functions in JavaScript - Waldek Mastykarz](https://blog.mastykarz.nl/overloading-functions-javascript)
- [Stack Overflow - c# overloading and overriding](https://stackoverflow.com/questions/673721/overloading-and-overriding)
- [C-SharpCorner - Difference between Abstract and Virtual methods](https://www.c-sharpcorner.com/interview-question/difference-between-abstract-methods-and-virtual-methods)
- [Stack Overflow - OOP, what's the difference between an interface and abstract classes](https://stackoverflow.com/questions/1913098/what-is-the-difference-between-an-interface-and-abstract-class)