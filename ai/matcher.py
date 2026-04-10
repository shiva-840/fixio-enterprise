from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ai.services import services

# 1. Initialize Vectorizer
vectorizer = TfidfVectorizer(stop_words='english')

# 2. Extract texts to represent each service
# Each list item corresponds to services[i]
service_texts = [
    f"{s['name']} " + " ".join(s['keywords']) 
    for s in services
]

# 3. Fit vectorizer on known services
service_tfidf = vectorizer.fit_transform(service_texts)

def classify_problem(problem):
    # Transform the user's string
    query_tfidf = vectorizer.transform([problem])
    
    # Calculate cosine similarity with all services
    similarities = cosine_similarity(query_tfidf, service_tfidf)[0]
    
    results = []
    
    # 4. Collect scores
    for i, score in enumerate(similarities):
        score_val = float(score)
        if score_val > 0.05:  # TF-IDF matches can have low overlap but still be super relevant
            results.append({
                "name": services[i]["name"],
                "score": round(score_val, 2),
                "price": services[i].get("price", "300 - 1000")
            })
            
    # sort by score
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    
    # fallback
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
        "Appliance Repair": "300 - 1000",
        "General Service": "300 - 1000"
    }

    return price_map.get(service, "300 - 1000")