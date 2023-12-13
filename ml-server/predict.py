from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np

def predict_class(img_path):
    model = load_model('./model/songketa_model.h5')

    # Load dan preprocess gambar
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    # Prediksi kelas
    predictions = model.predict(img_array)
    class_index = np.argmax(predictions, axis=1)

    # Mapping indeks kelas ke label kelas
    class_labels = {0: 'bunga_palembang', 1: 'pucukRebung_riau', 2: 'sirangkak_sumateraBarat', 3: 'subahnale_lombok', 4: 'bukan_songket'}
    predicted_class = class_labels[class_index[0]]

    return predicted_class
