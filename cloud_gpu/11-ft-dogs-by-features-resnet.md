# Goal 使用feature extract来fine tuning dogs
https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html

## benchmark 
> resnet simple network: 0.37
> random: 0.08

# Key Results
> BEST - 0.735 - 采用了Adagrad的优化

# Train 1: train by resnet + drop0.8 + fc1024 + drop0.8 + softmax120 with different optimizer
### network

```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 1, 1, 2048)        0         
_________________________________________________________________
flatten_5 (Flatten)          (None, 2048)              0         
_________________________________________________________________
dropout_1 (Dropout)          (None, 2048)              0         
_________________________________________________________________
dense_4 (Dense)              (None, 1024)              2098176   
_________________________________________________________________
dropout_2 (Dropout)          (None, 1024)              0         
_________________________________________________________________
predictions (Dense)          (None, 120)               123000    
=================================================================
Total params: 2,221,176
Trainable params: 2,221,176
Non-trainable params: 0
```

### id: ft-120-dogs-resnet-120037496
### metrics

### Adam(default):  
> 0.68 @e50

#### SGD
> 0.70 @e20

#### RMSprop
> 0.72 @e20

### Adagrad
> 0.735 @e50