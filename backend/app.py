from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ SQLite Configuration (local file DB)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///items.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB
db = SQLAlchemy(app)

# ✅ Model (Table)
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Integer)

# ✅ Create DB & tables
with app.app_context():
    db.create_all()

# ✅ Health check
@app.route("/")
def home():
    return jsonify({"message": "Flask API with SQLite is running"})

# ✅ CREATE
@app.route("/items", methods=["POST"])
def create_item():
    data = request.get_json()

    item = Item(
        name=data.get("name"),
        price=data.get("price")
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Item created",
        "item": {
            "id": item.id,
            "name": item.name,
            "price": item.price
        }
    }), 201

# ✅ READ ALL
@app.route("/items", methods=["GET"])
def get_items():
    items = Item.query.all()

    return jsonify([
        {"id": i.id, "name": i.name, "price": i.price}
        for i in items
    ])

# ✅ READ ONE
@app.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    item = Item.query.get(item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    return jsonify({
        "id": item.id,
        "name": item.name,
        "price": item.price
    })

# ✅ UPDATE
@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    item = Item.query.get(item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json()

    item.name = data.get("name", item.name)
    item.price = data.get("price", item.price)

    db.session.commit()

    return jsonify({"message": "Item updated"})

# ✅ DELETE
@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = Item.query.get(item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item deleted"})

# ✅ Run app
if __name__ == "__main__":
    app.run(debug=True)