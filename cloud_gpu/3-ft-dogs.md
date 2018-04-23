# Goal:
## dogs fine graining - 测试gpu上直接做fine grain的运行情况

# Key Results
## dogs 

## 数据集及其准备
> download tar
> split data into train/val(0.8/0.2)

## benchmark

> random 0.83%(1/120)

## train 1 : resnet + simple with dropout
### arch
Resnet (2018) + fc(256) + dropout(0.5) + softmax(120)

Total params: 24,143,096
Trainable params: 555,384
Non-trainable params: 23,587,712

## hyper parameter: 
> batch size : 32
> epoch: 10

# 结果
> 332s 644ms/step

> best: 0.016

## train 2 : resnet + without dropout

### arch
Resnet (2018) + fc(512) + softmax(120)

## result
> 0.01 **失败**

## train 3 : inception v3

### arch
Resnet (2018) + fc(512) + softmax(120)

## result
> 0.0076 **失败**


## train 4: LR增加的train

LR = 0.1 Adam

## result
> 0.0084 **失败**