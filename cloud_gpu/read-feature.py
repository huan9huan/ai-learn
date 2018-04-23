from keras import applications
from keras.preprocessing.image import ImageDataGenerator
from keras import optimizers
from keras.models import Sequential, Model
from keras.layers import Input, Dropout, Flatten, Dense, Conv2D
from keras.models import model_from_json
import tensorflow as tf
import sys
import os
import shutil
import numpy as np

if __name__ == "__main__":
    npy = "./resnet/train.npy" # sys.argv[1]
    npy_data = np.load(open(npy))