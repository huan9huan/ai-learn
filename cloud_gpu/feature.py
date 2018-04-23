from keras import applications
from keras.preprocessing.image import ImageDataGenerator
from keras import optimizers
from keras.models import Sequential, Model
from keras.layers import Input, Dropout, Flatten, Dense, Conv2D
from keras.models import model_from_json
import tensorflow as tf

import os
import shutil
import numpy as np

def mkdirp(dir):
  try:
    os.mkdir(dir)
  except:
    pass


def split(root, train_dest, val_dest):
    mkdirp(train_dest)
    mkdirp(val_dest)
    for clz in os.listdir(root):
        srcdir = root + "/" + clz
        if not os.path.isdir(srcdir): 
            continue

        train_dir = train_dest + "/" + clz
        mkdirp(train_dir)
        val_dir = val_dest + "/" + clz
        mkdirp(val_dir)

        print "train dir", train_dir, "val dir:", val_dir
        images = os.listdir(srcdir)

        for f in images:
            if np.random.rand(1) < 0.2:
                shutil.copy(srcdir + '/'+ f, val_dir + '/'+ f)
            else:
                shutil.copy(srcdir + '/'+ f, train_dir + '/'+ f)

if __name__ == "__main__":
    src_root = "/Users/xuan/work/dataset/dogs_web"
    dest_root = "./dogs"
    feature_dir = "./resnet"

    mkdirp(dest_root)
    train_dest = dest_root + "/train"
    val_dest = dest_root + "/val"

    split(src_root, train_dest, val_dest)

    nb_train_samples = 16365 #TODO
    nb_val_samples = 4215 #TODO
    epochs = 10
    batch_size = 32
    n_classes=120
    img_width, img_height = 224, 224

    base = applications.ResNet50(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))
    for layer in base.layers[:-1]:
        layer.trainable = False
    
    train_datagen = ImageDataGenerator(
        rescale=1. / 255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True)

    # test_datagen = ImageDataGenerator(rescale=1. / 255)
    test_datagen = ImageDataGenerator()

    train_generator = train_datagen.flow_from_directory(
        train_dest,
        target_size=(img_height, img_width),
        batch_size=batch_size)

    validation_generator = test_datagen.flow_from_directory(
        val_dest,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical')

    # generate the feature files
    mkdirp(feature_dir)
    generator = train_datagen.flow_from_directory(
            train_dest,
            target_size=(img_width, img_height),
            batch_size=batch_size,
            class_mode='categorical',
            shuffle=False)  

    bottleneck_features_train = base.predict_generator(generator, 2, verbose=1)
    np.save(open(feature_dir + '/train.npy', 'w'), bottleneck_features_train)
    label_map = (generator.class_indices)