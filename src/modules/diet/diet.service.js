// src/modules/diet/diet.service.js
const mealTemplates = {
    muscle_gain: {
      breakfast: [
        {
          name: "Protein Pancakes",
          calories: 600,
          protein: 45,
          carbs: 60,
          fat: 15,
          description: "Oat flour pancakes with whey protein, topped with almond butter and banana"
        },
        {
          name: "Egg White Scramble",
          calories: 550,
          protein: 50,
          carbs: 30,
          fat: 20,
          description: "6 egg whites with spinach, mushrooms, and whole wheat toast"
        }
      ],
      lunch: [
        {
          name: "Grilled Chicken & Rice",
          calories: 750,
          protein: 55,
          carbs: 80,
          fat: 15,
          description: "200g grilled chicken breast with brown rice and steamed broccoli"
        },
        {
          name: "Salmon & Sweet Potato",
          calories: 700,
          protein: 45,
          carbs: 75,
          fat: 25,
          description: "Baked salmon with roasted sweet potatoes and asparagus"
        }
      ],
      dinner: [
        {
          name: "Lean Beef Stir Fry",
          calories: 800,
          protein: 60,
          carbs: 70,
          fat: 30,
          description: "Lean ground beef with quinoa and mixed vegetables"
        },
        {
          name: "Turkey Meatballs",
          calories: 750,
          protein: 65,
          carbs: 65,
          fat: 25,
          description: "Turkey meatballs with whole wheat pasta and marinara sauce"
        }
      ],
      snacks: [
        {
          name: "Greek Yogurt & Berries",
          calories: 300,
          protein: 25,
          carbs: 25,
          fat: 8,
          description: "Plain Greek yogurt with mixed berries and chia seeds"
        },
        {
          name: "Cottage Cheese & Almonds",
          calories: 350,
          protein: 30,
          carbs: 15,
          fat: 18,
          description: "Low-fat cottage cheese with raw almonds"
        }
      ]
    },
    fat_loss: {
      breakfast: [
        {
          name: "Veggie Omelette",
          calories: 350,
          protein: 30,
          carbs: 15,
          fat: 20,
          description: "3-egg omelette with peppers, onions, and spinach"
        },
        {
          name: "Chia Pudding",
          calories: 300,
          protein: 15,
          carbs: 25,
          fat: 15,
          description: "Chia seeds soaked in almond milk with cinnamon and stevia"
        }
      ],
      lunch: [
        {
          name: "Grilled Chicken Salad",
          calories: 450,
          protein: 40,
          carbs: 20,
          fat: 25,
          description: "Mixed greens with 150g grilled chicken, olive oil dressing"
        },
        {
          name: "Tuna Lettuce Wraps",
          calories: 400,
          protein: 35,
          carbs: 15,
          fat: 20,
          description: "Tuna salad wrapped in romaine lettuce leaves"
        }
      ],
      dinner: [
        {
          name: "Baked Cod & Veggies",
          calories: 500,
          protein: 45,
          carbs: 30,
          fat: 25,
          description: "White fish with roasted Brussels sprouts and cauliflower"
        },
        {
          name: "Turkey Chili",
          calories: 450,
          protein: 40,
          carbs: 35,
          fat: 15,
          description: "Lean ground turkey with beans and tomatoes"
        }
      ],
      snacks: [
        {
          name: "Hard-Boiled Eggs",
          calories: 140,
          protein: 12,
          carbs: 1,
          fat: 10,
          description: "2 hard-boiled eggs with pinch of salt"
        },
        {
          name: "Celery & Peanut Butter",
          calories: 200,
          protein: 8,
          carbs: 10,
          fat: 15,
          description: "Celery sticks with natural peanut butter"
        }
      ]
    },
    maintain: {
      breakfast: [
        {
          name: "Avocado Toast",
          calories: 450,
          protein: 15,
          carbs: 45,
          fat: 25,
          description: "Whole grain toast with mashed avocado and poached eggs"
        },
        {
          name: "Smoothie Bowl",
          calories: 400,
          protein: 20,
          carbs: 50,
          fat: 15,
          description: "Berry smoothie bowl with granola and coconut flakes"
        }
      ],
      lunch: [
        {
          name: "Quinoa Buddha Bowl",
          calories: 550,
          protein: 25,
          carbs: 60,
          fat: 25,
          description: "Quinoa with roasted vegetables, chickpeas, and tahini dressing"
        },
        {
          name: "Grilled Chicken Wrap",
          calories: 500,
          protein: 35,
          carbs: 45,
          fat: 20,
          description: "Whole wheat wrap with chicken, hummus, and veggies"
        }
      ],
      dinner: [
        {
          name: "Salmon & Quinoa",
          calories: 600,
          protein: 40,
          carbs: 50,
          fat: 30,
          description: "Grilled salmon with quinoa and roasted vegetables"
        },
        {
          name: "Lean Beef Tacos",
          calories: 550,
          protein: 35,
          carbs: 45,
          fat: 25,
          description: "Corn tortillas with lean ground beef and fresh toppings"
        }
      ],
      snacks: [
        {
          name: "Protein Shake",
          calories: 250,
          protein: 25,
          carbs: 20,
          fat: 8,
          description: "Whey protein with almond milk and banana"
        },
        {
          name: "Rice Cakes & Almond Butter",
          calories: 300,
          protein: 10,
          carbs: 35,
          fat: 15,
          description: "2 rice cakes with almond butter"
        }
      ]
    }
  };
  
  export const generateWeeklyMealPlan = (goal) => {
    if (!mealTemplates[goal]) {
      throw new Error(`Invalid goal. Must be one of: ${Object.keys(mealTemplates).join(', ')}`);
    }
  
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyPlan = {};
  
    days.forEach(day => {
      weeklyPlan[day] = {
        breakfast: getRandomMeal(mealTemplates[goal].breakfast),
        lunch: getRandomMeal(mealTemplates[goal].lunch),
        dinner: getRandomMeal(mealTemplates[goal].dinner),
        snacks: getRandomMeal(mealTemplates[goal].snacks)
      };
    });
  
    return weeklyPlan;
  };
  
  // Helper function to randomly select a meal from options
  function getRandomMeal(meals) {
    return meals[Math.floor(Math.random() * meals.length)];
  }