---
title: 'Interpretable Machine Learning'
date: 2025-06-29T22:51:34+05:45
kind: til
tags: [ml, interpretability]
aliases: [/til/interpretable-machine-learning/]
---

> A field associated with understanding the behavior of different models.
- Helps in debugging and improving model performance in real world 
- Make sure the model is learning the *right* thing. (Not taking shortcuts)
	- Example: Classifying a wolf or a dog based on the background rather than the animal.
- Sometimes accuracy is not the only thing that is important.
	- Churn model - predicts customer who are most likely to churn
	- Important that we also know why the model predicts the certain churn, so we can deal with it accordingly.
	- This can help us make decisions
- Increase trust worthiness of a model.
- Can help in increasing our understanding of the domain.
- Can be used to convince stakeholders that the model is good.

**Explanations focus on abnormality**
# The Landscape
The techniques used in model interpretablity follow the following taxonomy. 
## Interpretable By Design
Some models like `Linear Regression` are *interpretable by design*.  One can simply look at the final equation of get a somewhat good understanding of how things are influencing the final result. Same with something like a small `Decision Tree`. There are also more complex, yet intrepretable models such as `General Additive Models (GAM)`.
## Not Easily Intrepretable Models 
(*require host-hoc methods*)
But there is another class of machine learning models that are much more harder to interpret. These include the likes of `Support Vector Machines (SVM)`, ensemble techniques like `Random Forest` and `Gradient Boosting`,  and neural networks. While the working mechanisms and theory of these systems are well understood, and part of the model's parameters can be studied, how the model works as a whole is largely not understandable.  
At the same time, these harder to understand model tend to have much better performance because of added expressiveness.  
For understanding the less interpretable models, we techniques focus on the model, systematically probing it  and aggregate the results to create insights. These tend to form a extra layer from what we might want to understand, that being the **real world**.   

Real World -> Data -> Black Box Model -> Interpretability Methods -> Human Understanding   

These *post-hoc* methods can be either model-specific or model agnostic, with model agnostic providing a benefit of easy model swapability.
They are further split into *local methods* - which look at single data point and *global methods* - which looks at aggregate of the data.

References:  
[Stanford Seminar on ML Explanability](https://www.youtube.com/watch?v=_DYQdP_F-LA&list=PLoROMvodv4rPh6wa6PGcHH6vMG9sEIPxL&index=1&themeRefresh=1)  
[Interpretable Machine Learning](https://christophm.github.io/interpretable-ml-book/)
