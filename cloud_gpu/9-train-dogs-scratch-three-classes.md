# Goal: 三个dogs类的情况下观察直接train from scratch

## key results:
> 数据量太少，从而很快的收敛，然后无法继续泛化

## train1
## arch: 

```
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d_11 (Conv2D)           (None, 224, 224, 32)      896       
_________________________________________________________________
conv2d_12 (Conv2D)           (None, 224, 224, 64)      18496     
_________________________________________________________________
conv2d_13 (Conv2D)           (None, 224, 224, 128)     73856     
_________________________________________________________________
max_pooling2d_14 (MaxPooling (None, 112, 112, 128)     0         
_________________________________________________________________
conv2d_14 (Conv2D)           (None, 112, 112, 256)     295168    
_________________________________________________________________
max_pooling2d_15 (MaxPooling (None, 56, 56, 256)       0         
_________________________________________________________________
conv2d_15 (Conv2D)           (None, 56, 56, 512)       1180160   
_________________________________________________________________
max_pooling2d_16 (MaxPooling (None, 28, 28, 512)       0         
_________________________________________________________________
conv2d_16 (Conv2D)           (None, 28, 28, 1024)      4719616   
_________________________________________________________________
max_pooling2d_17 (MaxPooling (None, 14, 14, 1024)      0         
_________________________________________________________________
flatten_5 (Flatten)          (None, 200704)            0         
_________________________________________________________________
dense_5 (Dense)              (None, 512)               102760960 
_________________________________________________________________
dropout_4 (Dropout)          (None, 512)               0         
_________________________________________________________________
dense_6 (Dense)              (None, 64)                32832     
_________________________________________________________________
dropout_5 (Dropout)          (None, 64)                0         
_________________________________________________________________
predictions (Dense)          (None, 3)                 195       
=================================================================
Total params: 109,082,179
Trainable params: 109,082,179
Non-trainable params: 0
```

### metrics
> 0.458
> weights: gs://{bucket_name}/tmp/dogs/weights/dogs-scratch-three-109082179/dogs-scratch-three-109082179-01-0.458.hdf5

## train - 简化网络的节点数目

### arch
```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d_1 (Conv2D)            (None, 224, 224, 32)      2432      
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 44, 44, 32)        0         
_________________________________________________________________
conv2d_2 (Conv2D)            (None, 44, 44, 64)        18496     
_________________________________________________________________
max_pooling2d_2 (MaxPooling2 (None, 22, 22, 64)        0         
_________________________________________________________________
conv2d_3 (Conv2D)            (None, 22, 22, 128)       73856     
_________________________________________________________________
max_pooling2d_3 (MaxPooling2 (None, 11, 11, 128)       0         
_________________________________________________________________
conv2d_4 (Conv2D)            (None, 11, 11, 256)       295168    
_________________________________________________________________
max_pooling2d_4 (MaxPooling2 (None, 5, 5, 256)         0         
_________________________________________________________________
conv2d_5 (Conv2D)            (None, 5, 5, 512)         1180160   
_________________________________________________________________
max_pooling2d_5 (MaxPooling2 (None, 2, 2, 512)         0         
_________________________________________________________________
global_average_pooling2d_1 ( (None, 512)               0         
_________________________________________________________________
dense_1 (Dense)              (None, 64)                32832     
_________________________________________________________________
dropout_1 (Dropout)          (None, 64)                0         
_________________________________________________________________
dense_2 (Dense)              (None, 64)                4160      
_________________________________________________________________
dropout_2 (Dropout)          (None, 64)                0         
_________________________________________________________________
predictions (Dense)          (None, 3)                 195       
=================================================================
Total params: 1,607,299
Trainable params: 1,607,299
Non-trainable params: 0
```
## hyper parameter:
> adam: lr 0.001

### metrics
> val: 0.4327 Epoch = 1就跑不动了