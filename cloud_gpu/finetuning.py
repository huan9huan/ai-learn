from keras import applications
from keras.preprocessing.image import ImageDataGenerator
from keras import optimizers
from keras.models import Sequential, Model
from keras.layers import Input, Dropout, Flatten, Dense, Conv2D
from keras.models import model_from_json
import tensorflow as tf

img_width, img_height = 224, 224

train_data_dir = '~/dogs/train'
validation_data_dir = '~/dogs/val'
# nb_train_samples = 20580
# nb_validation_samples = 20580
epochs = 10
batch_size = 32
n_classes=120

# build the mobilenet network
base = applications.MobileNet(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))
for layer in base.layers[:-1]:
    layer.trainable = False
print 'Model loaded, summary' , base.summary()
# raw_input("input anything to go! ")

input = Input(shape=(img_width,img_width, 3),name = 'image_input')
output_mobilenet = base(input)
x = Flatten(name='flatten')(x)
# x = Dense(128, activation='relu', name='fc1')(x)
# x = Dropout(0.5)(x)
x = Dense(n_classes, activation='softmax', name='predictions')(x)
my_model = Model(input=input, output=x)
print "my model summary", my_model.summary()

my_model.compile(loss='categorical_crossentropy',
              optimizer=optimizers.Adam(lr=0.01),
              metrics=['accuracy'])

raw_input("input anything to go! ")

# prepare data augmentation configuration
train_datagen = ImageDataGenerator(
    rescale=1. / 255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True)

# test_datagen = ImageDataGenerator(rescale=1. / 255)
test_datagen = ImageDataGenerator()

train_generator = train_datagen.flow_from_directory(
    train_data_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical')

validation_generator = test_datagen.flow_from_directory(
    validation_data_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical')

# fine-tune the model
my_model.fit_generator(
    train_generator,
    samples_per_epoch=nb_train_samples,
    epochs=epochs,
    validation_steps=100,
    validation_data=validation_generator)

weigths_file =  raw_input("input anything to save weights> ")
my_model.save_weights(weigths_file)