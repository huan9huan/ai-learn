# Goal 使用vgg的feature extract来fine tuning dogs - 能够比resnet的方案更好吗

## date 2018/4/17

## benchmark 
> resnet e2e的 scratch: 0.37
> resnet fine tuning: 0.73
> random: 0.08

# Key Results
> BEST - Fail，可能是数据集有问题，vgg的抗干扰能力太差了？

# Train 1: train by vgg fc1024+fc1024+softmax
### network: 
```
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 7, 7, 512)         0         
_________________________________________________________________
flatten_2 (Flatten)          (None, 25088)             0         
_________________________________________________________________
dropout_1 (Dropout)          (None, 25088)             0         
_________________________________________________________________
dense_3 (Dense)              (None, 1024)              25691136  
_________________________________________________________________
dropout_2 (Dropout)          (None, 1024)              0         
_________________________________________________________________
dense_4 (Dense)              (None, 1024)              1049600   
_________________________________________________________________
dropout_3 (Dropout)          (None, 1024)              0         
_________________________________________________________________
predictions (Dense)          (None, 120)               123000    
=================================================================
Total params: 26,863,736
Trainable params: 26,863,736
Non-trainable params: 0
```

### id: ft-120-dogs-vgg-26863736

### metrics

Adam(default):  
> Fail

SGD(default):  
> Fail

Adam(lr=0.0001):  
> Fail

RMSprop():  
> Fail
