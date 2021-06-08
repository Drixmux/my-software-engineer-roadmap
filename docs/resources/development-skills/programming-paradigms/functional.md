# Functional Programming

Functional programming is way of writing cleaner code through clever ways of mutating, combining, and using pure functions. If we try to solve a problem by using functional programming, we may think on decomposing the problem into a set of functions, and when talking about functions, we should talk about avoiding shared state on them.

For example, let's say we want to have an app to calculate exponentiation of different numbers.

```js
// This is the main function where we are going to 
// set the base number. The returned function will
// work as a power tool of the defined base number.
function powersOf(x) {
  return function(y) {
    return Math.pow(x, y);
  };
}

// Powers of 2 function.
var powerOfTwo = powersOf(2);
console.log(powerOfTwo(1)); // output: 2
console.log(powerOfTwo(2)); // output: 4
console.log(powerOfTwo(3)); // output: 8

// Powers of 3 function.
var powerOfThree = powersOf(3);
console.log(powerOfThree(3)); // output: 9
console.log(powerOfThree(10)); // output: 59049
```

# Functional Programming Concepts

When talking about functional programming, we should mention some concepts.

## Pure Functions

When talking about Pure Functions, we can say that they return a value by using only the given input. Pure functions should not use outside variables or global states if we don't want to have side effects on the output.

For example, let's say we want a function to calculate the addition of two numbers, this is how it looks a pure function:

```js
function add(a, b) {
  return a + b;
}

console.log(add(4, 5)); // output: 9
```

Taking the same example, this is how it would look like a non pure function.

```js
var a = 10;

function add(b) {
  a = a + b;
}

add(5);
// The variable "a" will have the value of 15 the first time.
// But, what if we call it again?

add(5);
// On this second call, we're adding some more to the variable "a".
// The variable "a" will now have the value of 20.
```

## Function Composition / Higher-order Functions

Function Composition or higher-order Functions is basically combining two or more functions in order to produce a new function or value, or even having the function that either take another function as the input.

For example, let's say we want to know if a number is divisible by other number, but we want to test several times this divisible operation by an specific number. To solve this problem, we can do the following:

```js
function divisibleBy(a) {
  return function(b) {
    if (b % a == 0) {
      return true;
    } else {
      return false;
    }
  };
}

// Divisible by 2 function.
var divisibleByTwo = divisibleBy(2);
console.log(divisibleByTwo(4)); // output: true
console.log(divisibleByTwo(5)); // output: false
console.log(divisibleByTwo(6)); // output: true

// Divisible by 3 function.
var divisibleByThree = divisibleBy(3);
console.log(divisibleByThree(6)); // output: true
console.log(divisibleByThree(7)); // output: false
console.log(divisibleByThree(8)); // output: false
console.log(divisibleByThree(9)); // output: true
```

## Closure

Closures in JavaScript are functions that have access to the parent scope, even when the parent function has closed. Variables declared in a function are available to any code within the function, but not to outside the function.

For example, let's say we have a higher-order function like the following:

```js
function randomCalculation() {
  var c = 3;

  return function(a, b) {
    // On this function, we have access to variable "c" that is on
    // the outside function' scope.
    return (a + b) * c;
  };
}

var randomCalculator = randomCalculation();

console.log(randomCalculator(1, 2)); // output: 9
// Notice that from this scope, we can't access to variable "c"
// because it's on a different scope.
```

## Anonymous Functions and Self-Invoking functions

Anonymous functions are just functions without names. They are used to define some logic that is going to be used once, so the varialbe name doesn't need to be wasted on it.

Self-Invoking functions is a way to automatically execute a function after it's declared.

For example, let's say we want to to have a welcome message executed at the beginning, but only once. We can do the following:

```js
// We're using an anonymous function that will print the welcome message.
// Self-invoking is also being used by wrapping the whole function between parenthesis.
// Notice that after the close parenthesis that wraps the function, we're adding extra
// open and close parenthesis. This extra parenthesis are used to self-invoking the function.
(function () {
  console.log("Welcome to my app");
})();
```

# Other Features

Talking about code, we can find some examples about different features related to functional programming [here](/docs/resources/development-skills/programming-paradigms/functional-examples.md).

# References
- [Functional Programming in JavaScript](https://www.amazon.com/-/es/Dan-Mantyla/dp/1784398225) by Dan Mantyla.
- [Medium - Master the JavaScript Interview: What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0)