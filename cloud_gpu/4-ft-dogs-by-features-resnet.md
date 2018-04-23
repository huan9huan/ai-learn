# Goal 使用feature extract来fine tuning dogs
https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html

# Key Results
> BEST - 0.37

> 使用较大的LR下，adam竟然无法train出来，纠正我以前的偏误- 不同的优化器的差别不是一点，而是巨大
> 使用adam+decay=0.9, 也竟然无法train出来

# feature extraction

# Train 1: train by resnet + fc128 + drop0.5 + softmax120
### network:  + fc128 + drop0.5 + softmax120

### metrics
RMSprop(default):  
> epoch=50, val_accu 0.36
> overfitting严重 (0.57)

Adam(lr=0.001, decay=0.9):  
> 彻底失败，无法收敛

Adam(lr=0.0001):  
> epoch 50 val accu: 0.37
> overffing 0.63

Adam(lr=0.0001, decay=0.9):  
> 彻底失败，无法收敛

## Train 2: train by resnet feature + more deep

### network

```
Layer (type)                 Output Shape              Param #   
=================================================================
feature_input (InputLayer)   (None, 1, 1, 2048)        0         
_________________________________________________________________
dropout_21 (Dropout)         (None, 1, 1, 2048)        0         
_________________________________________________________________
dense_17 (Dense)             (None, 1, 1, 512)         1049088   
_________________________________________________________________
flatten_29 (Flatten)         (None, 512)               0         
_________________________________________________________________
fc2 (Dense)                  (None, 128)               65664     
_________________________________________________________________
dropout_22 (Dropout)         (None, 128)               0         
_________________________________________________________________
predictions (Dense)          (None, 120)               15480    

Total params: 1,130,232
Trainable params: 1,130,232
Non-trainable params: 0
```

## metrics

> val accu ?

///
### Train 3: train by vgg feature + simple network with dropout

### network: inception + fc128 + softmax

## metrics
> val accu ~ 0.16
> overfitting

## Train 3: train by resnet + FC
### network - FC 128 + Softmax120

### metrics
> val accu ~ 0.01


