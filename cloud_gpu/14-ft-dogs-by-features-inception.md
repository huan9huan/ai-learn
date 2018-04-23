# Goal 使用feature extract来fine tuning dog, 使用inception方案

## benchmark 
> resnet: 0.73
> resnet-double: 0.78
> resnet-e2e: 0.76
> random: 0.083

# Key Results
> BEST - 0.80
> end to end evaluate: top1 0.89, eval的结果非常好!
> Inception的feature能用吗 - 能用,而且看起来比resnet更好

## Train 1: train by inception + drop0.8 + softmax120 with different optimizer
## feature round = 1
### network
```
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 5, 5, 2048)        0         
_________________________________________________________________
flatten_1 (Flatten)          (None, 51200)             0         
_________________________________________________________________
dropout_1 (Dropout) **0.8**          (None, 51200)             0         
_________________________________________________________________
predictions (Dense)          (None, 120)               6144120   
=================================================================
Total params: 6,144,120
Trainable params: 6,144,120
Non-trainable params: 0
```

### id: inception-ft-dogs-6144120
### metrics
#### Adadelta(default):  
> 0.80 @e20
> overfitting (0.94)
> saved to `inception/inception-ft-dogs-inception-6144120.h5`

## end to end evaluate
> val: top 1/top2/top5: 0.83/0.93/0.98