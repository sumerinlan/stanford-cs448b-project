import cv2
import matplotlib.pyplot as plt
import numpy as np
from sklearn.cluster import KMeans

# constants
STRIP_HEIGHT = 20
WIDTH = 600
NUM = 20

city = 'san_francisco'
place = 'golden_gate_bridge'


# Reference: https://www.pyimagesearch.com/2014/05/26/opencv-python-k-means-color-clustering/

def centroid_histogram(_clt):
    # grab the number of different clusters and create a histogram
    # based on the number of pixels assigned to each cluster
    num_labels = np.arange(0, len(np.unique(_clt.labels_)) + 1)
    (_hist, _) = np.histogram(_clt.labels_, bins=num_labels)
    # normalize the histogram, such that it sums to one
    _hist = _hist.astype("float")
    _hist /= _hist.sum()
    # return the histogram
    return _hist


def plot_colors(_bar, _hist, centroids):
    # representing the relative frequency of each of the colors
    start_x = 0
    # loop over the percentage of each cluster and the color of each cluster
    for (percent, color) in zip(_hist, centroids):
        # plot the relative percentage of each cluster
        end_x = start_x + (percent * WIDTH)
        cv2.rectangle(_bar, (int(start_x), 0), (int(end_x), STRIP_HEIGHT),
                      color.astype("uint8").tolist(), -1)
        start_x = end_x


img_out_array = np.zeros((STRIP_HEIGHT * NUM, WIDTH, 3))

for k in range(NUM):
    img_name = '../data/{}/{}/{}_{}.jpeg'.format(city, place, place, str(k + 1))
    img = cv2.imread(img_name)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.reshape((img.shape[0] * img.shape[1], 3))

    # cluster the pixel intensities
    clt = KMeans(n_clusters=5)
    clt.fit(img)

    hist = centroid_histogram(clt)
    plot_colors(img_out_array[k * STRIP_HEIGHT:(k + 1) * STRIP_HEIGHT, :, :], hist, clt.cluster_centers_)

    print(k)

img_out_array /= 255

plt.figure()
plt.axis("off")
plt.imshow(img_out_array)
plt.show()
