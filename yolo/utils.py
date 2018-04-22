from keras import applications, losses
from keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from keras import optimizers
from keras.models import Sequential, Model, K
from keras.layers import Lambda, Input, Dropout, Flatten, Dense, Conv2D, BatchNormalization, Activation, AveragePooling2D, concatenate, GlobalAveragePooling2D, MaxPooling2D
from keras.models import model_from_json
from keras.callbacks import ModelCheckpoint
from keras.metrics import top_k_categorical_accuracy
from keras.utils import Progbar, GeneratorEnqueuer
from keras.applications import imagenet_utils
import tensorflow as tf
import numpy as np
import os
import xml.etree.ElementTree as ET

# libs
def mkdirp(dir):
  try:
    os.mkdir(dir)
  except:
    pass

def load_base(model):
  if model == "vgg" or model == "vgg16":
      return applications.VGG16(weights='imagenet', include_top=False),  applications.vgg16.decode_predictions, applications.vgg16.preprocess_input
  elif model == "mobilenet" or model == "mn":
      return applications.MobileNet(weights='imagenet', include_top=False, input_shape=(224, 224, 3)), applications.mobilenet.decode_predictions, applications.mobilenet.preprocess_input
  elif model == "resnet" or model == "resnet50":
      return applications.ResNet50(weights='imagenet', include_top=False), applications.resnet50.decode_predictions, applications.resnet50.preprocess_input
  elif model == "inceptionv3" or model == "inception":
      return applications.InceptionV3(weights='imagenet', include_top=False, input_shape=(224, 224, 3)), applications.inception_v3.decode_predictions, applications.inception_v3.preprocess_input
  else:
      return None
    
def load_model(model):
  if model == "vgg" or model == "vgg16":
      return applications.VGG16(weights='imagenet'),  applications.vgg16.decode_predictions, applications.vgg16.preprocess_input
  elif model == "mobilenet" or model == "mn":
      return applications.MobileNet(weights='imagenet', input_shape=(224, 224, 3)), applications.mobilenet.decode_predictions, applications.mobilenet.preprocess_input
  elif model == "resnet" or model == "resnet50":
      return applications.ResNet50(weights='imagenet'), applications.resnet50.decode_predictions, applications.resnet50.preprocess_input
  elif model == "inceptionv3" or model == "inception":
      return applications.InceptionV3(weights='imagenet', input_shape=(224, 224, 3)), applications.inception_v3.decode_predictions, applications.inception_v3.preprocess_input
  else:
      return None

def npy_file(basedir, prefix):
  return "{}/{}.npy".format(basedir, prefix)

def npy_file_x(basedir, prefix):
  return npy_file(basedir, prefix + ".x")

def npy_file_y(basedir, prefix):
  return npy_file(basedir, prefix + ".y")


def load_feature(dir, prefix):
  feature_file = npy_file_x(dir, prefix)
  label_file = npy_file_y(dir, prefix)
  features = np.load(open(feature_file))
  labels = np.load(open(label_file))
  return features, labels

def conv2d_bn(x,
              filters,
              num_row,
              num_col,
              padding='same',
              strides=(1, 1),
              name=None):
    filters = int(filters)
    x = Conv2D(
        filters, (num_row, num_col),
        strides=strides,
        padding=padding,
        use_bias=False,
        name=name + "_conv")(x)
    x = BatchNormalization(scale=False, name=name + "_bn")(x)
    x = Activation('relu', name=name)(x)
    return x 

def incept(x, name, scale=1):
    branch1x1 = conv2d_bn(x, 64 // scale, 1, 1, name = name + "-1x1")

    branch5x5 = conv2d_bn(x, 48 // scale , 1, 1, name = name + "-5x5-1x1")
    branch5x5 = conv2d_bn(branch5x5, 64 // scale, 5, 5, name = name + "-5x5-5x5")

    branch3x3dbl = conv2d_bn(x, 64 // scale, 1, 1, name = name + "-3x3-1x1")
    branch3x3dbl = conv2d_bn(branch3x3dbl, 96 // scale, 3, 3, name = name + "-3x3-3x3-1")
    branch3x3dbl = conv2d_bn(branch3x3dbl, 96 // scale, 3, 3, name = name + "-3x3-3x3-2")

    branch_pool = AveragePooling2D((3, 3), strides=(1, 1), padding='same')(x)
    branch_pool = conv2d_bn(branch_pool, 32 // scale, 1, 1, name = name + "-pool")
    return concatenate(
        [branch1x1, branch5x5, branch3x3dbl, branch_pool],
        name= name + '-all')

JPEG_EXT = "JPEG"

def anno_file_to_rect(anno_file):
    tree = ET.parse(anno_file)
    objs = tree.getroot().findall("object")
    boxes = [obj.find("bndbox") for obj in objs]
    return [(int(box.find("xmin").text), 
              int(box.find("ymin").text), 
              int(box.find("xmax").text), 
              int(box.find("ymax").text)) for box in boxes][0]

def get_image_size(af):
    tree = ET.parse(af)
    objs = tree.getroot().findall("object")
    boxes = [obj.find("bndbox") for obj in objs]
    image_size_el = tree.getroot().find("size")
    return (float(image_size_el.find("width").text), float(image_size_el.find("height").text))

## return 7 x 7 * 5(C, cx, cy, hx, hy)
def anno_file_to_yolo_y(af, grid = (7 , 7)):
    tree = ET.parse(af)
    objs = tree.getroot().findall("object")
    boxes = [obj.find("bndbox") for obj in objs]
    image_size_el = tree.getroot().find("size")
    image_width = float(image_size_el.find("width").text)
    image_height = float(image_size_el.find("height").text)
    cell_width = image_width / grid[0]
    cell_height = image_height / grid[1]
    
    rect = [(float(box.find("xmin").text), 
          float(box.find("ymin").text), 
          float(box.find("xmax").text), 
          float(box.find("ymax").text)) for box in boxes][0]

    width = rect[2] - rect[0]
    height = rect[3] - rect[1]
    center_x = (rect[2] + rect[0]) / 2.0
    center_y = (rect[3] + rect[1]) / 2.0
    
    # find which cell is the 1 one
    cell_idx_x = int(center_x * grid[0] / image_width)
    cell_idx_y = int(center_y * grid[1] / image_height)
    
    y1 = [1, 
          center_x / cell_width - cell_idx_x, 
          center_y / cell_height - cell_idx_y,
          width / image_width,
          height / image_height
         ]
    
    y = np.zeros((5 * grid[0] * grid[1]), dtype=np.float16)
    base = cell_idx_x  + cell_idx_y * grid[0]
    y[base * 5: (base + 1) * 5] = y1
    
    return y
  
def img2data(image_file):
  return np.array([img_to_array(load_img(image_file, target_size = (224, 224)))], dtype=np.float16)

def create_random_model(base_model, n_ouputs):
  input = Input(shape=(img_width, img_height, 3), name = 'feature_input')
  x = base_model(input)
  x = Flatten()(x)
  x = Dense(n_ouputs, activation='sigmoid', name='predictions')(x)
  return Model(input=input, output=x)