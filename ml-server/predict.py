from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np

class_info = {
    'bunga_palembang': {
        'idfabric': 'iE4tt0byiA912ViUQqu9',
        "fabricname": "Songket Palembang",        
        'origin': 'Palembang',
        'pattern': 'Bunga',
        'img_url': 'https://storage.googleapis.com/songket-fab/fabric/fabric1702409889130.jpg',
        'description': 'Tenun songket Palembang sudah ada sejak zaman kerajaan Sriwijaya dan kesultanan Darusalam yang terjadi karena akulturasi budaya antar bangsa, yang dulunya hanya dipergunakan oleh raja dan keluarga, serta di zaman kesultanan hanya digunakan oleh sultan dan kerabat keraton saja. Salah satu motif songket pada songket Palembang adalah motif bunga. Kain dengan motif bunga mawar memiliki arti sebagai bentuk ramah tama, kelembutan. Hal ini yang membuat kain songket jenis bunga mawar dipakai sebagai peyambut tamu atau tuan rumah.',
    },
    'pucukRebung_riau': {
        'idfabric': 'NCWApvWBMp5OWYh2O9oX',
        "fabricname": "Songket Melayu Riau",        
        'origin': 'Riau',
        'pattern': 'Pucuk Rebung',
        'img_url': 'https://storage.googleapis.com/songket-fab/fabric/fabric1702022443089.webp',
        'description': 'Masyarakat Melayu Riau meyakini dengan kuat akan signifikansi alam, di mana unsur alam dan flora memiliki makna sebagai simbol. Salah satu motif yang umum ditemukan pada Songket Melayu Riau adalah motif pucuk rebung. Pucuk rebung dalam motif ini melambangkan tekad untuk mencapai tujuan, keberuntungan, dan harapan. Selain itu, motif ini juga mencerminkan semangat persatuan dan hati yang terbuka di kalangan masyarakat Riau. Dalam klasifikasi motif Melayu, pucuk rebung diinterpretasikan sebagai simbol pohon bambu yang kokoh dan tidak mudah roboh, bahkan saat dihadapkan dengan angin kencang',
    },
    'sirangkak_sumateraBarat': {
        'idfabric': 'Xt3cKsb4Z23C0kevmI5s',
        "fabricname": "Songket Minangkabau",        
        'origin': 'Sumatera Barat',
        'pattern': 'Sirangkak',
        'img_url': 'https://storage.googleapis.com/songket-fab/fabric/fabric1702619656892.jpg',
        'description': 'Motif sirangkak berbentuk seperti capit kepiting yang disusun sehingga membentuk bunga. Sirangkak yaitu hewan kecil seperti kepiting yang hidup di air tawar dan di rawarawa. Sirangkak mempunyai pencapit untuk melindungi diri. Walaupun jepitan yang ia punya selalu terbuka tapi sirangkak tidak menjepit semua yang ditemuinya, hanya sebagai kewaspadaan terhadap musuh yang diutamakannya. Namun jika diganggu, sirangkak tidak segan-segan untuk menjepit apapun. Motif ini memiliki makna kehati-hatian dan kewaspadaan seperti yang terdapat dalam pepatah Minangkabau musuah indak dicari, basuo pantang dielakkan',
    },
    'subahnale_lombok': {
        'idfabric': 'K10gWXvaQ3Z60KywoYIa',
        "fabricname": "Songket Sukarara",        
        'origin': 'Lombok',
        'pattern': 'Subahnale',
        'img_url': 'https://storage.googleapis.com/songket-fab/fabric/fabric1702451913409.png',
        'description': 'Motif Subahnale pertama kali muncul pada pemerintahan Raja Panji Sukarara dan Dinde Terong Kuning. Motif ini berkembang dari motif wayang dan dikenal karena tingkat kerumitan proses pembuatannya. Nama \"Subahnale\" sendiri mencerminkan dimensi spiritual. Songket subahnale ini memiliki makna Yang Maha Esa atau Yang Maha Kuasa. Hal ini dikarenakan selama proses pembuatannya, penenun selalu mengingat tentang keberadaan Tuhan Yang Maha Kuasa. Dalam proses tersebut, masyarakat menggunakannya sebagai salah satu wirid yang diucapkan untuk selalu dekat dengan Yang Maha Kuasa. Setelah proses pembuatan selesai, penenun menyampaikan ungkapan syukur, seperti kata "subhanallah" atau dalam dialek Sasak disebut "subahnale.',
    },
    'bukan_songket': {
        'description': 'Ini Bukan Kain Songket'
    },
}

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

    # Informasi dataset berdasarkan motif yang diprediksi
    dataset_info = class_info.get(predicted_class, {})

    return predicted_class, dataset_info
