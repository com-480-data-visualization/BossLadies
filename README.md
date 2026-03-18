# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Anna Tuz | 416460 |
| Margaux Anne Elbaum | 415343 |
| Yasmine Hidri	| 346771 |

[Milestone 1](milestone_1/README.md) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)).

For this project, we use the Food Nutrition Dataset available on Kaggle: https://www.kaggle.com/datasets/utsavdey1410/food-nutrition-dataset

This dataset contains nutritional information for a wide range of food items, including calories, macronutrients (proteins, fats, carbohydrates), as well as several vitamins and minerals. Each food is described through multiple numerical features, usually expressed per 100g, which makes comparisons between foods straightforward.
However, some preprocessing is still required:
-  handling missing values (especially for micronutrients),
-  standardizing units,
-  reducing the number of variables to keep the most relevant ones for visualization.
  
Overall, the dataset is rich and suitable for multi-dimensional analysis, but needs moderate cleaning and feature selection to avoid overly complex visualizations.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.
>
Choosing what to eat is not as simple as it seems. Each food combines many nutritional components (calories, fats, sugars, proteins) and understanding how they interact is often confusing. Most tools present this information in static ways, without adapting to individual needs.

The main idea of our project is to create an interactive visualization that adapts to the user. Instead of exploring food data in a generic way, users will be able to input their own context:
-  dietary restrictions (e.g., gluten-free, low sugar, vegetarian),
-  and personal information such as weight, height, sex, and activity level (or directly a target calorie intake).

Based on this, the system will compute personalized nutritional requirements, including caloric needs and macronutrient targets. It will then suggest suitable food options and recommended portions, ensuring that both nutritional goals and dietary constraints are respected.

The visualization will allow users to explore these recommendations interactively, compare foods, and understand why some options are more appropriate than others. This makes the experience more intuitive and tailored, rather than relying on fixed meal plans.

Our motivation comes from the difficulty of translating general nutritional guidelines into concrete, personalized choices. By combining user input with interactive visualization, we aim to make this process more accessible and informative.

The target audience includes students, young adults, and anyone interested in better understanding their diet or managing specific constraints.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?

This dataset has already seen extensive use in a variety of projects. Some efforts focus on meal planning, generating daily or weekly plans for users, while others employ content-based recommendation systems that suggest recipes similar to those a user already prefers. Predictive health modeling has also been explored, using food and nutrition data to estimate health outcomes. More advanced applications include image-to-recipe models, which take a photo of a dish and return matching recipes with nutrition information, ingredients and instructions. Another project is an AI-powered meal planners, integrating Gemini 2.0, further personalize plans based on user preferences, fitness goals, target nutrients, and dietary restrictions (e.g., keto, halal, vegan). Other work includes BMI-based meal plan generator and nutrition prediction models, like those estimating sugar content in foods. 


> - Why is your approach original?

What makes our approach original is that, unlike typical meal planners, it focuses on individual foods rather than pre-set meals. It highlights nutritional information interactively, allowing users to explore and compare foods in detail. With dynamic visualizations, users can gain a comprehensive view of their diet, understand how each food contributes to their overall nutrition, and directly compare multiple items. Our project also clearly incorporates dietary restrictions and substitutions, making it easy to adapt meals to personal needs. By combining personalized nutrition, flexible substitutions, and interactive visualizations, our system gives users complete control over meal composition and a deeper understanding of their food choices.


> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

