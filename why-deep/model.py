import numpy as np
import tensorflow as tf

def shadow(X):
    ## layer 1 node 1
    W1 = tf.Variable(np.random.randn(), name="weight_1")
    b1 = tf.Variable(np.random.randn(), name="bias_1")
    z1 =  W1 * X + b1
    a1 = tf.nn.relu(z1)

    # layer 1 node 2
    W2 = tf.Variable(np.random.randn(), name="weight_2")
    b2 = tf.Variable(np.random.randn(), name="bias_2")
    z2 =  W2 * X + b2
    a2 = tf.nn.relu(z2)

    b = tf.Variable(np.random.randn(), name="bias")

    return a1 + a2 + b

def deep(X):
    #layer 1
    W1 = tf.Variable(np.random.randn())
    b1 = tf.Variable(np.random.randn())
    z1 = W1 * X + b1 
    a1 = tf.nn.relu(z1)

    #layer 2
    W2 = tf.Variable(np.random.randn())
    b2 = tf.Variable(np.random.randn())
    z2 =  W2 * a1 + b2
    a2 = tf.nn.relu(z2)

    b = tf.Variable(np.random.randn())    
    return a2 + b

def _deep(X):
    #layer 1
    W1 = tf.Variable(np.random.randn(), name="weight_1")
    b1 = tf.Variable(np.random.randn(), name="bias_1")
    z1 = W1 * X + b1 
    a1 = tf.nn.relu(z1)

    #layer 2
    W2 = tf.Variable(np.random.randn(), name="weight_2")
    b2 = tf.Variable(np.random.randn(), name="bias_2")
    z2 =  W2 * a1 + b2
    a2 = tf.nn.relu(z2)

    b = tf.Variable(np.random.randn(), name="bias")    
    return a2 + b