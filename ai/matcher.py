from sentence_transformers import SentenceTransformer, util
from ai.services import services

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')

# Prepare service texts
service_texts = [
    s["name"] + " " + " ".join(s["keywords"])
    for s in services
]

service_embeddings = model.encode(service_texts, convert_to_tensor=True)


def classify_problem(problem):
    query_embedding = model.encode(problem, convert_to_tensor=True)

    similarities = util.cos_sim(query_embedding, service_embeddings)[0]

    results = []

    # 🔥 collect all scores
    for i, score in enumerate(similarities):
        score_val = score.item()

        if score_val > 0.25:  # relaxed threshold
            results.append({
                "name": services[i]["name"],
                "score": round(score_val, 2),
                "price": services[i].get("price", "300 - 1000")
            })

    # sort by score
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    # 🔥 fallback if nothing matched
    if not results:
        return [{
            "name": "General Service",
            "score": 0.3,
            "price": "300 - 1000"
        }]

    return results


def estimate_price(service):
    price_map = {
        "Electrician": "300 - 800",
        "Plumber": "300 - 900",
        "Cleaning": "500 - 1500",
        "AC Repair": "500 - 2000",
        "Carpenter": "400 - 1200",
        "Painting": "1000 - 5000",
        "Sofa Cleaning": "500 - 1500",
        "Bathroom Cleaning": "300 - 1000",
        "Cook": "500 - 2000/day",
        "Massage": "800 - 2500",
        "Home Security": "2000 - 10000",
        "Glass & Aluminium": "1000 - 5000",
        "Appliance Repair": "300 - 1000",   # 🔥 ADD THIS
        "General Service": "300 - 1000"
    }

    return price_map.get(service, "300 - 1000")