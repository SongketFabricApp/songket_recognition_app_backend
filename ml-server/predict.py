from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np

pattern_label = ['Subahnale', 'Pucuk Rebung', 'Bunga', 'Sirangkak']

def predict_class(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    model = load_model('./model/songketa_model.h5')
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)
    predict_label = pattern_label[predicted_class]

    return predict_label