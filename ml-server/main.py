from flask import Flask, request, jsonify
from waitress import serve
from predict import predict_class
import json

app = Flask(__name__)

@app.route("/predict", methods=['POST'])
def index():
    if request.method == 'POST':
        # Mengambil Kunci API dari Request Header
        key = request.headers.get('x-api-key')
        # Jika Kunci API Benar
        if(key == api_key):
            # Try (jika request valid)
            try:
                image_file = request.files['image']
                if not image_file:
                    raise ValueError("No image provided in the request.")                
                image_file.save('uploaded_image.jpg')

                predict_label, dataset_info = predict_class('uploaded_image.jpg')

                result = {'class_pattern': predict_label, 'dataset_info': dataset_info,}
                return jsonify(result)
            # catch (jika request tidak valid)
            except Exception as e:
                print(f"Error: {str(e)}")
                response = jsonify({"status": "bad request", "error_details": str(e)})
                response.status_code = 400  # Set the response status code to 400 Bad Request
                return response
        # Jika Kunci API Salah
        else:
            return jsonify({"status": "unauthorized"})

# Memulai Server
if __name__ == "__main__":
    with open('./private/key.json', 'r') as fileKey:
        api_key = json.load(fileKey).get('ml_key')
    
    print("Server: http://0.0.0.0:8080")
    serve(app, host="0.0.0.0", port=8080)
