# 实验目的：对比MacBookPro/Cola notebooks/a1/l2 之间的性能

## 如何run

`python ./mnist.py`

## 关键结果

> K80的性能大约是MBP 3倍的性能, 是A1的6倍，L2的12倍。

## MacBookPro:
### 关键硬件

> i5 + ssd

### metrics

> 137s/epoch  
> *2ms/step*

## Cola Notebook
### 关键硬件

> GPU **K80**

### metrics
> 50s/epoch  
> *836us/step*

## A1

### 关键硬件
> 非SSD + 4 vCPU

### metrics

> 327s/epoch  
> 5ms/step  
> 400% CPU占用率

## L2
### 关键硬件

> SSD + 1 CPU + 2G RAM

### metrics
> 575s/epoch  
> 10ms/step  
> cpu 100%
