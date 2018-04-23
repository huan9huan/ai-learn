# Goal 使用feature extract来fine tuning dogs, 增加aug的数据量能提升准确率？
>  notice: 这个实验中采用的数据量是double aug

## benchmark 
> resnet: 0.73 
> random: 0.08

# Key Results
> BEST - 0.785 saved to: `gs://aid-dogs/ft-dogs/weights/ft-120-dogs-resnet-2221176.h5`
> end to end evaluate: 0.78

# Train 1: train by resnet + drop0.8 + fc1024 + drop0.8 + softmax120 with different optimizer
### network

```
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 1, 1, 2048)        0         
_________________________________________________________________
flatten_3 (Flatten)          (None, 2048)              0         
_________________________________________________________________
dropout_1 (Dropout)          (None, 2048)              0         
_________________________________________________________________
dense_1 (Dense)              (None, 1024)              2098176   
_________________________________________________________________
dropout_2 (Dropout)          (None, 1024)              0         
_________________________________________________________________
dense_2 (Dense)              (None, 1024)              1049600   
_________________________________________________________________
dropout_3 (Dropout)          (None, 1024)              0         
_________________________________________________________________
predictions (Dense)          (None, 120)               123000    
=================================================================
Total params: 3,270,776
Trainable params: 3,270,776
Non-trainable params: 0
```

### id: ft-120-dogs-resnet-3270776
### metrics

### Adam/Adagrad/RMSprop/(default):  
> Fail 
## 原因是因为network太深了，调整去掉一个fc1024就好了？

## train2 : 简化网络
### id: ft-120-dogs-2221176
### arch
```
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 1, 1, 2048)        0         
_________________________________________________________________
flatten_3 (Flatten)          (None, 2048)              0         
_________________________________________________________________
dense_1 (Dense)              (None, 1024)              2098176   
_________________________________________________________________
dropout_1 (Dropout)          (None, 1024)              0         
_________________________________________________________________
predictions (Dense)          (None, 120)               123000    
=================================================================
Total params: 2,221,176
Trainable params: 2,221,176
Non-trainable params: 0
```

### metrics
#### Adam(default)
> @e20 0.73

#### Adagrad(default)
> @e50 0.78 Better

#### Adadelta(default)
> @e10 0.785 BEST & faster than Adagrad

### evaluate
 > top1: 0.78,
 > top2: 0.87,
 > top5: 0.96