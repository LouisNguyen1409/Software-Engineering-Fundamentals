/**
 * 
 * Given an array of fast food restaurants, return a new sorted
 * array in descending order by:
 *
 *   1. customerService
 *   2. foodVariety
 *   3. valueForMoney
 *   4. timeToMake
 *   5. taste
 *   6. name (in lexicographical order, case-insensitive)
 *
 * For example, if two restaurant have the same customerService
 * and foodVariety, the one with a higher valueForMoney will be
 * in front (nearer to the start of the returned array).
 *
 * If the all other fields are equal and the name is compared,
 * "hungry Jacks" will be before "KFC" because "h" is before "K".
 *
 * WARNING: You should NOT modify the order of the original array.
 *
 * @param {
 *   Array<{
 *     name: string,
 *     customerService: number,
 *     foodVariety: number,
 *     valueForMoney: number,
 *     timeToMake: number,
 *     taste: number
 *   }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns array with the same items, sorted by the key-order given.
 */

function compareFastFood (restaurant_1, restaurant_2) {
  if (restaurant_1.customerService !== restaurant_2.customerService) {
    return restaurant_1.customerService - restaurant_2.customerService;
  } else if (restaurant_1.foodVariety !== restaurant_2.foodVariety) {
    return restaurant_1.foodVariety - restaurant_2.foodVariety;
  } else if (restaurant_1.valueForMoney !== restaurant_2.valueForMoney) {
    return restaurant_1.valueForMoney - restaurant_2.valueForMoney;
  } else if (restaurant_1.timeToMake !== restaurant_2.timeToMake) {
    return restaurant_1.timeToMake - restaurant_2.timeToMake;
  } else if (restaurant_1.taste !== restaurant_2.taste) {
    return restaurant_1.taste - restaurant_2.taste;
  }
  return - restaurant_1.name.localeCompare(restaurant_2.name);
}
function sortedFastFood(fastFoodArray) {
  const new_array = [];
  for (const curr_restaurant of fastFoodArray) {
    let index = 0;
    while (index < new_array.length && compareFastFood(curr_restaurant, new_array[index]) < 0) {
      index++;
    }
    new_array.splice(index, 0, curr_restaurant);
  }
  return new_array;
}

/**
 * Given an array of fast food restaurants, return a new sorted
 * array ranked by the overall satisfaction.
 *
 * The satisfaction of a restaurant is the average score between
 * customerService, foodVariety, valueForMoney, timeToMake and taste.
 *
 * You do not need to round the satisfaction value.
 *
 * If two restaurants have the same satisfaction, the names
 * are compared in lexigraphical order (case-insensitive).
 * For example, "hungry Jacks" will appear before "KFC" because
 * "h" is before "K".
 *
 * WARNING: you should NOT modify the order of the original array.
 *
 * @param {
 *   Array<{
 *     name: string,
 *     customerService: number,
 *     foodVariety: number,
 *     valueForMoney: number,
 *     timeToMake: number,
 *     taste: number
 *  }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns {
 *   Array<{
 *     restaurantName: string,
 *     satisfaction: number,
 *   }>
 * } a new sorted array based on satisfaction. The restaurantName
 * will be the same as the original name given.
 */

function compareSatisfaction (restaurant_1, restaurant_2) {
  satisfaction_1 = (restaurant_1.customerService + restaurant_1.foodVariety + restaurant_1.valueForMoney + restaurant_1.timeToMake + restaurant_1.taste) / 5;
  satisfaction_2 = (restaurant_2.customerService + restaurant_2.foodVariety + restaurant_2.valueForMoney + restaurant_2.timeToMake + restaurant_2.taste) / 5;
  if (satisfaction_1 !== satisfaction_2) {
    return satisfaction_1 - satisfaction_2;
  }
  return - restaurant_1.name.localeCompare(restaurant_2.name);
}
function sortedSatisfaction(fastFoodArray) {
  // TODO: Observe the return type from the stub code
  // FIXME: Replace the stub code with your implementation
  const new_array = [];
  for (const curr_restaurant of fastFoodArray) {
    let index = 0;
    while (index < new_array.length && compareSatisfaction(curr_restaurant, new_array[index]) < 0) {
      index++;
    }
    new_array.splice(index, 0, curr_restaurant);
  }
  return new_array;
}

// ========================================================================= //

/**
 * Execute the file with:
 *     $ node satisfaction.js
 *
 * Feel free to modify the code below to test your functions.
 */

// Note: do not use this "fastFoods" global variable directly in your function.
// Your function has the parameter "fastFoodArray".
const fastFoods = [
  {
    name: "Second fastFood, third satisfaction (4.6)",
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 5,
    timeToMake: 4,
    taste: 4,
  },
  {
    // Same as above, but name starts with "f"
    // which is before "S" (case-insensitive)
    name: "First fastFood, second satisfaction (4.6)",
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 5,
    timeToMake: 4,
    taste: 4,
  },
  {
    // Worse foodVariety, but better overall
    name: "Third fastFood, first satisfaction (4.8)",
    customerService: 5,
    foodVariety: 4,
    valueForMoney: 5,
    timeToMake: 5,
    taste: 5,
  },
];

// Note: We are using console.log because arrays cannot be commpared with ===.
// There are better ways to test which we will explore in future weeks :).
console.log("========================");
console.log("1. Testing Fast Food");
console.log("===========");
console.log(sortedFastFood(fastFoods));
console.log();

console.log("========================");
console.log("2. Testing Satisfaction");
console.log("===========");
console.log(sortedSatisfaction(fastFoods));
console.log();
