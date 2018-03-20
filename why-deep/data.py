import numpy as np

## generate the X
def sample(size):
    X = np.random.random(size) * 2.0 - 1.0
    noise = np.random.random(size) / 10.0
    Y = X * X + noise
    return X.reshape(size, 1),Y.reshape(size, 1)
