import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

# constants
STRIP_HEIGHT = 20
WIDTH = 600
NUM = 20

city = 'san_francisco'
place = 'golden_gate_bridge'

img_out_array = np.zeros((12 * 20, 600, 3))

for k in range(20):
    img_name = '../data/{}/{}/{}_{}.jpeg'.format(city, place, place, str(k + 1))
    img = Image.open(img_name)
    img_array = np.array(img)
    rgb = np.mean(img_array, axis=(0, 1))[:3]
    img_out_array[k * 12:k * 12 + 12, :] = rgb / 255

plt.figure()
plt.axis("off")
plt.imshow(img_out_array)
plt.show()
