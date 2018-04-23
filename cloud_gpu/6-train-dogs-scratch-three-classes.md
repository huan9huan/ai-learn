# Goal: 三个类的情况下观察直接train from scratch

## train1
## arch: 3 Conv layer
148 + 72 + 36

Total params: 1,212,643
Trainable params: 1,212,643

### metrics
> 0.90 vs. 0.88

## train 2
## arch: 3 Conv layer
148 + 72 + 36 + 17

### metrics
> 0.93 vs. 0.85

## train 3
## arch: 4 Conv layer
214 + 112 + 56 + 28  + 14 + 7
### metrics
> val : 0.84