# Goal 使用feature extract来fine tuning dogs
https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html

## benchmark 
> resnet e2e的 scratch: 0.37
> random: 0.08

# Key Results
> BEST - 总是失败，改变优化器或者增加深度都没用
> 补记: 因为数据有问题

# Train 1: train by vgg + fc128 + drop0.5 + softmax120 with different optimizer
### network:  + fc128 + drop0.5 + softmax120

### id: ft-120-dogs-vgg-3226872
### metrics

RMSprop(default):  
> fail

SGD(default):  
> fail

Adam(lr=0.01):  
> fail: 深陷在一个固定值中 0.098

Adam(lr=0.001):  
> fail: 深陷在一个固定值中 0.098

Adam(lr=0.0001):  
> fail: 深陷在一个固定值中 0.098

Adam(lr=0.0001):  
> fail: 深陷在一个固定值中 0.098

## Train 2: train by vgg + fc4096 + fc4096 + softmax120 with different optimizer

### id: ft-120-dogs-vgg-120037496

### arch:
```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 7, 7, 512)         0         
_________________________________________________________________
flatten_12 (Flatten)         (None, 25088)             0         
_________________________________________________________________
dense_5 (Dense)              (None, 4096)              102764544 
_________________________________________________________________
dense_6 (Dense)              (None, 4096)              16781312  
_________________________________________________________________
predictions (Dense)          (None, 120)               491640    
=================================================================
Total params: 120,037,496
Trainable params: 120,037,496
Non-trainable params: 0
```

### metrics

#### Adam
> fail： 卡在 0.096

#### SGD
> fail： 仍然卡在 0.096

#### RMSprop
> fail： 仍然卡在 0.096

### 结论分析: more deeper没用，应该是数据的问题