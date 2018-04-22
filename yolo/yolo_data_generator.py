from utils import anno_file_to_yolo_y
import os
import numpy as np

flatten = lambda l: [item for sublist in l for item in sublist]

class YoloDataGenerator(object):
    'Generates image yolo from dataset'
    def __init__(self, image_dir, annotation_dir, grid = (7,7), batch_size = 16, target_size = (224, 224)):
        'Initialization'
        self.image_dir = image_dir # image id list
        self.annotation_dir = annotation_dir
        ids = []
        for clz in os.listdir(annotation_dir):
            ids.append([clz + "/" + f for f in os.listdir(annotation_dir + "/" + clz)])
        self.ids = flatten(ids)
        self.steps = 0
        self.batch_size = batch_size
        self.target_size = target_size
        self.grid = grid

    def generate(self):
        while self.steps < len(self.ids) // self.batch_size:
            ids = self.ids[self.steps * self.batch_size: (self.steps + 1) * self.batch_size]
            image_files = [self.image_dir + "/" + id + "." + JPEG_EXT for id in ids]
            anno_files = [self.annotation_dir + "/" + id for id in ids]
            ys = [anno_file_to_yolo_y(af, self.grid) for af in anno_files]
            xs = [image.img_to_array(image.load_img(image_file,target_size =  self.target_size)) for image_file in image_files]
            self.steps += 1
            yield np.array(xs, dtype=np.float16), np.array(ys, dtype=np.float16)