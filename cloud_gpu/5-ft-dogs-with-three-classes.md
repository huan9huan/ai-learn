# Goal: 三个类的情况下观察学习情况
## Key result
> Best:  **0.96**
> 验证feature 数据是否是垃圾，很重要
> adam的缺省参数是0.001，而不是0.01，这个很重要

## Resnet
### arch dropout0.5+softmax

### metrics
> 0.5 vs. 0.35

## VGG dropout0.5
### arch dropout0.5+softmax
###  metrics
> 0.741 vs. 0.60

## Inception dropout0.5
## arch dropout0.5+softmax
### metrics
> 0.73 vs. 0.33


## vgg d0.5+fc512+d0.5+sofmax
## arch dropout0.5+softmax
### metrics
> 0.43 vs. 0.34 


## Train 3: 不使用rescale并调整adam来trian
### 首先检验feature是否有效的,然后去掉rescale后继续做train

## hyper paramter
> adam lr=0.001, 或者SGD

### Result
> 0.96 (BEST)