import os
import shutil
import numpy as np

root = "./Images"
train_dest = "./dogs/train"
val_dest = "./dogs/val"
os.mkdir('./dogs')
os.mkdir(train_dest)
os.mkdir(val_dest)

def mkdirp(dir):
  try:
    os.mkdir(dir)
  except:
    pass

for clz in os.listdir(root):
    srcdir = root + "/" + clz

    train_dir = train_dest + "/" + clz
    mkdirp(train_dir)
    val_dir = val_dest + "/" + clz
    mkdirp(val_dir)

    print "train dir", train_dir
    print "val dir", val_dir
    images = os.listdir(srcdir)

    for f in images:
        if np.random.rand(1) < 0.2:
            shutil.move(srcdir + '/'+ f, val_dir + '/'+ f)
        else:
            shutil.move(srcdir + '/'+ f, train_dir + '/'+ f)