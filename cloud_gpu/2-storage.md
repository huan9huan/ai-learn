# Goal: 比较获得如何做存储方案
方案1：直接从外网下载dataset

方案2：从google cloud storage上下载数据集

# Key results


## Solution 1:
```
wget http://vision.stanford.edu/aditya86/ImageNetDogs/images.tar
```

## results

> 756.82M  15.1MB/s    in 53s

# Solution 2: 使用GS服务

```
from google.colab import auth
auth.authenticate_user()
project_id = 'complete-treat-176910'
bucket_name="aid-dogs"
!gcloud config set project {project_id}
```

## 测试上传数据
```
!gsutil cp ./images.tar gs://{bucket_name}/datasets/dogs.tar
```

## results
> 秒！

