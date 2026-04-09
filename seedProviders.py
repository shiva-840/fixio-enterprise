from database import db
 
db["providers"].delete_many({})
 
providers = [
    #Elec
    {"name": "Ravi Kumar", "service": "electrician", "rating": 4.9, "price": 349, "location": "Bengaluru", "experience": "8 years", "jobs": 312, "photo": "https://randomuser.me/api/portraits/men/11.jpg", "bio": "Certified electrician specialising in home wiring & repairs."},
    {"name": "Suresh Nair", "service": "electrician", "rating": 4.7, "price": 299, "location": "Bengaluru", "experience": "5 years", "jobs": 198, "photo": "https://randomuser.me/api/portraits/men/22.jpg", "bio": "Fast, reliable electrical work at affordable prices."},
    {"name": "Arjun Mehta", "service": "electrician", "rating": 4.5, "price": 279, "location": "Bengaluru", "experience": "3 years", "jobs": 134, "photo": "https://randomuser.me/api/portraits/men/33.jpg", "bio": "Specialises in inverter installations and fan fittings."},
    {"name": "Vijay Sharma", "service": "electrician", "rating": 4.3, "price": 249, "location": "Bengaluru", "experience": "2 years", "jobs": 89, "photo": "https://randomuser.me/api/portraits/men/44.jpg", "bio": "Handles all minor electrical issues quickly."},
    # Plumber
    {"name": "Ramesh Patil", "service": "plumber", "rating": 4.8, "price": 399, "location": "Bengaluru", "experience": "10 years", "jobs": 421, "photo": "https://randomuser.me/api/portraits/men/55.jpg", "bio": "Expert in leak detection and pipe repair."},
    {"name": "Mohan Das", "service": "plumber", "rating": 4.6, "price": 349, "location": "Bengaluru", "experience": "6 years", "jobs": 267, "photo": "https://randomuser.me/api/portraits/men/66.jpg", "bio": "Reliable plumber for drains, taps and geysers."},
    {"name": "Kiran Reddy", "service": "plumber", "rating": 4.4, "price": 299, "location": "Bengaluru", "experience": "4 years", "jobs": 155, "photo": "https://randomuser.me/api/portraits/men/77.jpg", "bio": "Specialises in bathroom fittings and geyser installation."},
    {"name": "Sanjay Joshi", "service": "plumber", "rating": 4.2, "price": 269, "location": "Bengaluru", "experience": "2 years", "jobs": 78, "photo": "https://randomuser.me/api/portraits/men/88.jpg", "bio": "Handles all basic plumbing needs."},
    # Cleaning
    {"name": "Priya Sharma", "service": "cleaning", "rating": 4.9, "price": 599, "location": "Bengaluru", "experience": "7 years", "jobs": 543, "photo": "https://randomuser.me/api/portraits/women/11.jpg", "bio": "Deep cleaning specialist — leaves homes spotless."},
    {"name": "Kavitha Menon", "service": "cleaning", "rating": 4.7, "price": 499, "location": "Bengaluru", "experience": "5 years", "jobs": 389, "photo": "https://randomuser.me/api/portraits/women/22.jpg", "bio": "Thorough and punctual home cleaning professional."},
    {"name": "Neha Singh", "service": "cleaning", "rating": 4.5, "price": 449, "location": "Bengaluru", "experience": "3 years", "jobs": 201, "photo": "https://randomuser.me/api/portraits/women/33.jpg", "bio": "Eco-friendly cleaning products used always."},
    {"name": "Sunita Rao", "service": "cleaning", "rating": 4.3, "price": 399, "location": "Bengaluru", "experience": "2 years", "jobs": 112, "photo": "https://randomuser.me/api/portraits/women/44.jpg", "bio": "Affordable and efficient home cleaning."},
    # AC Repair
    {"name": "Anand Verma", "service": "ac repair", "rating": 4.9, "price": 699, "location": "Bengaluru", "experience": "9 years", "jobs": 498, "photo": "https://randomuser.me/api/portraits/men/12.jpg", "bio": "All brands AC repair and gas refill expert."},
    {"name": "Deepak Kulkarni", "service": "ac repair", "rating": 4.7, "price": 599, "location": "Bengaluru", "experience": "6 years", "jobs": 312, "photo": "https://randomuser.me/api/portraits/men/23.jpg", "bio": "Fast AC diagnosis and repair with warranty."},
    {"name": "Rohit Bansal", "service": "ac repair", "rating": 4.5, "price": 549, "location": "Bengaluru", "experience": "4 years", "jobs": 178, "photo": "https://randomuser.me/api/portraits/men/34.jpg", "bio": "Specialises in split and window AC servicing."},
    {"name": "Manoj Tiwari", "service": "ac repair", "rating": 4.3, "price": 499, "location": "Bengaluru", "experience": "3 years", "jobs": 134, "photo": "https://randomuser.me/api/portraits/men/45.jpg", "bio": "Affordable AC maintenance and repair."},
    # Carpenter
    {"name": "Prakash Hegde", "service": "carpenter", "rating": 4.8, "price": 499, "location": "Bengaluru", "experience": "12 years", "jobs": 567, "photo": "https://randomuser.me/api/portraits/men/56.jpg", "bio": "Custom furniture and home woodwork specialist."},
    {"name": "Sunil Gowda", "service": "carpenter", "rating": 4.6, "price": 449, "location": "Bengaluru", "experience": "8 years", "jobs": 334, "photo": "https://randomuser.me/api/portraits/men/67.jpg", "bio": "Expert in wardrobe fitting and door repairs."},
    {"name": "Ajay Naik", "service": "carpenter", "rating": 4.4, "price": 399, "location": "Bengaluru", "experience": "5 years", "jobs": 212, "photo": "https://randomuser.me/api/portraits/men/78.jpg", "bio": "Reliable carpenter for all home furniture work."},
    # Painting
    {"name": "Rajan Pillai", "service": "painting", "rating": 4.9, "price": 799, "location": "Bengaluru", "experience": "10 years", "jobs": 423, "photo": "https://randomuser.me/api/portraits/men/13.jpg", "bio": "Interior and exterior painting with premium finish."},
    {"name": "Ganesh Babu", "service": "painting", "rating": 4.7, "price": 699, "location": "Bengaluru", "experience": "7 years", "jobs": 298, "photo": "https://randomuser.me/api/portraits/men/24.jpg", "bio": "Texture and designer paint specialist."},
    {"name": "Suresh Iyer", "service": "painting", "rating": 4.5, "price": 599, "location": "Bengaluru", "experience": "5 years", "jobs": 187, "photo": "https://randomuser.me/api/portraits/men/35.jpg", "bio": "Clean and tidy painter with zero mess guarantee."},
    # Sofa Cleaning
    {"name": "Meera Pillai", "service": "sofa cleaning", "rating": 4.8, "price": 499, "location": "Bengaluru", "experience": "6 years", "jobs": 234, "photo": "https://randomuser.me/api/portraits/women/55.jpg", "bio": "Sofa and upholstery steam cleaning expert."},
    {"name": "Divya Nair", "service": "sofa cleaning", "rating": 4.6, "price": 449, "location": "Bengaluru", "experience": "4 years", "jobs": 167, "photo": "https://randomuser.me/api/portraits/women/66.jpg", "bio": "Removes stains and odours from all fabric types."},
    {"name": "Anita Desai", "service": "sofa cleaning", "rating": 4.4, "price": 399, "location": "Bengaluru", "experience": "3 years", "jobs": 98, "photo": "https://randomuser.me/api/portraits/women/77.jpg", "bio": "Affordable sofa and curtain cleaning."},
    # Bathroom Cleaning
    {"name": "Rekha Nair", "service": "bathroom cleaning", "rating": 4.8, "price": 349, "location": "Bengaluru", "experience": "5 years", "jobs": 312, "photo": "https://randomuser.me/api/portraits/women/88.jpg", "bio": "Deep bathroom sanitisation and tile cleaning."},
    {"name": "Shalini Menon", "service": "bathroom cleaning", "rating": 4.6, "price": 299, "location": "Bengaluru", "experience": "4 years", "jobs": 198, "photo": "https://randomuser.me/api/portraits/women/13.jpg", "bio": "Spotless bathrooms with disinfectant treatment."},
    {"name": "Usha Rani", "service": "bathroom cleaning", "rating": 4.4, "price": 249, "location": "Bengaluru", "experience": "2 years", "jobs": 89, "photo": "https://randomuser.me/api/portraits/women/24.jpg", "bio": "Quick and hygienic bathroom cleaning."},
    # Cook
    {"name": "Ananya Krishnan", "service": "cook", "rating": 4.9, "price": 599, "location": "Bengaluru", "experience": "8 years", "jobs": 456, "photo": "https://randomuser.me/api/portraits/women/35.jpg", "bio": "South Indian and North Indian cuisine expert."},
    {"name": "Lakshmi Devi", "service": "cook", "rating": 4.7, "price": 499, "location": "Bengaluru", "experience": "5 years", "jobs": 287, "photo": "https://randomuser.me/api/portraits/women/46.jpg", "bio": "Healthy home-cooked meals daily."},
    {"name": "Radha Bai", "service": "cook", "rating": 4.5, "price": 449, "location": "Bengaluru", "experience": "3 years", "jobs": 134, "photo": "https://randomuser.me/api/portraits/women/57.jpg", "bio": "Tiffin and full meal service available."},
    # Massage
    {"name": "Deepa Shetty", "service": "massage", "rating": 4.9, "price": 699, "location": "Bengaluru", "experience": "7 years", "jobs": 389, "photo": "https://randomuser.me/api/portraits/women/68.jpg", "bio": "Certified therapist for body and head massage."},
    {"name": "Suma Kamath", "service": "massage", "rating": 4.7, "price": 599, "location": "Bengaluru", "experience": "5 years", "jobs": 221, "photo": "https://randomuser.me/api/portraits/women/79.jpg", "bio": "Ayurvedic and Swedish massage specialist."},
    {"name": "Nandini Rao", "service": "massage", "rating": 4.5, "price": 499, "location": "Bengaluru", "experience": "3 years", "jobs": 145, "photo": "https://randomuser.me/api/portraits/women/14.jpg", "bio": "Relaxing home massage at affordable rates."},
    # Home Security
    {"name": "Vikram Singh", "service": "home security", "rating": 4.8, "price": 899, "location": "Bengaluru", "experience": "9 years", "jobs": 234, "photo": "https://randomuser.me/api/portraits/men/57.jpg", "bio": "CCTV installation and smart lock setup expert."},
    {"name": "Arun Nair", "service": "home security", "rating": 4.6, "price": 799, "location": "Bengaluru", "experience": "6 years", "jobs": 178, "photo": "https://randomuser.me/api/portraits/men/68.jpg", "bio": "Home alarm systems and surveillance cameras."},
    # Glass & Aluminium
    {"name": "Salim Khan", "service": "glass & aluminium", "rating": 4.8, "price": 549, "location": "Bengaluru", "experience": "8 years", "jobs": 267, "photo": "https://randomuser.me/api/portraits/men/14.jpg", "bio": "Glass repair and aluminium frame specialist."},
    {"name": "Imran Sheikh", "service": "glass & aluminium", "rating": 4.6, "price": 449, "location": "Bengaluru", "experience": "5 years", "jobs": 189, "photo": "https://randomuser.me/api/portraits/men/25.jpg", "bio": "Sliding doors, windows and partitions."},
    # General
    {"name": "Fixio General Team", "service": "general", "rating": 4.5, "price": 299, "location": "Bengaluru", "experience": "5 years", "jobs": 450, "photo": "https://randomuser.me/api/portraits/men/90.jpg", "bio": "General home maintenance and repair."},
    {"name": "QuickFix Pro", "service": "general", "rating": 4.3, "price": 249, "location": "Bengaluru", "experience": "3 years", "jobs": 234, "photo": "https://randomuser.me/api/portraits/men/91.jpg", "bio": "All-round handyman for miscellaneous tasks."},
]
 
db["providers"].insert_many(providers)
print(f"✅ Seeded {len(providers)} providers successfully!")